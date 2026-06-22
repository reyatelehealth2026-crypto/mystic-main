import { NextResponse } from "next/server";
import { requireUser, getOptionalUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listReadingHistory, syncReadingHistory } from "@/lib/supabase/history";
import { chargeReading } from "@/lib/supabase/credits";
import { ReadingType } from "@/lib/reading/types";

export const dynamic = "force-dynamic";

// Map history type strings (hyphen or underscore variants) to a ReadingType so
// the view can be charged. Types not listed are recorded but never charged.
const CHARGEABLE: Record<string, ReadingType> = {
  tarot: ReadingType.TAROT,
  "love-tarot": ReadingType.TAROT,
  love_tarot: ReadingType.TAROT,
  "spirit-card": ReadingType.SPIRIT_CARD,
  spirit_card: ReadingType.SPIRIT_CARD,
  "spirit-path": ReadingType.SPIRIT_CARD,
  spirit_path: ReadingType.SPIRIT_CARD,
  "daily-card": ReadingType.DAILY_CARD,
  daily_card: ReadingType.DAILY_CARD,
  numerology: ReadingType.NUMEROLOGY,
  horoscope: ReadingType.HOROSCOPE,
  compatibility: ReadingType.COMPATIBILITY,
  "chinese-zodiac": ReadingType.CHINESE_ZODIAC,
  chinese_zodiac: ReadingType.CHINESE_ZODIAC,
  "name-numerology": ReadingType.NAME_NUMEROLOGY,
  name_numerology: ReadingType.NAME_NUMEROLOGY,
};

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
    const inserted = await syncReadingHistory(user.id, [
      { type: b.type, summary: b.summary ?? null, clientId: b.clientId ?? null, details: b.details ?? null },
    ]);

    // Charge for a genuinely new view only (idempotent: re-sent clientId inserts
    // 0 rows → no charge). Charged EVERY time (no free-first).
    let charge: { charged: boolean; insufficient: boolean; newBalance: number } | null = null;
    const rt = CHARGEABLE[b.type];
    if (inserted > 0 && rt) {
      try {
        const r = await chargeReading(user.id, rt);
        charge = { charged: r.ok && !r.free, insufficient: r.insufficient, newBalance: r.newBalance };
      } catch {
        // never block the record on a charge failure
      }
    }
    return NextResponse.json({ ok: true, charge });
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
