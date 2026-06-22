/**
 * Client-only LIFF helpers. The `@line/liff` SDK touches `window` at import, so
 * it MUST be dynamically imported inside a browser context only — never at
 * module top-level (that would break SSR and the Workers build).
 */

import type { LineMessage } from "@/lib/line/messaging";

let liffReady: Promise<boolean> | null = null;

/** Initialize LIFF once. Returns false when no LIFF ID is configured. */
export async function ensureLiff(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) return false;

  if (!liffReady) {
    liffReady = (async () => {
      const liff = (await import("@line/liff")).default;
      await liff.init({ liffId });
      return true;
    })().catch(() => {
      liffReady = null;
      return false;
    });
  }
  return liffReady;
}

/**
 * Attempt LIFF login. If running inside the LINE app and already logged in,
 * exchanges tokens with our server and returns true. If not logged in, triggers
 * `liff.login()` (redirect). Returns false when LIFF is unavailable.
 */
export async function loginWithLiff(): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;

  if (!liff.isLoggedIn()) {
    liff.login();
    return false; // redirect in progress
  }

  const idToken = liff.getIDToken();
  const accessToken = liff.getAccessToken();
  if (!idToken) return false;

  const resp = await fetch("/api/auth/line/liff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, accessToken }),
  });
  return resp.ok;
}

/** True when the page is being viewed inside the LINE in-app browser. */
export async function isInLineClient(): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;
  return liff.isInClient();
}

type LiffMessage =
  | { type: "text"; text: string }
  | { type: "flex"; altText: string; contents: unknown };

/**
 * Send messages into the user's 1:1 chat with the linked OA. Only works inside
 * the LINE client (and when the LIFF app is linked to the bot). Returns false
 * when unavailable so callers can fall back to a server push.
 */
export async function sendLiffMessages(messages: LiffMessage[]): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;
  if (!liff.isInClient()) return false;
  try {
    await liff.sendMessages(messages as Parameters<typeof liff.sendMessages>[0]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns true when `shareTargetPicker` is available in the current LIFF context.
 * Must be enabled in the LINE Developers console under the LIFF app settings.
 */
export async function canShareTargetPicker(): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;
  try {
    return liff.isApiAvailable("shareTargetPicker");
  } catch {
    return false;
  }
}

/**
 * Open the LINE share target picker and send `messages`.
 * Returns false if the API is unavailable or the user cancels.
 *
 * The `as never` casts at the SDK boundary isolate type mismatches between our
 * `LineMessage` union and the SDK's own message types — keeping strict mode
 * intact everywhere else.
 */
export async function shareViaTargetPicker(messages: LineMessage[]): Promise<boolean> {
  if (!(await canShareTargetPicker())) return false;
  const liff = (await import("@line/liff")).default;
  try {
    const result = await liff.shareTargetPicker(messages as never);
    // result is undefined when user cancels (LINE SDK behaviour)
    return result?.status === "success";
  } catch {
    return false;
  }
}

/**
 * Send messages directly into the chat window (only works when the LIFF app
 * is opened from a chat context, e.g. a rich menu inside a 1:1 or group chat).
 * Returns false on error or wrong context.
 */
export async function sendMessagesToChat(messages: LineMessage[]): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;
  try {
    await liff.sendMessages(messages as never);
    return true;
  } catch {
    return false;
  }
}

/**
 * Open the share-target picker so the user can forward the reading to friends.
 * Returns false when the API is unavailable (e.g. outside the LINE client).
 */
export async function shareReadingToFriends(messages: LiffMessage[]): Promise<boolean> {
  const ok = await ensureLiff();
  if (!ok) return false;
  const liff = (await import("@line/liff")).default;
  if (!liff.isApiAvailable("shareTargetPicker")) return false;
  try {
    const res = await liff.shareTargetPicker(messages as Parameters<typeof liff.shareTargetPicker>[0]);
    return Boolean(res);
  } catch {
    return false;
  }
}

/**
 * Returns the current user's friendship status with the LINE OA.
 * Requires `friendship_status` scope and the OA to be linked to the same
 * LINE Login channel provider. Returns null when unavailable (graceful).
 */
export async function getFriendshipStatus(): Promise<boolean | null> {
  const ok = await ensureLiff();
  if (!ok) return null;
  const liff = (await import("@line/liff")).default;
  try {
    const data = await liff.getFriendship();
    return data.friendFlag;
  } catch {
    return null;
  }
}
