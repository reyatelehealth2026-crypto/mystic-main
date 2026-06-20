/**
 * LINE token verification + OAuth helpers. All plain HTTPS `fetch` (no SDK),
 * mirroring the Gemini integration pattern. Works in the Workers runtime.
 */

export interface VerifiedLineIdentity {
  lineUserId: string;
  displayName?: string;
  pictureUrl?: string;
}

interface LineTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in?: number;
}

/**
 * Verify a LINE ID token against LINE's endpoint. Validates `aud` (our channel)
 * and, when provided, the `nonce`. Returns the decoded identity.
 */
export async function verifyLineIdToken(
  idToken: string,
  nonce?: string,
): Promise<VerifiedLineIdentity> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) throw new Error("missing_line_login_channel_id");

  const body = new URLSearchParams({ id_token: idToken, client_id: channelId });
  if (nonce) body.set("nonce", nonce);

  const resp = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!resp.ok) {
    throw new Error(`line_id_token_invalid: ${await resp.text()}`);
  }
  const data = (await resp.json()) as {
    sub?: string;
    name?: string;
    picture?: string;
    aud?: string;
  };
  if (!data.sub) throw new Error("line_id_token_missing_sub");
  if (data.aud && data.aud !== channelId) throw new Error("line_id_token_aud_mismatch");

  return { lineUserId: data.sub, displayName: data.name, pictureUrl: data.picture };
}

/** Exchange an OAuth authorization code for tokens (web login flow). */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<LineTokenResponse> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
  if (!channelId || !channelSecret) throw new Error("missing_line_login_credentials");

  const resp = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });
  if (!resp.ok) throw new Error(`line_token_exchange_failed: ${await resp.text()}`);
  return (await resp.json()) as LineTokenResponse;
}

/** Fetch the richer LINE profile (statusMessage etc.) using an access token. */
export async function getLineProfile(accessToken: string): Promise<{
  userId: string;
  displayName?: string;
  pictureUrl?: string;
  statusMessage?: string;
}> {
  const resp = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`line_profile_failed: ${await resp.text()}`);
  const data = (await resp.json()) as {
    userId: string;
    displayName?: string;
    pictureUrl?: string;
    statusMessage?: string;
  };
  return data;
}

/** Build the LINE OAuth authorize URL for the web login flow. */
export function buildAuthorizeUrl(params: {
  redirectUri: string;
  state: string;
  nonce: string;
}): string {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) throw new Error("missing_line_login_channel_id");
  const url = new URL("https://access.line.me/oauth2/v2.1/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", channelId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", "profile openid");
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  return url.toString();
}
