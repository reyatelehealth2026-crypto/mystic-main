// Hand-written row types for the CRM schema (see supabase/migrations/0001_init.sql).
// Kept in sync manually; strict-clean so the rest of the app stays typed.

export interface UserRow {
  id: string;
  line_user_id: string;
  display_name: string | null;
  picture_url: string | null;
  status_message: string | null;
  credits: number;
  membership_tier: string;
  created_at: string;
  last_login_at: string | null;
  // Added by 0002_notification_prefs.sql
  daily_push_opt_in: boolean;
  daily_push_hour: number;             // 0–23, Asia/Bangkok
  daily_push_last_sent_on: string | null; // YYYY-MM-DD (Bangkok date)
}

export interface ReadingHistoryRow {
  id: string;
  user_id: string;
  type: string;
  summary: string | null;
  details: Record<string, unknown> | null;
  client_id: string | null;
  created_at: string;
}

export interface PackageRow {
  id: string;
  name: string;
  credit_amount: number;
  price_cents: number;
  active: boolean;
}

export interface OrderRow {
  id: string;
  user_id: string;
  package_id: string | null;
  credit_amount: number;
  price_cents: number;
  status: "pending" | "paid" | "failed";
  provider: string | null;
  provider_ref: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface CreditTransactionRow {
  id: string;
  user_id: string;
  delta: number;
  reason: "purchase" | "reading_spend" | "signup_bonus" | "admin_adjust";
  reading_type: string | null;
  order_id: string | null;
  balance_after: number;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string | null;
  channel: string;
  message_type: string | null;
  payload: Record<string, unknown> | null;
  status: "sent" | "failed";
  error: string | null;
  created_at: string;
}
