import { readSessionToken, verifySession } from "@/lib/auth/session";
import { getUserById } from "@/lib/supabase/users";
import type { UserRow } from "@/lib/supabase/types";

/**
 * Server helpers to resolve the current authenticated user from the session
 * cookie. `getOptionalUser` returns null when logged out (anonymous flows keep
 * working); `requireUser` throws an `UnauthorizedError` for protected routes.
 */

export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function getOptionalUser(): Promise<UserRow | null> {
  const token = await readSessionToken();
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  try {
    return await getUserById(session.userId);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<UserRow> {
  const user = await getOptionalUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
