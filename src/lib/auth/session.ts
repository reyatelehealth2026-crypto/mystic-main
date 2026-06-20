import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

/**
 * Session JWT helpers (HS256 via `jose`/WebCrypto — Workers safe).
 *
 * The session is stored in an httpOnly cookie. `sameSite: 'lax'` is REQUIRED so
 * the cookie survives the top-level LINE OAuth redirect back to the callback.
 */

export const SESSION_COOKIE = "rf_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

export interface SessionPayload {
  userId: string;
  lineUserId: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("missing_session_secret: set SESSION_SECRET (>=32 bytes recommended)");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId === "string" && typeof payload.lineUserId === "string") {
      return { userId: payload.userId, lineUserId: payload.lineUserId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
