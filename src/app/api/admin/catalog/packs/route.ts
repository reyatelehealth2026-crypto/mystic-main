import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listPacks, upsertPack, deletePack, type PackRow } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

function fail(err: unknown) {
  if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ error: "catalog_failed", detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true, items: await listPacks() });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const b = (await req.json()) as Partial<PackRow>;
    if (!b.id || !b.name) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    await upsertPack({
      id: String(b.id),
      name: String(b.name),
      credit_amount: Number(b.credit_amount ?? 0),
      price_cents: Number(b.price_cents ?? 0),
      active: b.active ?? true,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
    await deletePack(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
