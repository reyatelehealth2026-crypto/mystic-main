import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { redeemReward } from "@/lib/supabase/rewards";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { rewardId?: string };
    const rewardId = (body.rewardId ?? "").trim();
    if (!rewardId) return NextResponse.json({ error: "missing_reward" }, { status: 400 });

    const result = await redeemReward(user.id, rewardId);
    if (!result.ok) {
      const status = result.reason === "insufficient_credits" ? 402 : 404;
      return NextResponse.json({ error: result.reason }, { status });
    }
    return NextResponse.json({ ok: true, newBalance: result.newBalance });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "redeem_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
