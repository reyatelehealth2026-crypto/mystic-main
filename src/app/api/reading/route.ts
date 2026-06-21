import { NextResponse } from "next/server";
import { ensureUser } from "@/lib/auth/apiGuard";
import { chargeReadingOnce } from "@/lib/supabase/credits";
import { ReadingType } from "@/lib/reading/types";
import { generateHoroscope } from "@/lib/horoscope/engine";
import { calculateThaiCompatibility } from "@/lib/thai-astrology/engine";
import { generateChineseZodiacReading } from "@/lib/chinese-zodiac/engine";
import { getBaselineNameNumerology } from "@/lib/name-numerology/engine";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { spiritPathFromDateParts } from "@/lib/tarot/spiritPath";
import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { TimePeriod, type ZodiacSign } from "@/lib/horoscope/types";

export const dynamic = "force-dynamic";

type Params = Record<string, string>;
type Period = "daily" | "weekly" | "monthly";

const PERIOD: Record<string, TimePeriod> = {
  daily: TimePeriod.DAILY,
  weekly: TimePeriod.WEEKLY,
  monthly: TimePeriod.MONTHLY,
};

/** Stable, order-independent string of the inputs — the dedupe identity. */
function canonicalParams(p: Params): string {
  return JSON.stringify(
    Object.keys(p)
      .sort()
      .reduce<Params>((acc, k) => {
        acc[k] = p[k];
        return acc;
      }, {}),
  );
}

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
    case "tarot":
      return {
        rt: ReadingType.TAROT,
        run: () =>
          runReadingPipeline({ kind: "tarot", cardsToken: p.cardsToken, count: Number(p.count), question: p.question }),
      };
    case "spirit_card":
      return {
        rt: ReadingType.SPIRIT_CARD,
        run: () => runReadingPipeline({ kind: "spirit-card", dob: p.dob }),
      };
    case "spirit_path":
      return {
        rt: ReadingType.SPIRIT_CARD,
        run: () =>
          spiritPathFromDateParts({ day: Number(p.day), month: Number(p.month), year: Number(p.year) }),
      };
    case "numerology": {
      const analyzed = analyzeThaiPhone(p.phone);
      return {
        rt: ReadingType.NUMEROLOGY,
        run: () =>
          analyzed ? runReadingPipeline({ kind: "numerology", phone: analyzed.normalizedPhone }) : null,
      };
    }
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
    const body = (await req.json()) as { type?: string; params?: Params };
    const type = body.type ?? "";
    const params = body.params ?? {};
    const entry = dispatch(type, params);
    if (!entry) return NextResponse.json({ error: "unknown_type" }, { status: 400 });

    // Generate FIRST so a failed generation never charges the user.
    const reading = await entry.run();
    if (reading == null) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    // Dedupe identity is derived from the actual inputs (NOT a client-supplied
    // key) so a paid reading can only be re-shown for the SAME inputs.
    const clientId = `${type}:${canonicalParams(params)}`;
    const charge = await chargeReadingOnce(user.id, clientId, type, entry.rt, entry.period ? { period: entry.period } : undefined);
    if (charge.insufficient) {
      return NextResponse.json({ error: "insufficient_credits", balance: charge.balance }, { status: 402 });
    }

    return NextResponse.json({
      ok: true,
      reading,
      newBalance: charge.balance,
      charged: charge.charged,
      viaSubscription: charge.viaSubscription,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "reading_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
