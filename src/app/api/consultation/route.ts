import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { decideConsultationStart, CONSULTATION_CREDIT_COST } from "@/lib/consultation/policy";
import { getOpenConsultationForUser, openConsultation } from "@/lib/supabase/consultations";
import { consumeSubscriptionQuota, refundSubscriptionQuota } from "@/lib/supabase/subscriptions";
import { getServiceCost } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

/** Current open round for the logged-in user (no charge). */
export async function GET() {
  try {
    const user = await requireUser();
    const consultation = await getOpenConsultationForUser(user.id);
    return NextResponse.json({ ok: true, consultation });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "status_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

/** Open (and charge) a round, or return the existing open round unchanged. */
export async function POST() {
  try {
    const user = await requireUser();
    const existing = await getOpenConsultationForUser(user.id);
    if (existing) {
      return NextResponse.json({ ok: true, reused: true, consultation: existing });
    }

    // Subscription quota covers the round for free when available. If opening
    // the round then fails, refund the consumed quota.
    if (await consumeSubscriptionQuota(user.id)) {
      try {
        const consultation = await openConsultation(user.id, 0);
        return NextResponse.json({ ok: true, reused: false, viaSubscription: true, consultation });
      } catch (e) {
        await refundSubscriptionQuota(user.id);
        throw e;
      }
    }

    // Cost is admin-configurable via service_costs ("consultation"), else default.
    const cost = (await getServiceCost("consultation")) ?? CONSULTATION_CREDIT_COST;
    const decision = decideConsultationStart({ hasOpenRound: false, currentCredits: user.credits, cost });
    if (decision.action === "insufficient") {
      return NextResponse.json(
        {
          error: "insufficient_credits",
          requiredCredits: decision.requiredCredits,
          currentCredits: decision.currentCredits,
        },
        { status: 402 },
      );
    }
    const consultation = await openConsultation(user.id, decision.action === "charge" ? decision.cost : 0);
    return NextResponse.json({ ok: true, reused: false, viaSubscription: false, consultation });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "consultation_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
