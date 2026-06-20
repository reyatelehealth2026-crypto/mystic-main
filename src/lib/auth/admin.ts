import { requireUser } from "@/lib/auth/getCurrentUser";
import type { UserRow } from "@/lib/supabase/types";

/**
 * Lightweight admin gate (v1): an allowlist of LINE user IDs from the
 * `ADMIN_LINE_USER_IDS` env (comma-separated). No role table needed yet.
 */

export class ForbiddenError extends Error {
  constructor() {
    super("forbidden");
    this.name = "ForbiddenError";
  }
}

export function adminLineIds(): string[] {
  return (process.env.ADMIN_LINE_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAdmin(user: Pick<UserRow, "line_user_id"> | null | undefined): boolean {
  if (!user) return false;
  return adminLineIds().includes(user.line_user_id);
}

export async function requireAdmin(): Promise<UserRow> {
  const user = await requireUser();
  if (!isAdmin(user)) throw new ForbiddenError();
  return user;
}
