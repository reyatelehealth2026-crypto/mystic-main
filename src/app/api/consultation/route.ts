import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { decideConsultationStart } from "@/lib/consultation/policy";
import { getOpenConsultationForUser, openConsultation } from "@/lib/supabase/consultations";

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
    const decision = decideConsultationStart({
      hasOpenRound: existing !== null,
      currentCredits: user.credits,
    });

    if (decision.action === "reuse") {
      return NextResponse.json({ ok: true, reused: true, consultation: existing });
    }
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
    const consultation = await openConsultation(user.id, decision.cost);
    return NextResponse.json({ ok: true, reused: false, consultation });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "consultation_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
