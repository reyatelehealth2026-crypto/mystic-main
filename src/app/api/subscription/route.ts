import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { subscriptionRemaining } from "@/lib/subscription/quota";
import { createSubscription, getActiveSubscription } from "@/lib/supabase/subscriptions";
import { listPlans } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

/** Current subscription + remaining uses for the logged-in user. */
export async function GET() {
  try {
    const user = await requireUser();
    const sub = await getActiveSubscription(user.id);
    const remaining = subscriptionRemaining(sub, new Date().toISOString());
    return NextResponse.json({
      ok: true,
      subscription: sub
        ? { planName: sub.plan_name, quota: sub.monthly_quota, used: sub.used_count, remaining, periodEnd: sub.period_end }
        : null,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "subscription_failed" }, { status: 500 });
  }
}

/**
 * Subscribe to a plan. NOTE: no payment yet — grants the plan directly so the
 * flow can be reviewed before wiring a payment provider.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { plan?: string };
    const planId = (body.plan ?? "").trim();
    const row = (await listPlans(true)).find((p) => p.id === planId);
    if (!row) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });

    const sub = await createSubscription(user.id, {
      id: row.id,
      name: row.name,
      monthlyQuota: row.monthly_quota,
      priceCents: row.price_cents,
    });
    return NextResponse.json({
      ok: true,
      subscription: { planName: sub.plan_name, quota: sub.monthly_quota, used: 0, remaining: sub.monthly_quota, periodEnd: sub.period_end },
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "subscribe_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
