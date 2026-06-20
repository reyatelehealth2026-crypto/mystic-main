import { NextResponse } from "next/server";
import { ensureUser } from "@/lib/auth/apiGuard";
import { chargeReading } from "@/lib/supabase/credits";
import { recordReading, isReadingRecorded } from "@/lib/supabase/history";
import { ReadingType } from "@/lib/reading/types";
import { generateHoroscope } from "@/lib/horoscope/engine";
import { calculateThaiCompatibility } from "@/lib/thai-astrology/engine";
import { generateChineseZodiacReading } from "@/lib/chinese-zodiac/engine";
import { getBaselineNameNumerology } from "@/lib/name-numerology/engine";
import { TimePeriod, type ZodiacSign } from "@/lib/horoscope/types";

export const dynamic = "force-dynamic";

type Params = Record<string, string>;
type Period = "daily" | "weekly" | "monthly";

const PERIOD: Record<string, TimePeriod> = {
  daily: TimePeriod.DAILY,
  weekly: TimePeriod.WEEKLY,
  monthly: TimePeriod.MONTHLY,
};

interface Dispatch {
  rt: ReadingType;
  period?: Period;
  run: () => Promise<unknown> | unknown;
}

function dispatch(type: string, p: Params): Dispatch | null {
  switch (type) {
    case "horoscope":
      return {
        rt: ReadingType.HOROSCOPE,
        period: (p.period as Period) || "daily",
        run: () =>
          generateHoroscope({
            zodiacSign: p.sign as ZodiacSign,
            period: PERIOD[p.period] ?? TimePeriod.DAILY,
            date: new Date(),
          }),
      };
    case "compatibility":
      return {
        rt: ReadingType.COMPATIBILITY,
        run: () =>
          calculateThaiCompatibility({
            person1: { birthDate: new Date(p.date1) },
            person2: { birthDate: new Date(p.date2) },
          }),
      };
    case "chinese_zodiac":
      return {
        rt: ReadingType.CHINESE_ZODIAC,
        period: (p.period as Period) || "daily",
        run: () =>
          generateChineseZodiacReading({
            birthYear: Number(p.year),
            period: PERIOD[p.period] ?? TimePeriod.DAILY,
            date: new Date(),
          }),
      };
    case "name_numerology":
      return {
        rt: ReadingType.NAME_NUMEROLOGY,
        run: () => getBaselineNameNumerology({ firstName: p.firstName, lastName: p.lastName }),
      };
    default:
      return null;
  }
}

/**
 * Server-authoritative reading: charges credits (once per distinct reading via
 * dedupeKey) and generates the content server-side, so the paywall can't be
 * bypassed client-side. Re-viewing the same reading (same dedupeKey) is free.
 */
export async function POST(req: Request) {
  const guard = await ensureUser();
  if (guard instanceof NextResponse) return guard;
  const user = guard;

  try {
    const body = (await req.json()) as { type?: string; params?: Params; dedupeKey?: string };
    const type = body.type ?? "";
    const params = body.params ?? {};
    const entry = dispatch(type, params);
    if (!entry) return NextResponse.json({ error: "unknown_type" }, { status: 400 });

    const clientId = `${type}:${body.dedupeKey ?? JSON.stringify(params)}`;
    const already = await isReadingRecorded(user.id, clientId);

    let newBalance = user.credits;
    if (!already) {
      const charge = await chargeReading(user.id, entry.rt, entry.period ? { period: entry.period } : undefined);
      if (charge.insufficient) {
        return NextResponse.json({ error: "insufficient_credits", balance: charge.newBalance }, { status: 402 });
      }
      newBalance = charge.newBalance;
      try {
        await recordReading(user.id, { type, summary: null, clientId });
      } catch {
        /* history is best-effort */
      }
    }

    const reading = await entry.run();
    return NextResponse.json({ ok: true, reading, newBalance, charged: !already });
  } catch (err) {
    return NextResponse.json(
      { error: "reading_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
