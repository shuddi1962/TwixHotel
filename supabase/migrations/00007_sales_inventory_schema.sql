-- 00007: Sales, Inventory & Staff Operations Schema
-- Adds: inventory, stock_movements, purchase_orders, pos_transaction_items,
--       staff_shifts, staff_attendance, low-stock triggers, KDS status on pos_transactions

-- ============================================================
-- 1. Add KDS status column to pos_transactions
-- ============================================================
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending','preparing','ready','served'));

-- Also add a nullable table/room reference for QR orders
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS table_room_id TEXT;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS order_type TEXT CHECK (order_type IN ('dine_in','takeaway','room_service','bar'));

-- ============================================================
-- 2. Inventory items — stock ledger for everything the hotel sells
-- ============================================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  unit TEXT NOT NULL DEFAULT 'unit',
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  sell_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  reorder_level DECIMAL(10,2) NOT NULL DEFAULT 5,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_hotel ON inventory_items(hotel_id);

-- ============================================================
-- 3. Stock movements — every change, whatever the cause
-- ============================================================
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('restock','sale','waste','transfer','adjustment')),
  quantity DECIMAL(10,2) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_item ON stock_movements(item_id);
CREATE INDEX idx_stock_movements_hotel_created ON stock_movements(hotel_id, created_at DESC);

-- ============================================================
-- 4. Purchase orders — auto-suggested when stock < reorder_level
-- ============================================================
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','ordered','received','cancelled')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchase_orders_hotel ON purchase_orders(hotel_id);
CREATE INDEX idx_purchase_orders_item ON purchase_orders(item_id);

-- ============================================================
-- 5. POS transaction items — normalized rows from pos_transactions JSONB
-- ============================================================
CREATE TABLE pos_transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  sold_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pos_items_hotel_created ON pos_transaction_items(hotel_id, created_at DESC);
CREATE INDEX idx_pos_items_item ON pos_transaction_items(item_id);
CREATE INDEX idx_pos_items_transaction ON pos_transaction_items(transaction_id);

-- ============================================================
-- 6. Link food_items to inventory for stock deduction
-- ============================================================
ALTER TABLE food_items ADD COLUMN IF NOT EXISTS inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL;

