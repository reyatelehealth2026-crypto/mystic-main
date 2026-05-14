// Horoscope Types for REFFORTUNE
// Feature: popular-fortune-features

/**
 * Western zodiac signs
 */
export enum ZodiacSign {
  ARIES = 'aries',
  TAURUS = 'taurus',
  GEMINI = 'gemini',
  CANCER = 'cancer',
  LEO = 'leo',
  VIRGO = 'virgo',
  LIBRA = 'libra',
  SCORPIO = 'scorpio',
  SAGITTARIUS = 'sagittarius',
  CAPRICORN = 'capricorn',
  AQUARIUS = 'aquarius',
  PISCES = 'pisces'
}

/**
 * Time period for horoscope readings
 */
export enum TimePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

/**
 * Domain-specific reading areas (used by specialized readings)
 *
 * Canonical definition lives in `./specialized.ts` as a const-object plus
 * type alias. Re-exported here so existing imports from `horoscope/types`
 * keep working without two separate identifiers existing at the same time.
 * The old `enum ReadingDomain` was structurally identical and `===` to the
 * const-object values, but TypeScript treated them as distinct types,
 * causing silent mismatches at boundaries.
 */
export { ReadingDomain } from './specialized';

/**
 * Input for horoscope generation
 */
export interface HoroscopeInput {
  zodiacSign: ZodiacSign;
  period: TimePeriod;
  date: Date; // Reference date for the reading
}

/**
 * Complete horoscope reading result
 */
export interface HoroscopeReading {
  zodiacSign: ZodiacSign;
  period: TimePeriod;
  dateRange: { start: Date; end: Date };
  aspects: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
  luckyNumbers: number[];
  luckyColors: string[];
  advice: string;
  confidence: number; // 0-100, indicates baseline vs AI mix
}
