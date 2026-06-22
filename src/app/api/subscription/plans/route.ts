import { NextResponse } from "next/server";
import { listPlans } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

/** Public list of active subscription plans (for the /packages page). */
export async function GET() {
  try {
    const plans = await listPlans(true);
    return NextResponse.json({
      ok: true,
      plans: plans.map((p) => ({ id: p.id, name: p.name, monthlyQuota: p.monthly_quota, priceCents: p.price_cents })),
    });
  } catch (err) {
    return NextResponse.json({ error: "list_failed", detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
