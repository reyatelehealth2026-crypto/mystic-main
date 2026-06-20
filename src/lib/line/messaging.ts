import { getServiceClient } from "@/lib/supabase/server";

/**
 * LINE Messaging API push. Env-guarded: if the channel access token is missing
 * we log a `notifications` row and return gracefully instead of throwing
 * (mirrors the `missing_gemini_api_key` graceful contract).
 *
 * NOTE: push targets the LINE userId (`sub`). For this to work the Login channel
 * and the Messaging channel must live under the SAME LINE provider (shared
 * userId namespace) and the user must have added the bot as a friend.
 */

export interface LineMessage {
  type: "text";
  text: string;
}

export interface PushResult {
  ok: boolean;
  reason?: string;
}

async function logNotification(params: {
  userId: string | null;
  messageType: string;
  payload: unknown;
  status: "sent" | "failed";
  error?: string | null;
}): Promise<void> {
  try {
    const db = getServiceClient();
    await db.from("notifications").insert({
      user_id: params.userId,
      channel: "line_push",
      message_type: params.messageType,
      payload: params.payload as Record<string, unknown>,
      status: params.status,
      error: params.error ?? null,
    });
  } catch {
    // Logging must never break the caller.
  }
}

export async function sendLinePush(
  lineUserId: string,
  messages: LineMessage[],
  meta?: { messageType?: string; userId?: string | null },
): Promise<PushResult> {
  const token = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
  const messageType = meta?.messageType ?? "generic";
  const userId = meta?.userId ?? null;

  if (!token) {
    await logNotification({ userId, messageType, payload: { messages }, status: "failed", error: "missing_line_messaging_token" });
    return { ok: false, reason: "missing_line_messaging_token" };
  }

  try {
    const resp = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to: lineUserId, messages }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      await logNotification({ userId, messageType, payload: { messages }, status: "failed", error: detail });
      return { ok: false, reason: "line_push_failed" };
    }

    await logNotification({ userId, messageType, payload: { messages }, status: "sent" });
    return { ok: true };
  } catch (err) {
    await logNotification({
      userId,
      messageType,
      payload: { messages },
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, reason: "line_push_error" };
  }
}

/**
 * Reply to an inbound webhook event using its one-time replyToken. Unlike push,
 * reply does not require the same-provider userId — it always works for events
 * the bot receives. Env-guarded like `sendLinePush`.
 */
export async function replyLineMessage(
  replyToken: string,
  messages: LineMessage[],
): Promise<PushResult> {
  const token = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
  if (!token) return { ok: false, reason: "missing_line_messaging_token" };
  try {
    const resp = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ replyToken, messages }),
    });
    return resp.ok ? { ok: true } : { ok: false, reason: "line_reply_failed" };
  } catch {
    return { ok: false, reason: "line_reply_error" };
  }
}

export function sendPurchaseConfirmation(
  lineUserId: string,
  creditAmount: number,
  userId?: string | null,
): Promise<PushResult> {
  return sendLinePush(
    lineUserId,
    [
      {
        type: "text",
        text: `ขอบคุณสำหรับการสั่งซื้อค่ะ/ครับ 🙏\nเติมเครดิตสำเร็จ +${creditAmount} เครดิต\nพร้อมเปิดดูดวงเชิงลึกได้เลย ✨`,
      },
    ],
    { messageType: "purchase_confirmation", userId },
  );
}
