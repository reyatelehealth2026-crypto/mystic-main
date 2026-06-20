import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listServiceCosts, upsertServiceCost } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

function fail(err: unknown) {
  if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ error: "catalog_failed", detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true, items: await listServiceCosts() });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const b = (await req.json()) as { reading_type?: string; label?: string; cost_credits?: number };
    if (!b.reading_type || !b.label) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    await upsertServiceCost({
      reading_type: String(b.reading_type),
      label: String(b.label),
      cost_credits: Number(b.cost_credits ?? 0),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
