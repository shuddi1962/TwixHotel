CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL DEFAULT 'hotel_admin' CHECK (role IN ('super_admin','hotel_admin','staff')),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  firstname TEXT, lastname TEXT, dial_code TEXT, mobile TEXT,
  password_hash TEXT, country_name TEXT, country_code TEXT,
  city TEXT, state TEXT, zip TEXT, address TEXT, image TEXT,
  status SMALLINT NOT NULL DEFAULT 1,
  ev SMALLINT NOT NULL DEFAULT 0, sv SMALLINT NOT NULL DEFAULT 0,
  profile_complete SMALLINT NOT NULL DEFAULT 0,
  is_terminated SMALLINT NOT NULL DEFAULT 0, ban_reason TEXT,
  provider TEXT, provider_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, email TEXT, username TEXT, image TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE general_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT, cur_text TEXT DEFAULT 'USD', cur_sym TEXT DEFAULT '$',
  email_from TEXT, base_color TEXT, secondary_color TEXT,
  mail_config JSONB, sms_config JSONB, firebase_config JSONB,
  global_shortcodes JSONB,
  ev SMALLINT DEFAULT 0, en SMALLINT DEFAULT 0,
  sv SMALLINT DEFAULT 0, sn SMALLINT DEFAULT 0, pn SMALLINT DEFAULT 1,
  force_ssl SMALLINT DEFAULT 0, maintenance_mode SMALLINT DEFAULT 0,
  secure_password SMALLINT DEFAULT 0, agree SMALLINT DEFAULT 0,
  multi_language SMALLINT DEFAULT 1, registration SMALLINT DEFAULT 1,
  free_plan SMALLINT DEFAULT 1, trial_duration INT DEFAULT 14,
  paginate_number INT DEFAULT 20, currency_format SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, email TEXT, phone TEXT, address TEXT,
  city TEXT, state TEXT, country TEXT, zip TEXT, description TEXT,
  logo TEXT, cover_image TEXT, check_in_time TEXT DEFAULT '14:00',
  check_out_time TEXT DEFAULT '12:00', currency TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$', timezone TEXT DEFAULT 'UTC',
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, price DECIMAL(28,8) NOT NULL DEFAULT 0,
  validity INT NOT NULL DEFAULT 0, status SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  price DECIMAL(28,8) NOT NULL DEFAULT 0,
  start_date DATE, end_date DATE, expired_date DATE,
  status SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purchase_plan_id UUID REFERENCES purchase_plans(id),
  is_free_trial SMALLINT DEFAULT 0, expiry_date DATE,
  next_invoice_date DATE, has_due_invoice SMALLINT DEFAULT 0,
  subdomain TEXT, project_url TEXT, template_id UUID,
  status SMALLINT DEFAULT 0, suspend_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
