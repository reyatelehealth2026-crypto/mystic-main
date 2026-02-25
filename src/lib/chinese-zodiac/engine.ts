/**
 * Chinese Zodiac Engine
 * 
 * Generates Chinese zodiac fortune readings based on birth year and time period.
 * Integrates with cache manager for performance optimization.
 * 
 * Feature: popular-fortune-features
 */

import {
  ChineseZodiacInput,
  ChineseZodiacReading,
  ChineseZodiacAnimal,
  ChineseElement
} from './types';
import { TimePeriod } from '../horoscope/types';
import {
  calculateChineseZodiac,
  calculateChineseElement,
  getAnimalMetadata,
  getElementMetadata
} from './animals';
import { getBaselineChineseZodiacReading } from './baseline';
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
 * Generate Chinese zodiac reading with caching support
 * 
 * This is the main entry point for Chinese zodiac readings.
 * It checks cache first, then generates baseline interpretation.
 * AI enhancement can be added separately via API route.
 * 
 * @param input - Chinese zodiac input parameters
 * @returns Complete Chinese zodiac reading
 */
export async function generateChineseZodiacReading(
  input: ChineseZodiacInput
): Promise<ChineseZodiacReading> {
  // Calculate animal and element for cache key
  const animal = calculateChineseZodiac(input.birthYear);
  const element = calculateChineseElement(input.birthYear);
  
  // Generate cache key
  const cacheKey = generateCacheKey(ReadingType.CHINESE_ZODIAC, {
    animal,
    period: input.period,
    date: input.date
  });
  
  // Check cache
  const cached = getCacheEntry<ChineseZodiacReading>(cacheKey, 'chinese_zodiac');
  if (cached) {
    return cached;
  }
  
  // Generate baseline reading
  const reading = getBaselineChineseZodiacReading(input);
  
  // Calculate TTL based on period
  const ttl = calculateCacheTTL(input.period, input.date);
  
  // Cache the reading
  setCacheEntry(cacheKey, reading, {
    ttl,
    keyPrefix: 'chinese_zodiac'
  });
  
  return reading;
}

/**
 * Get baseline Chinese zodiac reading without caching
 * 
 * Useful for testing or when cache should be bypassed.
 * Re-exports from baseline.ts for convenience.
 * 
 * @param input - Chinese zodiac input parameters
 * @returns Baseline Chinese zodiac reading
 */
export { getBaselineChineseZodiacReading };

/**
 * Calculate cache TTL based on time period
 * 
 * - Daily: Until end of day
 * - Weekly: Until end of week (Sunday 23:59:59)
 * - Monthly: Until end of month
 * 
 * @param period - Time period
 * @param date - Reference date
 * @returns TTL in milliseconds
 */
function calculateCacheTTL(period: TimePeriod, date: Date): number {
  switch (period) {
    case TimePeriod.DAILY:
      return getMillisecondsUntilEndOfDay(date);
    
    case TimePeriod.WEEKLY:
      return getMillisecondsUntilEndOfWeek(date);
    
    case TimePeriod.MONTHLY:
      return getMillisecondsUntilEndOfMonth(date);
    
    default:
      // Default to 24 hours
      return 24 * 60 * 60 * 1000;
  }
}

/**
 * Calculate Chinese zodiac animal from birth year
 * Re-exported from animals.ts for convenience
 */
export { calculateChineseZodiac };

/**
 * Calculate Chinese element from birth year
 * Re-exported from animals.ts for convenience
 */
export { calculateChineseElement };

/**
 * Get metadata for a specific animal
 * Re-exported from animals.ts for convenience
 */
export { getAnimalMetadata };

/**
 * Get metadata for a specific element
 * Re-exported from animals.ts for convenience
 */
export { getElementMetadata };
