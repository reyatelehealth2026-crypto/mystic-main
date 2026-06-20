import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { grantCredits } from "@/lib/supabase/credits";
import { getUserById } from "@/lib/supabase/users";

export const dynamic = "force-dynamic";

/** Admin manual credit adjustment (positive or negative). */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = (await req.json()) as { amount?: number };
    const amount = Number(body.amount);
    if (!Number.isInteger(amount) || amount === 0) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const user = await getUserById(id);
    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const newBalance = await grantCredits(id, amount, "admin_adjust");
    return NextResponse.json({ ok: true, newBalance });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "grant_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
