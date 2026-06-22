import { NextResponse } from "next/server";
import { listServiceCosts } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

/** Public per-reading credit costs, keyed by reading_type. Degrades to empty. */
export async function GET() {
  try {
    const items = await listServiceCosts();
    const costs: Record<string, { label: string; cost: number }> = {};
    for (const i of items) costs[i.reading_type] = { label: i.label, cost: i.cost_credits };
    return NextResponse.json({ ok: true, costs });
  } catch {
    return NextResponse.json({ ok: true, costs: {} });
  }
}
