CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, code TEXT, is_default SMALLINT DEFAULT 0, image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT, title TEXT, message TEXT,
  is_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  act TEXT, name TEXT, subject TEXT, push_title TEXT,
  email_body TEXT, sms_body TEXT, push_body TEXT,
  shortcodes JSONB, email_status SMALLINT DEFAULT 1,
  sms_status SMALLINT DEFAULT 1, push_status SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender TEXT, sent_from TEXT, sent_to TEXT,
  subject TEXT, message TEXT, notification_type TEXT,
  image TEXT, user_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT, email TEXT, ticket TEXT, subject TEXT,
  status SMALLINT DEFAULT 0, priority SMALLINT DEFAULT 0,
  last_reply TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  support_ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE support_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  support_message_id UUID NOT NULL REFERENCES support_messages(id) ON DELETE CASCADE,
  attachment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_ip TEXT, city TEXT, country TEXT, country_code TEXT,
  longitude TEXT, latitude TEXT, browser TEXT, os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_app SMALLINT DEFAULT 0, token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  act TEXT, form_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT, is_read SMALLINT DEFAULT 0,
  click_url TEXT, is_api_error SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cron_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, interval INT NOT NULL DEFAULT 0,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cron_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT, alias TEXT, action JSONB, url TEXT,
  cron_schedule_id UUID REFERENCES cron_schedules(id) ON DELETE CASCADE,
  next_run TIMESTAMPTZ, last_run TIMESTAMPTZ,
  is_running SMALLINT DEFAULT 1, is_default SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cron_job_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cron_job_id UUID NOT NULL REFERENCES cron_jobs(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ, end_at TIMESTAMPTZ,
  duration INT DEFAULT 0, error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
