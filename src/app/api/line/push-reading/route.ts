import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { sendLinePush } from "@/lib/line/messaging";
import { buildReadingFlexMessage, type FlexCard } from "@/lib/line/readingMessage";

export const dynamic = "force-dynamic";

interface CardInput {
  name?: string;
  image?: string;
  reversed?: boolean;
}

/** Push the drawn cards (as a Flex carousel) to the logged-in user's LINE chat. */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const origin = new URL(req.url).origin;
    const body = (await req.json()) as { cards?: CardInput[] };
    const raw = Array.isArray(body.cards) ? body.cards : [];

    const cards: FlexCard[] = raw
      .filter((c) => c.name && c.image)
      .map((c) => ({
        name: c.name as string,
        imageUrl: (c.image as string).startsWith("http") ? (c.image as string) : origin + c.image,
        reversed: Boolean(c.reversed),
      }));

    if (cards.length === 0) {
      return NextResponse.json({ error: "no_cards" }, { status: 400 });
    }

    const flex = buildReadingFlexMessage(cards);
    const result = await sendLinePush(user.line_user_id, [flex], {
      messageType: "tarot_reading_flex",
      userId: user.id,
    });
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
