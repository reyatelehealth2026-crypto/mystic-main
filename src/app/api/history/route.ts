import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listReadingHistory } from "@/lib/supabase/history";

export const dynamic = "force-dynamic";

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
