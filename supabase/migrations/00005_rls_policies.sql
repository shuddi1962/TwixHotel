-- Users can view their own hotel data
CREATE POLICY "Users view own hotel" ON hotels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own hotel" ON hotels
  FOR UPDATE USING (auth.uid() = user_id);

-- Hotel admins manage their rooms
CREATE POLICY "Hotel admins manage rooms" ON rooms
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage bookings
CREATE POLICY "Hotel admins manage bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id AND h.user_id = auth.uid())
  );

CREATE POLICY "Hotel admins manage booking items" ON booking_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM bookings b JOIN hotels h ON h.id = b.hotel_id
      WHERE b.id = booking_items.booking_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage guests
CREATE POLICY "Hotel admins manage guests" ON guests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = guests.hotel_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage staff
CREATE POLICY "Hotel admins manage staff" ON hotel_staff
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_staff.hotel_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage food/shops/POS
CREATE POLICY "Hotel admins manage food" ON food_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = food_items.hotel_id AND h.user_id = auth.uid())
  );

CREATE POLICY "Hotel admins manage shops" ON shops
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = shops.hotel_id AND h.user_id = auth.uid())
  );

CREATE POLICY "Hotel admins manage pos" ON pos_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = pos_transactions.hotel_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage cleaning
CREATE POLICY "Hotel admins manage cleaning" ON cleaning_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = cleaning_tasks.hotel_id AND h.user_id = auth.uid())
  );

-- Hotel admins manage invoices
CREATE POLICY "Hotel admins view invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

-- Users view own deposits
CREATE POLICY "Users view own deposits" ON deposits
  FOR SELECT USING (auth.uid() = user_id);

-- Users view own support tickets
CREATE POLICY "Users manage own tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);

-- Super admin can access everything (bypasses RLS via service_role)
-- Staff can view assigned hotel data
CREATE POLICY "Staff view hotel rooms" ON rooms
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = rooms.hotel_id AND s.user_id = auth.uid() AND s.status = 1)
  );

CREATE POLICY "Staff view hotel bookings" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM hotel_staff s WHERE s.hotel_id = bookings.hotel_id AND s.user_id = auth.uid() AND s.status = 1)
  );

-- Public: can view reviews
CREATE POLICY "Public view reviews" ON reviews
  FOR SELECT USING (true);

-- Hotel admins manage reviews
CREATE POLICY "Hotel admins manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM hotels h WHERE h.id = reviews.hotel_id AND h.user_id = auth.uid())
  );

-- Users can subscribe
CREATE POLICY "Users manage subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);
