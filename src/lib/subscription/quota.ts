/**
 * Pure helper: how many subscription uses remain right now. Returns 0 for no
 * subscription, expired status, or a lapsed period. No IO so it is testable.
 */
export interface SubscriptionLike {
  monthly_quota: number;
  used_count: number;
  period_end: string; // ISO
  status: string;
}

export function subscriptionRemaining(sub: SubscriptionLike | null, nowIso: string): number {
  if (!sub || sub.status !== "active") return 0;
  if (new Date(sub.period_end).getTime() <= new Date(nowIso).getTime()) return 0;
  return Math.max(0, sub.monthly_quota - sub.used_count);
}
