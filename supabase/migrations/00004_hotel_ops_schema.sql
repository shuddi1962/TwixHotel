CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL, room_type TEXT NOT NULL,
  floor TEXT, description TEXT, capacity INT NOT NULL DEFAULT 1,
  price_per_night DECIMAL(10,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}', images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance','cleaning')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, room_number)
);

CREATE TABLE room_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  date_from DATE NOT NULL, date_to DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL, email TEXT, phone TEXT, address TEXT,
  id_type TEXT, id_number TEXT, nationality TEXT, notes TEXT,
  total_visits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL, guest_email TEXT NOT NULL,
  guest_phone TEXT, check_in DATE NOT NULL, check_out DATE NOT NULL,
  adults INT DEFAULT 1, children INT DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','checked_in','checked_out','cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid','refunded')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website','walk_in','admin')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  price_per_night DECIMAL(10,2) NOT NULL,
  nights INT NOT NULL, total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hotel_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL, email TEXT, phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin','receptionist','housekeeping','manager','staff')),
  permissions TEXT[] DEFAULT '{}', status SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL, icon TEXT, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  name TEXT NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL,
  category TEXT, image TEXT, available SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT, image TEXT,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pos_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  items JSONB, total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  assigned_to TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  scheduled_at TIMESTAMPTZ, completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  guest_name TEXT, rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hotels_user_id ON hotels(user_id);
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_guests_hotel_id ON guests(hotel_id);
CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_activities_hotel_id ON activities(hotel_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