-- ============================================================
-- 7. Staff shifts & attendance
-- ============================================================
CREATE TABLE staff_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES hotel_staff(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_shifts_hotel ON staff_shifts(hotel_id);
CREATE INDEX idx_staff_shifts_staff ON staff_shifts(staff_id);

CREATE TABLE staff_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES hotel_staff(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clock_out TIMESTAMPTZ
);

CREATE INDEX idx_staff_attendance_hotel ON staff_attendance(hotel_id);
CREATE INDEX idx_staff_attendance_staff ON staff_attendance(staff_id);

-- ============================================================
-- 8. Trigger: auto-decrement inventory on stock_movements INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION handle_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
  new_stock DECIMAL(10,2);
  reorder_qty DECIMAL(10,2);
BEGIN
  UPDATE inventory_items
  SET current_stock = current_stock + NEW.quantity,
      updated_at = NOW()
  WHERE id = NEW.item_id
  RETURNING current_stock, reorder_level INTO new_stock, reorder_qty;

  -- Auto-generate purchase order if stock drops below reorder level
  -- and no pending/ordered PO already exists for this item
  IF NEW.type IN ('sale', 'waste') AND new_stock < reorder_qty THEN
    INSERT INTO purchase_orders (hotel_id, item_id, quantity, status, created_by)
    SELECT NEW.hotel_id, NEW.item_id, GREATEST(reorder_qty * 2, 10), 'pending', NEW.created_by
    WHERE NOT EXISTS (
      SELECT 1 FROM purchase_orders
      WHERE item_id = NEW.item_id AND status IN ('pending', 'ordered')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stock_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION handle_stock_movement();

-- ============================================================
-- 9. Function: process a POS sale (atomic)
-- ============================================================
CREATE OR REPLACE FUNCTION process_pos_sale(
  p_hotel_id UUID,
  p_shop_id UUID,
  p_payment_method TEXT,
  p_items JSONB,
  p_sold_by UUID,
  p_order_type TEXT DEFAULT NULL,
  p_table_room_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_txn_id UUID;
  v_item JSONB;
  v_item_id UUID;
  v_total DECIMAL(10,2) := 0;
BEGIN
  -- Calculate total
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_total := v_total + (v_item->>'total')::DECIMAL(10,2);
  END LOOP;

  -- Insert transaction
  INSERT INTO pos_transactions (hotel_id, shop_id, total, payment_method, items, status, order_type, table_room_id)
  VALUES (p_hotel_id, p_shop_id, v_total, p_payment_method, p_items, 'pending', p_order_type, p_table_room_id)
  RETURNING id INTO v_txn_id;

  -- Insert line items + stock movements
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Insert pos_transaction_items
    INSERT INTO pos_transaction_items (
      transaction_id, hotel_id, shop_id, item_id, item_name, category,
      quantity, unit_price, total, sold_by
    ) VALUES (
      v_txn_id,
      p_hotel_id,
      p_shop_id,
      (v_item->>'item_id')::UUID,
      v_item->>'item_name',
      v_item->>'category',
      (v_item->>'quantity')::DECIMAL(10,2),
      (v_item->>'unit_price')::DECIMAL(10,2),
      (v_item->>'total')::DECIMAL(10,2),
      p_sold_by
    );

    -- Insert stock movement (negative for sale)
    v_item_id := (v_item->>'item_id')::UUID;
    IF v_item_id IS NOT NULL THEN
      INSERT INTO stock_movements (hotel_id, item_id, type, quantity, reference_type, reference_id, created_by)
      VALUES (p_hotel_id, v_item_id, 'sale', -(v_item->>'quantity')::DECIMAL(10,2), 'pos_transaction', v_txn_id, p_sold_by);
    END IF;
  END LOOP;

  -- Log activity
  INSERT INTO activities (hotel_id, user_id, action, description)
  VALUES (
    p_hotel_id, p_sold_by, 'Sale',
    format('POS sale #%s — %s items, total %s', v_txn_id::TEXT, jsonb_array_length(p_items)::TEXT, v_total::TEXT)
  );

  RETURN v_txn_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 10. RLS policies for new tables
-- ============================================================
-- Use same pattern as 00004/00005: hotel admins manage their own data,
-- staff can read via hotel_staff join

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;

-- Inventory items
CREATE POLICY "Hotel admins manage inventory" ON inventory_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = inventory_items.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff view inventory" ON inventory_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = inventory_items.hotel_id AND s.user_id = auth.uid())
  );

-- Stock movements
CREATE POLICY "Hotel admins manage stock movements" ON stock_movements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = stock_movements.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff view stock movements" ON stock_movements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = stock_movements.hotel_id AND s.user_id = auth.uid())
  );

-- Purchase orders
CREATE POLICY "Hotel admins manage purchase orders" ON purchase_orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = purchase_orders.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff view purchase orders" ON purchase_orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = purchase_orders.hotel_id AND s.user_id = auth.uid())
  );

-- POS transaction items
CREATE POLICY "Hotel admins manage pos items" ON pos_transaction_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = pos_transaction_items.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff view pos items" ON pos_transaction_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = pos_transaction_items.hotel_id AND s.user_id = auth.uid())
  );

-- Staff shifts
CREATE POLICY "Hotel admins manage staff shifts" ON staff_shifts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = staff_shifts.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff view own shifts" ON staff_shifts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = staff_shifts.hotel_id AND s.user_id = auth.uid())
  );

-- Staff attendance
CREATE POLICY "Hotel admins manage attendance" ON staff_attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = staff_attendance.hotel_id AND h.user_id = auth.uid())
  );
CREATE POLICY "Staff manage own attendance" ON staff_attendance
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = staff_attendance.hotel_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Staff view own attendance" ON staff_attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = staff_attendance.hotel_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Staff update own clock out" ON staff_attendance
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = staff_attendance.hotel_id AND s.user_id = auth.uid())
  );

-- ============================================================
-- 11. Enable Realtime for live sales monitoring
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE pos_transaction_items;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_movements;
ALTER PUBLICATION supabase_realtime ADD TABLE pos_transactions;
