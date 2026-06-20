import { getServiceClient } from "@/lib/supabase/server";

export interface RewardRow {
  id: string;
  name: string;
  description: string | null;
  cost_credits: number;
  active: boolean;
  created_at: string;
}

export async function listRewards(): Promise<RewardRow[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("rewards")
    .select("*")
    .eq("active", true)
    .order("cost_credits", { ascending: true });
  if (error) throw error;
  return (data as RewardRow[]) ?? [];
}

export interface RedeemResult {
  ok: boolean;
  reason?: string;
  newBalance?: number;
}

/** Redeem a reward: deduct credits atomically, then log the redemption. */
export async function redeemReward(userId: string, rewardId: string): Promise<RedeemResult> {
  const db = getServiceClient();

  const { data: reward, error: rErr } = await db
    .from("rewards")
    .select("*")
    .eq("id", rewardId)
    .eq("active", true)
    .maybeSingle();
  if (rErr) throw rErr;
  if (!reward) return { ok: false, reason: "reward_not_found" };

  const cost = (reward as RewardRow).cost_credits;
  const { data, error } = await db.rpc("apply_credit_delta", {
    p_user_id: userId,
    p_delta: -cost,
    p_reason: "reward_redeem",
  });
  if (error) {
    if (String(error.message ?? "").includes("insufficient_credits")) {
      return { ok: false, reason: "insufficient_credits" };
    }
    throw error;
  }

  await db.from("reward_redemptions").insert({
    user_id: userId,
    reward_id: rewardId,
    cost_credits: cost,
    status: "pending",
  });

  return { ok: true, newBalance: data as number };
}

export interface PendingRedemption {
  id: string;
  cost_credits: number;
  created_at: string;
  user: { display_name: string | null; line_user_id: string };
  reward: { name: string };
}

export async function listPendingRedemptions(): Promise<PendingRedemption[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("reward_redemptions")
    .select("id, cost_credits, created_at, users:user_id (display_name, line_user_id), rewards:reward_id (name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r.id as string,
    cost_credits: r.cost_credits as number,
    created_at: r.created_at as string,
    user: r.users as PendingRedemption["user"],
    reward: r.rewards as PendingRedemption["reward"],
  }));
}

export async function fulfillRedemption(id: string): Promise<boolean> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("reward_redemptions")
    .update({ status: "fulfilled" })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
