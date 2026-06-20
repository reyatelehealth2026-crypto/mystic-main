import { getServiceClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/supabase/users";
import { getCreditCost } from "@/lib/monetization/creditCost";
import { getServiceCost } from "@/lib/supabase/catalog";
import type { CreditCheckResult } from "@/lib/monetization/paywall";
import { ReadingType } from "@/lib/reading/types";

/**
 * Authoritative per-reading cost: a DB override (admin-managed `service_costs`)
 * wins, otherwise the static default. Period-based costs fall back to the
 * default so weekly/monthly multipliers stay intact.
 */
async function resolveCreditCost(
  readingType: ReadingType,
  options?: { period?: "daily" | "weekly" | "monthly" } & Record<string, unknown>,
): Promise<number> {
  if (!options?.period) {
    try {
      const override = await getServiceCost(readingType);
      if (override != null) return override;
    } catch {
      // fall through to the static default
    }
  }
  return getCreditCost(readingType, options);
}

type CreditOptions = { period?: "daily" | "weekly" | "monthly" } & Record<string, unknown>;

/**
 * Server-side mirror of the client paywall. Authoritative source of truth for
 * credit balances; localStorage is only a fallback for anonymous users.
 *
 * "First reading of a type is free" is enforced against the ledger
 * (`credit_transactions`) instead of localStorage flags.
 */

async function hasUsedFreeReading(userId: string, type: ReadingType): Promise<boolean> {
  const db = getServiceClient();
  const { count, error } = await db
    .from("credit_transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("reading_type", type);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function checkServerCredits(
  userId: string,
  readingType: ReadingType,
  options?: CreditOptions,
): Promise<CreditCheckResult> {
  const requiredCredits = await resolveCreditCost(readingType, options);
  const user = await getUserById(userId);
  const currentCredits = user?.credits ?? 0;
  const isFreeReading = !(await hasUsedFreeReading(userId, readingType));

  if (isFreeReading) {
    return {
      hasCredits: true,
      isFreeReading: true,
      requiredCredits,
      currentCredits,
      reason: "first_reading_free",
    };
  }

  const hasCredits = currentCredits >= requiredCredits;
  return {
    hasCredits,
    isFreeReading: false,
    requiredCredits,
    currentCredits,
    reason: hasCredits ? "sufficient_credits" : "insufficient_credits",
  };
}

export interface DeductResult {
  ok: boolean;
  isFreeReading: boolean;
  newBalance: number;
  reason: string;
}

/**
 * Deduct credits for a successful reading. The first reading of a given type is
 * free but still records a zero-delta ledger row so the "free" status flips to
 * used. Paid readings call the atomic `apply_credit_delta` RPC.
 */
export async function deductServerCredits(
  userId: string,
  readingType: ReadingType,
  options?: CreditOptions,
): Promise<DeductResult> {
  const db = getServiceClient();
  const check = await checkServerCredits(userId, readingType, options);

  if (check.isFreeReading) {
    // Record a zero-delta marker so subsequent reads are charged.
    const { error } = await db.rpc("apply_credit_delta", {
      p_user_id: userId,
      p_delta: 0,
      p_reason: "reading_spend",
      p_reading_type: readingType,
    });
    if (error) throw error;
    return { ok: true, isFreeReading: true, newBalance: check.currentCredits, reason: "first_reading_free" };
  }

  if (!check.hasCredits) {
    return { ok: false, isFreeReading: false, newBalance: check.currentCredits, reason: "insufficient_credits" };
  }

  const { data, error } = await db.rpc("apply_credit_delta", {
    p_user_id: userId,
    p_delta: -check.requiredCredits,
    p_reason: "reading_spend",
    p_reading_type: readingType,
  });
  if (error) throw error;
  return { ok: true, isFreeReading: false, newBalance: data as number, reason: "deducted" };
}

export async function grantCredits(
  userId: string,
  amount: number,
  reason: "purchase" | "admin_adjust" | "signup_bonus",
  orderId?: string,
): Promise<number> {
  const db = getServiceClient();
  const { data, error } = await db.rpc("apply_credit_delta", {
    p_user_id: userId,
    p_delta: amount,
    p_reason: reason,
    p_order_id: orderId ?? null,
  });
  if (error) throw error;
  return data as number;
}
