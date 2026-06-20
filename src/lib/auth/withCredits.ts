import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth/getCurrentUser";
import { checkServerCredits, deductServerCredits } from "@/lib/supabase/credits";
import { recordReading, type ReadingHistoryInput } from "@/lib/supabase/history";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/types";
import type { ReadingType } from "@/lib/reading/types";

type CreditOptions = { period?: "daily" | "weekly" | "monthly" } & Record<string, unknown>;

export interface CreditGate {
  /** The authenticated user, or null for anonymous requests. */
  user: UserRow | null;
  /**
   * When non-null, the caller MUST return this response immediately — the user
   * is logged in but lacks credits (HTTP 402).
   */
  blockedResponse: NextResponse | null;
}

/**
 * Optional, auth-aware credit gate for AI reading routes.
 *
 * - Anonymous (no session) → `{ user: null, blockedResponse: null }`; the route
 *   proceeds exactly as before (client localStorage paywall governs). This keeps
 *   the existing graceful behavior and the "same input → same baseline"
 *   invariant intact.
 * - Logged-in with enough credits → `{ user, blockedResponse: null }`.
 * - Logged-in but insufficient → `blockedResponse` is a 402 to return.
 *
 * If Supabase is not configured the gate is a no-op (anonymous), so the app
 * still works without a backend.
 */
export async function creditGate(
  readingType: ReadingType,
  options?: CreditOptions,
): Promise<CreditGate> {
  if (!isSupabaseConfigured()) return { user: null, blockedResponse: null };

  let user: UserRow | null = null;
  try {
    user = await getOptionalUser();
  } catch {
    user = null;
  }
  if (!user) return { user: null, blockedResponse: null };

  const check = await checkServerCredits(user.id, readingType, options);
  if (!check.hasCredits) {
    return {
      user,
      blockedResponse: NextResponse.json(
        {
          error: "insufficient_credits",
          requiredCredits: check.requiredCredits,
          currentCredits: check.currentCredits,
        },
        { status: 402 },
      ),
    };
  }
  return { user, blockedResponse: null };
}

/**
 * Settle a SUCCESSFUL reading: deduct credits and record server history.
 * Call this only when the reading actually produced a real result — do NOT call
 * it for `fallback: true` responses (we don't charge for fallbacks).
 *
 * Best-effort: failures here never break the user-facing response.
 */
export async function settleReading(params: {
  user: UserRow | null;
  readingType: ReadingType;
  options?: CreditOptions;
  history?: ReadingHistoryInput;
}): Promise<void> {
  const { user, readingType, options, history } = params;
  if (!user) return;
  try {
    await deductServerCredits(user.id, readingType, options);
    if (history) await recordReading(user.id, history);
  } catch {
    // Swallow — the reading already succeeded for the user.
  }
}
