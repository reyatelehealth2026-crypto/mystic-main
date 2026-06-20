import { NextResponse } from "next/server";
import { verifyLineIdToken, getLineProfile } from "@/lib/auth/line";
import { upsertUserFromLine } from "@/lib/supabase/users";
import { signSession, setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * LIFF login path. The client (running inside the LINE app) obtains an
 * accessToken + idToken from the LIFF SDK and POSTs them here. We verify both
 * server-side — NEVER trusting client-supplied profile fields — then upsert the
 * user and set the same session cookie used by the web OAuth flow.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { idToken?: string; accessToken?: string };
    if (!body.idToken) {
      return NextResponse.json({ error: "missing_id_token" }, { status: 400 });
    }

    const identity = await verifyLineIdToken(body.idToken);

    let displayName = identity.displayName;
    let pictureUrl = identity.pictureUrl;
    let statusMessage: string | undefined;
    if (body.accessToken) {
      try {
        const profile = await getLineProfile(body.accessToken);
        displayName = profile.displayName ?? displayName;
        pictureUrl = profile.pictureUrl ?? pictureUrl;
        statusMessage = profile.statusMessage;
      } catch {
        // best-effort enrichment
      }
    }

    const user = await upsertUserFromLine({
      lineUserId: identity.lineUserId,
      displayName,
      pictureUrl,
      statusMessage,
    });

    const token = await signSession({ userId: user.id, lineUserId: user.line_user_id });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        displayName: user.display_name,
        pictureUrl: user.picture_url,
        credits: user.credits,
        membershipTier: user.membership_tier,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "liff_login_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 400 },
    );
  }
}
