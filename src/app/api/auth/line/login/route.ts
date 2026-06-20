import { NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/auth/line";

export const dynamic = "force-dynamic";

/**
 * Web OAuth start. Generates `state` + `nonce`, stashes them in short-lived
 * httpOnly cookies, and redirects to LINE's authorize endpoint. The optional
 * `returnTo` query is preserved through the flow.
 */
export async function GET(req: Request) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json({ error: "missing_line_login_channel_id" }, { status: 400 });
  }

  const url = new URL(req.url);
  const returnTo = url.searchParams.get("returnTo") || "/profile";
  const redirectUri = `${url.origin}/api/auth/line/callback`;

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  const authorizeUrl = buildAuthorizeUrl({ redirectUri, state, nonce });
  const res = NextResponse.redirect(authorizeUrl);

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  };
  res.cookies.set("rf_oauth_state", state, cookieOpts);
  res.cookies.set("rf_oauth_nonce", nonce, cookieOpts);
  res.cookies.set("rf_oauth_return", returnTo, cookieOpts);
  return res;
}
