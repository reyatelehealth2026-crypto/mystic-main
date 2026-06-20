import { getServiceClient } from "@/lib/supabase/server";
import type { SubscriptionPlan } from "@/lib/subscription/plans";

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  monthly_quota: number;
  used_count: number;
  period_start: string;
  period_end: string;
  status: "active" | "expired";
  created_at: string;
}

export async function getActiveSubscription(userId: string): Promise<SubscriptionRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as SubscriptionRow) ?? null;
}

export async function createSubscription(
  userId: string,
  plan: SubscriptionPlan,
): Promise<SubscriptionRow> {
  const db = getServiceClient();
  // Expire any current active subscription (one active plan at a time).
  await db.from("subscriptions").update({ status: "expired" }).eq("user_id", userId).eq("status", "active");

  const start = new Date();
  const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  const { data, error } = await db
    .from("subscriptions")
    .insert({
      user_id: userId,
      plan_id: plan.id,
      plan_name: plan.name,
      monthly_quota: plan.monthlyQuota,
      used_count: 0,
      period_start: start.toISOString(),
      period_end: end.toISOString(),
      status: "active",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as SubscriptionRow;
}

/**
 * Atomically consume one quota unit. Returns true only if an active, in-period
 * subscription had quota left. The optimistic `used_count` match guards races.
 */
export async function consumeSubscriptionQuota(userId: string): Promise<boolean> {
  const db = getServiceClient();
  const sub = await getActiveSubscription(userId);
  if (!sub) return false;

  const nowIso = new Date().toISOString();
  const { data, error } = await db
    .from("subscriptions")
    .update({ used_count: sub.used_count + 1 })
    .eq("id", sub.id)
    .eq("used_count", sub.used_count)
    .lt("used_count", sub.monthly_quota)
    .gt("period_end", nowIso)
    .eq("status", "active")
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
