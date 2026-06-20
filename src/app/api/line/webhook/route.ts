import { NextResponse } from "next/server";
import { getUserByLineId } from "@/lib/supabase/users";
import { getOpenConsultationForUser } from "@/lib/supabase/consultations";
import { replyLineMessage } from "@/lib/line/messaging";

export const dynamic = "force-dynamic";

const APP_URL = "https://mystic-main.vercel.app";

/** Verify LINE's x-line-signature: base64(HMAC-SHA256(rawBody, channelSecret)). */
async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  const secret = process.env.LINE_MESSAGING_CHANNEL_SECRET;
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const expected = Buffer.from(new Uint8Array(mac)).toString("base64");
  return expected === signature;
}

interface LineEvent {
  type: string;
  replyToken?: string;
  source?: { userId?: string };
  message?: { type: string };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");
  if (!(await verifySignature(rawBody, signature))) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  let events: LineEvent[] = [];
  try {
    events = (JSON.parse(rawBody).events as LineEvent[]) ?? [];
  } catch {
    events = [];
  }

  for (const ev of events) {
    if (ev.type !== "message" || ev.message?.type !== "text" || !ev.replyToken) continue;

    let hasOpenRound = false;
    const lineUserId = ev.source?.userId;
    if (lineUserId) {
      try {
        const user = await getUserByLineId(lineUserId);
        if (user) hasOpenRound = (await getOpenConsultationForUser(user.id)) !== null;
      } catch {
        // ignore lookup failures — fall back to the generic reply
      }
    }

    const text = hasOpenRound
      ? "หมอดูกำลังดูไพ่ให้อยู่นะคะ รอสักครู่นะคะ 🙏✨"
      : `สวัสดีค่ะ 🔮 อยากปรึกษาหมอดูสด กดเปิดรอบที่แอปก่อนนะคะ\n👉 ${APP_URL}/consult`;
    await replyLineMessage(ev.replyToken, [{ type: "text", text }]);
  }

  return NextResponse.json({ ok: true });
}
