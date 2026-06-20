import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getServiceClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

/** Admin-gated, paginated customer list with optional search. */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(0, Number(url.searchParams.get("page") ?? "0") || 0);

    const db = getServiceClient();
    let query = db
      .from("users")
      .select("id, line_user_id, display_name, picture_url, credits, membership_tier, created_at, last_login_at", {
        count: "exact",
      })
      .order("last_login_at", { ascending: false, nullsFirst: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (q) {
      query = query.or(`display_name.ilike.%${q}%,line_user_id.ilike.%${q}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      customers: (data as Partial<UserRow>[]) ?? [],
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "customers_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
