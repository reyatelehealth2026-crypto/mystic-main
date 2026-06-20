/**
 * Client-only LIFF helpers. The `@line/liff` SDK touches `window` at import, so
 * it MUST be dynamically imported inside a browser context only — never at
 * module top-level (that would break SSR and the Workers build).
 */

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
