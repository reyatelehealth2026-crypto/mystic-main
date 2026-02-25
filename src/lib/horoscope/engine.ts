// Horoscope Engine for REFFORTUNE
// Feature: popular-fortune-features
// Generates horoscope readings for different time periods with caching support

import { ZodiacSign, TimePeriod, HoroscopeInput, HoroscopeReading } from './types';
import { getBaselineHoroscope } from './baseline';
import { 
  getCacheEntry, 
  setCacheEntry, 
  generateCacheKey,
  getMillisecondsUntilEndOfDay,
  getMillisecondsUntilEndOfWeek,
  getMillisecondsUntilEndOfMonth
} from '../reading/cache';
import { ReadingType } from '../reading/types';

/**
 * Calculate date range for a given period
 * 
 * Daily: Single day (start and end are the same date)
 * Weekly: Monday to Sunday of the current week
 * Monthly: First to last day of the current month
 * 
 * @param date - Reference date
 * @param period - Time period (daily, weekly, monthly)
 * @returns Object with start and end dates
 * 
 * @example
 * // For a date in the middle of the week
 * calculateDateRange(new Date('2024-01-10'), TimePeriod.WEEKLY)
 * // Returns: { start: Mon Jan 8, end: Sun Jan 14 }
 * 
 * // For any date in a month
 * calculateDateRange(new Date('2024-01-15'), TimePeriod.MONTHLY)
 * // Returns: { start: Mon Jan 1, end: Wed Jan 31 }
 */
export function calculateDateRange(
  date: Date,
  period: TimePeriod
): { start: Date; end: Date } {
  const start = new Date(date);
  const end = new Date(date);

  switch (period) {
    case TimePeriod.DAILY:
      // Daily: same day for start and end
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case TimePeriod.WEEKLY:
      // Weekly: Monday to Sunday
      // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = start.getDay();
      
      // Calculate days to subtract to get to Monday
      // If Sunday (0), go back 6 days; if Monday (1), go back 0 days, etc.
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      // Set start to Monday of current week
      start.setDate(start.getDate() - daysToMonday);
      start.setHours(0, 0, 0, 0);
      
      // Set end to Sunday of current week (6 days after Monday)
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case TimePeriod.MONTHLY:
      // Monthly: First to last day of the month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      
      // Set to last day of month
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * Get baseline horoscope reading (deterministic, no AI)
 * 
 * Provides consistent interpretations based on zodiac sign and date.
 * Uses seed-based randomization for variety while maintaining determinism.
 * 
 * @param input - Horoscope input parameters
 * @returns Complete baseline horoscope reading
 * 
 * @example
 * const baseline = getBaselineHoroscope({
 *   zodiacSign: ZodiacSign.ARIES,
 *   period: TimePeriod.DAILY,
 *   date: new Date()
 * });
 */
export function getBaselineHoroscopeReading(input: HoroscopeInput): HoroscopeReading {
  const { zodiacSign, period, date } = input;
  
  // Get baseline content from baseline.ts
  const baseline = getBaselineHoroscope(zodiacSign, date);
  
  // Calculate date range for the period
  const dateRange = calculateDateRange(date, period);
  
  // Build complete reading
  const reading: HoroscopeReading = {
    zodiacSign,
    period,
    dateRange,
    aspects: {
      love: baseline.love,
      career: baseline.career,
      finance: baseline.finance,
      health: baseline.health
    },
    luckyNumbers: baseline.luckyNumbers,
    luckyColors: baseline.luckyColors,
    advice: baseline.advice,
    confidence: 70 // Baseline only = 70% confidence
  };
  
  return reading;
}

/**
 * Generate horoscope reading with caching support
 * 
 * Checks cache first, returns cached reading if valid.
 * Otherwise generates new baseline reading and caches it.
 * 
 * Cache TTL:
 * - Daily: Until end of day (midnight)
 * - Weekly: Until end of week (Sunday 23:59)
 * - Monthly: Until end of month
 * 
 * @param input - Horoscope input parameters
 * @returns Complete horoscope reading
 * 
 * @example
 * const reading = await generateHoroscope({
 *   zodiacSign: ZodiacSign.LEO,
 *   period: TimePeriod.WEEKLY,
 *   date: new Date()
 * });
 * console.log(reading.aspects.love);
 */
export async function generateHoroscope(input: HoroscopeInput): Promise<HoroscopeReading> {
  const { zodiacSign, period, date } = input;
  
  // Generate cache key
  const cacheKey = generateCacheKey(ReadingType.HOROSCOPE, {
    zodiacSign,
    period,
    date
  });
  
  // Check cache first
  const cached = getCacheEntry<HoroscopeReading>(cacheKey, 'horoscope');
  if (cached) {
    return cached;
  }
  
  // Generate new baseline reading
  const reading = getBaselineHoroscopeReading(input);
  
  // Determine TTL based on period
  let ttl: number;
  switch (period) {
    case TimePeriod.DAILY:
      ttl = getMillisecondsUntilEndOfDay(date);
      break;
    case TimePeriod.WEEKLY:
      ttl = getMillisecondsUntilEndOfWeek(date);
      break;
    case TimePeriod.MONTHLY:
      ttl = getMillisecondsUntilEndOfMonth(date);
      break;
    default:
      ttl = getMillisecondsUntilEndOfDay(date);
  }
  
  // Cache the reading
  setCacheEntry(cacheKey, reading, {
    ttl,
    keyPrefix: 'horoscope'
  });
  
  return reading;
}
