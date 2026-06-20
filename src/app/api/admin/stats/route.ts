import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function count(table: string, col: string, val: string): Promise<number> {
  const db = getServiceClient();
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true }).eq(col, val);
  if (error) throw error;
  return count ?? 0;
}

export async function GET() {
  try {
    await requireAdmin();
    const db = getServiceClient();
    const { count: totalCustomers } = await db.from("users").select("id", { count: "exact", head: true });
    const [openConsultations, pendingRedemptions, activeSubscriptions] = await Promise.all([
      count("consultations", "status", "open"),
      count("reward_redemptions", "status", "pending"),
      count("subscriptions", "status", "active"),
    ]);
    return NextResponse.json({
      ok: true,
      stats: {
        totalCustomers: totalCustomers ?? 0,
        openConsultations,
        pendingRedemptions,
        activeSubscriptions,
      },
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ error: "stats_failed", detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
