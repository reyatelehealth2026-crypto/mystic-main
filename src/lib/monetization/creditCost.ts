import { ReadingType } from "@/lib/reading/types";

/**
 * Single source of truth for credit costs per reading type.
 *
 * This pure module is intentionally free of any `window`/localStorage access so
 * it can be imported by BOTH the client paywall (`paywall.ts`) and the
 * server-side credit layer (`src/lib/supabase/credits.ts`). Keep it dependency
 * free.
 *
 * Credit costs:
 * - Daily horoscope / specialized: 1 credit (weekly 2, monthly 3)
 * - Compatibility: 2 credits
 * - Chinese zodiac: 1 credit
 * - Name numerology: 2 credits
 * - Tarot / spirit card / numerology / daily card: 1 credit
 */
export function getCreditCost(
  type: ReadingType,
  options?: { period?: "daily" | "weekly" | "monthly" } & Record<string, unknown>,
): number {
  switch (type) {
    case ReadingType.HOROSCOPE:
    case ReadingType.SPECIALIZED:
      if (options?.period === "weekly") return 2;
      if (options?.period === "monthly") return 3;
      return 1;
    case ReadingType.COMPATIBILITY:
      return 2;
    case ReadingType.CHINESE_ZODIAC:
      return 1;
    case ReadingType.NAME_NUMEROLOGY:
      return 2;
    case ReadingType.TAROT:
    case ReadingType.SPIRIT_CARD:
    case ReadingType.NUMEROLOGY:
    case ReadingType.DAILY_CARD:
      return 1;
    default:
      return 1;
  }
}
