import { getServiceClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/types";

/** Credits granted once when a brand-new account is created. */
export const SIGNUP_BONUS_CREDITS = 3;

export interface LineProfile {
  lineUserId: string;
  displayName?: string | null;
  pictureUrl?: string | null;
  statusMessage?: string | null;
}

export async function getUserByLineId(lineUserId: string): Promise<UserRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();
  if (error) throw error;
  return (data as UserRow) ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const db = getServiceClient();
  const { data, error } = await db.from("users").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as UserRow) ?? null;
}

/**
 * Insert-or-update a user keyed by `line_user_id`. On first creation grants the
 * signup bonus through the credit ledger so `users.credits` stays consistent
 * with `credit_transactions`. Always refreshes profile fields + `last_login_at`.
 */
export async function upsertUserFromLine(profile: LineProfile): Promise<UserRow> {
  const db = getServiceClient();
  const existing = await getUserByLineId(profile.lineUserId);
  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await db
      .from("users")
      .update({
        display_name: profile.displayName ?? existing.display_name,
        picture_url: profile.pictureUrl ?? existing.picture_url,
        status_message: profile.statusMessage ?? existing.status_message,
        last_login_at: now,
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as UserRow;
  }

  const { data, error } = await db
    .from("users")
    .insert({
      line_user_id: profile.lineUserId,
      display_name: profile.displayName ?? null,
      picture_url: profile.pictureUrl ?? null,
      status_message: profile.statusMessage ?? null,
      credits: 0,
      membership_tier: "free",
      last_login_at: now,
    })
    .select("*")
    .single();
  if (error) throw error;

  // Grant signup bonus atomically via the ledger function.
  if (SIGNUP_BONUS_CREDITS > 0) {
    const { error: rpcError } = await db.rpc("apply_credit_delta", {
      p_user_id: (data as UserRow).id,
      p_delta: SIGNUP_BONUS_CREDITS,
      p_reason: "signup_bonus",
    });
    if (rpcError) throw rpcError;
    return { ...(data as UserRow), credits: SIGNUP_BONUS_CREDITS };
  }
  return data as UserRow;
}
