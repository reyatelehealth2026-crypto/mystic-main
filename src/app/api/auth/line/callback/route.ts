import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken, verifyLineIdToken, getLineProfile } from "@/lib/auth/line";
import { upsertUserFromLine } from "@/lib/supabase/users";
import { signSession, setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Web OAuth callback. Validates `state`, exchanges the code, verifies the ID
 * token (incl. nonce), upserts the user, mints our session cookie, and redirects
 * back to the originally requested page.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const store = await cookies();
  const expectedState = store.get("rf_oauth_state")?.value;
  const nonce = store.get("rf_oauth_nonce")?.value;
  const returnTo = store.get("rf_oauth_return")?.value || "/profile";

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(reason)}`, url.origin));

  if (!code || !state || !expectedState || state !== expectedState) {
    return fail("invalid_state");
  }

  try {
    const redirectUri = `${url.origin}/api/auth/line/callback`;
    const tokens = await exchangeCodeForToken(code, redirectUri);
    const identity = await verifyLineIdToken(tokens.id_token, nonce);

    let statusMessage: string | undefined;
    let displayName = identity.displayName;
    let pictureUrl = identity.pictureUrl;
    try {
      const profile = await getLineProfile(tokens.access_token);
      statusMessage = profile.statusMessage;
      displayName = profile.displayName ?? displayName;
      pictureUrl = profile.pictureUrl ?? pictureUrl;
    } catch {
      // Profile enrichment is best-effort.
    }

    const user = await upsertUserFromLine({
      lineUserId: identity.lineUserId,
      displayName,
      pictureUrl,
      statusMessage,
    });

    const token = await signSession({ userId: user.id, lineUserId: user.line_user_id });
    await setSessionCookie(token);

    const res = NextResponse.redirect(new URL(returnTo, url.origin));
    // Clean up transient OAuth cookies.
    for (const name of ["rf_oauth_state", "rf_oauth_nonce", "rf_oauth_return"]) {
      res.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
    return res;
  } catch (err) {
    return fail(err instanceof Error ? err.message : "login_failed");
  }
}
