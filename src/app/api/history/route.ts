import { NextResponse } from "next/server";
import { requireUser, getOptionalUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listReadingHistory, syncReadingHistory } from "@/lib/supabase/history";

export const dynamic = "force-dynamic";

/**
 * Record a single reading view. Idempotent via clientId. Silently no-ops for
 * anonymous users so callers can fire-and-forget without handling auth.
 */
export async function POST(req: Request) {
  try {
    const user = await getOptionalUser();
    if (!user) return NextResponse.json({ ok: true, skipped: "anonymous" });
    const b = (await req.json()) as {
      type?: string;
      summary?: string;
      clientId?: string;
      details?: Record<string, unknown>;
    };
    if (!b.type) return NextResponse.json({ error: "missing_type" }, { status: 400 });
    await syncReadingHistory(user.id, [
      { type: b.type, summary: b.summary ?? null, clientId: b.clientId ?? null, details: b.details ?? null },
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "record_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

/** Server-side reading history for the logged-in user. */
export async function GET() {
  try {
    const user = await requireUser();
    const history = await listReadingHistory(user.id);
    return NextResponse.json({ ok: true, history });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "history_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
