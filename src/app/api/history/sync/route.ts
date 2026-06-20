import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { syncReadingHistory, type ReadingHistoryInput } from "@/lib/supabase/history";

export const dynamic = "force-dynamic";

interface SyncBody {
  items?: Array<{
    id?: string;
    type?: string;
    summary?: string;
    date?: string;
    details?: Record<string, unknown>;
  }>;
}

/**
 * One-time (idempotent) migration of localStorage history to the server for a
 * logged-in user. Dedup is enforced by the `(user_id, client_id)` constraint.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as SyncBody;
    const items: ReadingHistoryInput[] = (body.items ?? [])
      .filter((it) => it && typeof it.type === "string")
      .map((it) => ({
        type: it.type as string,
        summary: it.summary ?? null,
        details: it.details ?? null,
        clientId: it.id ?? null,
        createdAt: it.date ?? null,
      }));

    const inserted = await syncReadingHistory(user.id, items);
    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "sync_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
