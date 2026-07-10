export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admins: AdminRow
      users: UserRow
      hotels: HotelRow
      plans: PlanRow
      purchase_plans: PurchasePlanRow
      services: ServiceRow
      domains: DomainRow
      invoices: InvoiceRow
      deposits: DepositRow
      gateways: GatewayRow
      gateway_currencies: GatewayCurrencyRow
      extensions: ExtensionRow
      templates: TemplateRow
      frontends: FrontendRow
      pages: PageRow
      languages: LanguageRow
      notification_templates: NotificationTemplateRow
      notification_logs: NotificationLogRow
      support_tickets: SupportTicketRow
      support_messages: SupportMessageRow
      support_attachments: SupportAttachmentRow
      subscribers: SubscriberRow
      user_logins: UserLoginRow
      device_tokens: DeviceTokenRow
      general_settings: GeneralSettingRow
      cron_jobs: CronJobRow
      cron_job_logs: CronJobLogRow
      cron_schedules: CronScheduleRow
      forms: FormRow
      admin_notifications: AdminNotificationRow
      rooms: RoomRow
      room_prices: RoomPriceRow
      bookings: BookingRow
      booking_items: BookingItemRow
      guests: GuestRow
      hotel_staff: HotelStaffRow
      amenities: AmenityRow
      food_items: FoodItemRow
      shops: ShopRow
      pos_transactions: PosTransactionRow
      cleaning_tasks: CleaningTaskRow
      reviews: ReviewRow
      activities: ActivityRow
    }
  }
}

export interface ActivityRow {
  id: string
  hotel_id: string
  user_id: string | null
  action: string
  description: string
  created_at: string
}

export interface AdminRow {
  id: string
  name: string | null
  email: string | null
  username: string | null
  image: string | null
  password_hash: string
  created_at: string
  updated_at: string
}

export interface UserRow {
  id: string
  role: "super_admin" | "hotel_admin" | "staff"
  email: string
  username: string | null
  firstname: string | null
  lastname: string | null
  dial_code: string | null
  mobile: string | null
  password_hash: string | null
  country_name: string | null
  country_code: string | null
  city: string | null
  state: string | null
  zip: string | null
  address: string | null
  image: string | null
  status: number
  ev: number
  sv: number
  profile_complete: number
  is_terminated: number
  ban_reason: string | null
  provider: string | null
  provider_id: string | null
  created_at: string
  updated_at: string
}

export interface HotelRow {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  zip: string | null
  description: string | null
  logo: string | null
  cover_image: string | null
  check_in_time: string | null
  check_out_time: string | null
  currency: string
  currency_symbol: string
  timezone: string
  status: number
  created_at: string
  updated_at: string
}

export interface PlanRow {
  id: string
  name: string
  price: number
  validity: number
  status: number
  created_at: string
  updated_at: string
}

