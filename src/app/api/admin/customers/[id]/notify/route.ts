import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getUserById } from "@/lib/supabase/users";
import { sendLinePush } from "@/lib/line/messaging";

export const dynamic = "force-dynamic";

/** Admin-triggered LINE push to a single customer. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = (await req.json()) as { text?: string };
    const text = body.text?.trim();
    if (!text) return NextResponse.json({ error: "empty_message" }, { status: 400 });

    const user = await getUserById(id);
    if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const result = await sendLinePush(
      user.line_user_id,
      [{ type: "text", text }],
      { messageType: "admin_broadcast", userId: user.id },
    );
    return NextResponse.json({ ok: result.ok, reason: result.reason });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "notify_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
