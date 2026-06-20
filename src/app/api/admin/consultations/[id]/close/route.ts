import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { closeConsultation } from "@/lib/supabase/consultations";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const closed = await closeConsultation(id, admin.line_user_id);
    if (!closed) return NextResponse.json({ error: "not_open" }, { status: 404 });
    return NextResponse.json({ ok: true, consultation: closed });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "close_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
