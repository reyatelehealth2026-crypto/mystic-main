/**
 * Server-only helpers for daily-push notification preferences.
 * All access via getServiceClient() (service-role, bypasses RLS).
 * See supabase/migrations/0002_notification_prefs.sql for schema.
 */

import { getServiceClient } from "@/lib/supabase/server";

export interface NotificationPrefs {
  optIn: boolean;
  hour: number; // 0–23 Asia/Bangkok
}

export async function getNotificationPrefs(userId: string): Promise<NotificationPrefs> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("users")
    .select("daily_push_opt_in, daily_push_hour")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return {
    optIn: (data as { daily_push_opt_in: boolean }).daily_push_opt_in,
    hour: (data as { daily_push_hour: number }).daily_push_hour,
  };
}

export async function setNotificationPrefs(
  userId: string,
  prefs: { optIn?: boolean; hour?: number },
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (prefs.optIn !== undefined) update.daily_push_opt_in = prefs.optIn;
  if (prefs.hour !== undefined) update.daily_push_hour = prefs.hour;
  if (Object.keys(update).length === 0) return;

  const db = getServiceClient();
  const { error } = await db.from("users").update(update).eq("id", userId);
  if (error) throw error;
}

/** Batch query for users due for a daily push at the given Bangkok hour + date. */
export async function listUsersDueForDailyPush(
  bangkokHour: number,
  todayBkk: string, // "YYYY-MM-DD"
  limit = 500,
): Promise<Array<{ id: string; line_user_id: string }>> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("users")
    .select("id, line_user_id")
    .eq("daily_push_opt_in", true)
    .eq("daily_push_hour", bangkokHour)
    // Idempotency: skip users already sent today
    .or(`daily_push_last_sent_on.is.null,daily_push_last_sent_on.neq.${todayBkk}`)
    .not("line_user_id", "is", null)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Array<{ id: string; line_user_id: string }>;
}

/** Mark a user's daily push as sent for today (idempotency key). */
export async function markDailyPushSent(userId: string, todayBkk: string): Promise<void> {
  const db = getServiceClient();
  const { error } = await db
    .from("users")
    .update({ daily_push_last_sent_on: todayBkk })
    .eq("id", userId);
  if (error) throw error;
}
