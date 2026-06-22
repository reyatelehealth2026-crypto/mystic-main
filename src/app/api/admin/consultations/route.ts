import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listOpenConsultations } from "@/lib/supabase/consultations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const consultations = await listOpenConsultations();
    return NextResponse.json({ ok: true, consultations });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "list_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
