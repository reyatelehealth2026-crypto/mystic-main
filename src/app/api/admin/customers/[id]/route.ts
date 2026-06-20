import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getServiceClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/supabase/users";

export const dynamic = "force-dynamic";

/** Admin-gated customer detail: profile + ledger + history + orders. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    const user = await getUserById(id);
    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const db = getServiceClient();
    const [tx, history, orders] = await Promise.all([
      db.from("credit_transactions").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
      db.from("reading_history").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
      db.from("orders").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    ]);

    return NextResponse.json({
      ok: true,
      user,
      transactions: tx.data ?? [],
      history: history.data ?? [],
      orders: orders.data ?? [],
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "customer_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
