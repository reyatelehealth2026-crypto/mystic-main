import { getServiceClient } from "@/lib/supabase/server";

/**
 * Lifetime earned credits (สะสมรวม) = sum of all positive ledger deltas. Drives
 * the membership tier; never decreases when the user spends.
 */
export async function getLifetimeCredits(userId: string): Promise<number> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("credit_transactions")
    .select("delta")
    .eq("user_id", userId)
    .gt("delta", 0);
  if (error) throw error;
  return ((data as { delta: number }[]) ?? []).reduce((sum, r) => sum + r.delta, 0);
}