export interface PurchasePlanRow {
  id: string
  user_id: string
  plan_id: string
  price: number
  start_date: string | null
  end_date: string | null
  expired_date: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface ServiceRow {
  id: string
  user_id: string
  purchase_plan_id: string | null
  is_free_trial: number
  expiry_date: string | null
  next_invoice_date: string | null
  has_due_invoice: number
  subdomain: string | null
  project_url: string | null
  template_id: string | null
  status: number
  suspend_reason: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DomainRow {
  id: string
  user_id: string
  domain: string
  ns1: string | null
  ns2: string | null
  status: number
  expiry_date: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceRow {
  id: string
  invoice_number: string | null
  user_id: string
  purchase_plan_id: string | null
  description: Json | null
  items: Json | null
  amount: number
  payment_charge: number
  status: number
  due_date: string | null
  remark: string | null
  created_at: string
  updated_at: string
}

export interface DepositRow {
  id: string
  user_id: string
  invoice_id: string | null
  method_code: number
  amount: number
  method_currency: string | null
  charge: number
  rate: number
  final_amount: number
  detail: Json | null
  trx: string | null
  status: number
  admin_feedback: string | null
  created_at: string
  updated_at: string
}

export interface GatewayRow {
  id: string
  code: number
  name: string
  alias: string
  image: string | null
  status: number
  gateway_parameters: Json | null
  supported_currencies: Json | null
  crypto: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface GatewayCurrencyRow {
  id: string
  name: string | null
  currency: string | null
  symbol: string | null
  method_code: number | null
  gateway_alias: string | null
  min_amount: number
  max_amount: number
  percent_charge: number
  fixed_charge: number
  rate: number
  created_at: string
  updated_at: string
}

export interface ExtensionRow {
  id: string
  act: string | null
  name: string | null
  description: string | null
  image: string | null
  script: string | null
  shortcode: Json | null
  status: number
  created_at: string
  updated_at: string
}

export interface TemplateRow {
  id: string
  name: string
  demo_url: string | null
  thumbnail: string | null
  created_at: string
  updated_at: string
}

export interface FrontendRow {
  id: string
  data_keys: string | null
  data_values: Json | null
  seo_content: Json | null
  tempname: string | null
  slug: string | null
  created_at: string
  updated_at: string
}

export interface PageRow {
  id: string
  name: string | null
  slug: string | null
  tempname: string | null
  secs: Json | null
  seo_content: Json | null
  is_default: number
  created_at: string
  updated_at: string
}

export interface LanguageRow {
  id: string
  name: string | null
  code: string | null
  is_default: number
  image: string | null
  created_at: string
  updated_at: string
}

export interface NotificationTemplateRow {
  id: string
  act: string | null
  name: string | null
  subject: string | null
  push_title: string | null
  email_body: string | null
  sms_body: string | null
  push_body: string | null
  shortcodes: Json | null
  email_status: number
  sms_status: number
  push_status: number
  created_at: string
  updated_at: string
}

export interface NotificationLogRow {
  id: string
  user_id: string
  sender: string | null
  sent_from: string | null
  sent_to: string | null
  subject: string | null
  message: string | null
  notification_type: string | null
  image: string | null
  user_read: number
  created_at: string
  updated_at: string
}

export interface SupportTicketRow {
  id: string
  user_id: string | null
  name: string | null
  email: string | null
  ticket: string | null
  subject: string | null
  status: number
  priority: number
  last_reply: string | null
  created_at: string
  updated_at: string
}

export interface SupportMessageRow {
  id: string
  support_ticket_id: string
  admin_id: string | null
  message: string | null
  created_at: string
  updated_at: string
}

export interface SupportAttachmentRow {
  id: string
  support_message_id: string
  attachment: string | null
  created_at: string
  updated_at: string
}

export interface SubscriberRow {
  id: string
  email: string | null
  created_at: string
  updated_at: string
}

export interface UserLoginRow {
  id: string
  user_id: string
  user_ip: string | null
  city: string | null
  country: string | null
  browser: string | null
  os: string | null
  created_at: string
  updated_at: string
}

export interface DeviceTokenRow {
  id: string
  user_id: string
  is_app: number
  token: string | null
  created_at: string
  updated_at: string
}

export interface GeneralSettingRow {
  id: string
  site_name: string | null
  cur_text: string | null
  cur_sym: string | null
  email_from: string | null
  base_color: string | null
  secondary_color: string | null
  mail_config: Json | null
  sms_config: Json | null
  firebase_config: Json | null
  global_shortcodes: Json | null
  ev: number
  en: number
  sv: number
  sn: number
  pn: number
  force_ssl: number
  maintenance_mode: number
  secure_password: number
  agree: number
  multi_language: number
  registration: number
  trial_duration: number
  paginate_number: number
  currency_format: number
  created_at: string
  updated_at: string
}

export interface CronJobRow {
  id: string
  name: string | null
  alias: string | null
  action: Json | null
  url: string | null
  cron_schedule_id: string
  next_run: string | null
  last_run: string | null
  is_running: number
  is_default: number
  created_at: string
  updated_at: string
}

export interface CronJobLogRow {
  id: string
  cron_job_id: string
  start_at: string | null
  end_at: string | null
  duration: number
  error: string | null
  created_at: string
  updated_at: string
}

export interface CronScheduleRow {
  id: string
  name: string | null
  interval: number
  status: number
  created_at: string
  updated_at: string
}

export interface FormRow {
  id: string
  act: string | null
  form_data: Json | null
  created_at: string
  updated_at: string
}

export interface AdminNotificationRow {
  id: string
  user_id: string
  title: string | null
  is_read: number
  click_url: string | null
  is_api_error: number
  created_at: string
  updated_at: string
}

export interface RoomRow {
  id: string
  hotel_id: string
  room_number: string
  room_type: string
  floor: string | null
  description: string | null
  capacity: number
  price_per_night: number
  amenities: string[] | null
  images: string[] | null
  status: "available" | "occupied" | "maintenance" | "cleaning"
  created_at: string
  updated_at: string
}

export interface RoomPriceRow {
  id: string
  room_id: string
  date_from: string
  date_to: string
  price: number
  created_at: string
  updated_at: string
}

export interface BookingRow {
  id: string
  hotel_id: string
  guest_id: string | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  check_in: string
  check_out: string
  adults: number
  children: number
  total_amount: number
  paid_amount: number
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled"
  payment_status: "unpaid" | "partial" | "paid" | "refunded"
  source: "website" | "walk_in" | "admin"
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BookingItemRow {
  id: string
  booking_id: string
  room_id: string
  price_per_night: number
  nights: number
  total: number
  created_at: string
  updated_at: string
}

export interface GuestRow {
  id: string
  hotel_id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  id_type: string | null
  id_number: string | null
  nationality: string | null
  notes: string | null
  total_visits: number
  created_at: string
  updated_at: string
}

export interface HotelStaffRow {
  id: string
  hotel_id: string
  user_id: string | null
  name: string
  email: string
  phone: string | null
  role: "admin" | "receptionist" | "housekeeping" | "manager" | "staff"
  permissions: string[] | null
  status: number
  created_at: string
  updated_at: string
}

export interface AmenityRow {
  id: string
  hotel_id: string
  name: string
  icon: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface FoodItemRow {
  id: string
  hotel_id: string
  shop_id: string | null
  name: string
  description: string | null
  price: number
  category: string | null
  image: string | null
  available: number
  created_at: string
  updated_at: string
}

export interface ShopRow {
  id: string
  hotel_id: string
  name: string
  description: string | null
  image: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface PosTransactionRow {
  id: string
  hotel_id: string
  shop_id: string | null
  items: Json | null
  total: number
  payment_method: string
  created_at: string
  updated_at: string
}

export interface CleaningTaskRow {
  id: string
  hotel_id: string
  room_id: string
  assigned_to: string | null
  status: "pending" | "in_progress" | "completed"
  notes: string | null
  scheduled_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ReviewRow {
  id: string
  hotel_id: string
  guest_name: string | null
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}
