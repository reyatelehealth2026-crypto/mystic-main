import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getLifetimeCredits } from "@/lib/supabase/membership";
import { computeTier } from "@/lib/membership/tier";
import { getActiveSubscription } from "@/lib/supabase/subscriptions";
import { subscriptionRemaining } from "@/lib/subscription/quota";

export const dynamic = "force-dynamic";

/** Membership card data for the logged-in user. */
export async function GET() {
  try {
    const user = await requireUser();
    const lifetime = await getLifetimeCredits(user.id);
    const tier = computeTier(lifetime);
    const sub = await getActiveSubscription(user.id);
    const remaining = subscriptionRemaining(sub, new Date().toISOString());
    return NextResponse.json({
      ok: true,
      memberNo: user.member_no,
      displayName: user.display_name,
      pictureUrl: user.picture_url,
      credits: user.credits,
      ...tier,
      subscription: sub
        ? { planName: sub.plan_name, quota: sub.monthly_quota, remaining, periodEnd: sub.period_end }
        : null,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "membership_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
