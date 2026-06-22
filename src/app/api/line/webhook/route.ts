/**
 * POST /api/line/webhook
 *
 * LINE Messaging API webhook receiver.
 *
 * Setup required in LINE Developers console (code alone is not enough):
 *   1. Enable webhook URL → https://<host>/api/line/webhook
 *   2. Disable auto-reply & greeting messages
 *   3. Link your LINE OA to the Messaging channel
 *
 * Security: every request is verified via HMAC-SHA256 over the raw body using
 * `LINE_MESSAGING_CHANNEL_SECRET`. We use Web Crypto (crypto.subtle) which is
 * available in Cloudflare Workers without Node.js polyfills.
 *
 * Timing contract: LINE retries if it doesn't receive 2xx within ~1 s.
 * We return 200 immediately, then handle side-effects (push, DB) asynchronously.
 */

import { NextResponse } from "next/server";
import { drawCards, cardMeaning } from "@/lib/tarot/engine";
import { buildDailyCardFlex } from "@/lib/line/flex";
import { sendLineReply } from "@/lib/line/messaging";
import type { LineMessage } from "@/lib/line/messaging";
import { liffDeepLink } from "@/lib/line/flex";

export const dynamic = "force-dynamic";

// ── Signature verification ────────────────────────────────────────────────────

async function verifySignature(body: string, signature: string): Promise<boolean> {
  const secret = process.env.LINE_MESSAGING_CHANNEL_SECRET;
  if (!secret) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
    // Constant-time compare
    if (expected.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

// ── Message builders ──────────────────────────────────────────────────────────

function buildTodayCardMessages(): LineMessage[] {
  const [drawn] = drawCards(1);
  if (!drawn) return [{ type: "text", text: "ขอโทษนะคะ ดึงไพ่ไม่ได้ในขณะนี้ 🙏" }];

  return [
    buildDailyCardFlex({
      cardNameTh: drawn.card.nameTh ?? drawn.card.name,
      cardName: drawn.card.name,
      orientation: drawn.orientation,
      meaning: cardMeaning(drawn),
      keywords:
        drawn.orientation === "upright"
          ? drawn.card.keywordsUpright
          : drawn.card.keywordsReversed,
      imageUrl: drawn.card.image ? `/card/${drawn.card.image}` : null,
    }),
  ];
}

function buildHelpMessages(): LineMessage[] {
  const deepLink = liffDeepLink("/");
  return [
    {
      type: "text",
      text:
        `สวัสดีค่ะ ✨ พิมพ์คำสั่งต่อไปนี้ได้เลย\n\n` +
        `🃏 "ไพ่วันนี้" — ดูไพ่รายวัน\n` +
        `🔮 "ดูดวง" — ไปหน้าดูดวง\n\n` +
        `หรือเปิดแอปได้ที่: ${deepLink}`,
    },
  ];
}

function buildWelcomeMessages(): LineMessage[] {
  const deepLink = liffDeepLink("/");
  return [
    {
      type: "text",
      text:
        `ยินดีต้อนรับสู่ REFFORTUNE ✨\n\n` +
        `ดูดวงไพ่ทาโรต์ ดูดวงรายวัน และเลขมงคล\n` +
        `เปิดแอปได้ที่: ${deepLink}\n\n` +
        `พิมพ์ "ไพ่วันนี้" เพื่อรับไพ่รายวันได้เลยค่ะ 🃏`,
    },
  ];
}

// ── LINE event types (minimal subset) ────────────────────────────────────────

interface LineTextMessageEvent {
  type: "message";
  replyToken: string;
  source: { userId?: string };
  message: { type: "text"; text: string };
}

interface LineFollowEvent {
  type: "follow";
  replyToken: string;
  source: { userId?: string };
}

type LineEvent = LineTextMessageEvent | LineFollowEvent | { type: string; replyToken?: string; source?: { userId?: string } };

interface LineWebhookBody {
  events: LineEvent[];
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature") ?? "";

  if (!(await verifySignature(rawBody, signature))) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  // Return 200 immediately — LINE retries on timeout
  const responsePromise = NextResponse.json({ ok: true });

  // Handle events asynchronously (fire-and-forget from LINE's perspective)
  void (async () => {
    try {
      const body = JSON.parse(rawBody) as LineWebhookBody;
      for (const event of body.events ?? []) {
        try {
          await handleEvent(event);
        } catch {
          // Individual event errors must not crash the loop
        }
      }
    } catch {
      // JSON parse error — body was already verified, ignore
    }
  })();

  return responsePromise;
}

async function handleEvent(event: LineEvent): Promise<void> {
  if (event.type === "follow") {
    const followEvent = event as LineFollowEvent;
    // Welcome message on add-friend
    await sendLineReply(
      followEvent.replyToken,
      buildWelcomeMessages(),
      { messageType: "welcome", userId: followEvent.source?.userId ?? null },
    );
    return;
  }

  if (event.type === "message") {
    const msgEvent = event as LineTextMessageEvent;
    if (msgEvent.message.type !== "text") return;

    const text = msgEvent.message.text.trim();
    const lower = text.toLowerCase();

    if (lower.includes("ไพ่วันนี้") || lower.includes("daily") || lower.includes("ดูดวง")) {
      await sendLineReply(
        msgEvent.replyToken,
        buildTodayCardMessages(),
        { messageType: "bot_reply_card", userId: msgEvent.source?.userId ?? null },
      );
    } else {
      await sendLineReply(
        msgEvent.replyToken,
        buildHelpMessages(),
        { messageType: "bot_reply_help", userId: msgEvent.source?.userId ?? null },
      );
    }
  }
}
