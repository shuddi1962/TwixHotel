CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL, ns1 TEXT, ns2 TEXT, ns3 TEXT, ns4 TEXT,
  id_protection SMALLINT DEFAULT 0,
  first_payment_amount DECIMAL(28,16) DEFAULT 0,
  recurring_amount DECIMAL(28,16) DEFAULT 0,
  is_renewable SMALLINT DEFAULT 1, status SMALLINT DEFAULT 0,
  reg_period INT DEFAULT 1, expiry_date DATE,
  next_invoice_date DATE, has_due_invoice SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT, user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purchase_plan_id UUID REFERENCES purchase_plans(id),
  description JSONB, items JSONB,
  amount DECIMAL(28,8) NOT NULL DEFAULT 0,
  payment_charge DECIMAL(28,8) NOT NULL DEFAULT 0,
  status SMALLINT DEFAULT 0, due_date DATE,
  next_reminder_date DATE, reminded_at TIMESTAMPTZ, remark TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  method_code INT NOT NULL DEFAULT 0,
  amount DECIMAL(28,8) NOT NULL DEFAULT 0,
  method_currency TEXT, charge DECIMAL(28,8) NOT NULL DEFAULT 0,
  rate DECIMAL(28,8) NOT NULL DEFAULT 0,
  final_amount DECIMAL(28,8) NOT NULL DEFAULT 0,
  detail JSONB, trx TEXT, payment_try INT DEFAULT 0,
  status SMALLINT DEFAULT 0, from_api SMALLINT DEFAULT 0,
  admin_feedback TEXT, success_url TEXT, failed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gateways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code INT UNIQUE, name TEXT, alias TEXT NOT NULL, image TEXT,
  status SMALLINT DEFAULT 1,
  gateway_parameters JSONB, supported_currencies JSONB,
  crypto SMALLINT DEFAULT 0, extra JSONB, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gateway_currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, currency TEXT, symbol TEXT, method_code INT,
  gateway_alias TEXT,
  min_amount DECIMAL(28,8) DEFAULT 0, max_amount DECIMAL(28,8) DEFAULT 0,
  percent_charge DECIMAL(5,2) DEFAULT 0, fixed_charge DECIMAL(28,8) DEFAULT 0,
  rate DECIMAL(28,8) DEFAULT 0, gateway_parameter JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, demo_url TEXT, thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE extensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  act TEXT, name TEXT, description TEXT, image TEXT, script TEXT,
  shortcode JSONB, status SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE frontends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_keys TEXT, data_values JSONB, seo_content JSONB,
  tempname TEXT, slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, slug TEXT, tempname TEXT, secs JSONB,
  seo_content JSONB, is_default SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
