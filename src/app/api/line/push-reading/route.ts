import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { sendLinePush } from "@/lib/line/messaging";
import { buildReadingMessageText } from "@/lib/line/readingMessage";

export const dynamic = "force-dynamic";

/** Push a tarot reading result to the logged-in user's LINE chat (web fallback). */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { cards?: string; summary?: string; url?: string };
    const cards = (body.cards ?? "").trim();
    const summary = (body.summary ?? "").trim();
    if (!cards || !summary) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const text = buildReadingMessageText({ cards, summary, url: body.url });
    const result = await sendLinePush(
      user.line_user_id,
      [{ type: "text", text }],
      { messageType: "tarot_reading", userId: user.id },
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "push_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
