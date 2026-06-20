import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import type { UserRow } from "@/lib/supabase/types";

/**
 * Route guards that return a ready-to-send NextResponse on failure instead of
 * throwing — call at the top of a handler:
 *   const guard = await ensureUser(); if (guard instanceof NextResponse) return guard;
 */
export async function ensureUser(): Promise<UserRow | NextResponse> {
  try {
    return await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    throw e;
  }
}

export async function ensureAdmin(): Promise<UserRow | NextResponse> {
  try {
    return await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (e instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    throw e;
  }
}
