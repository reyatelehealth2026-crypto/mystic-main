/**
 * Property-Based Tests for Zodiac Sign Calculation
 * Feature: popular-fortune-features
 * 
 * These tests use fast-check to verify universal properties
 * across a wide range of inputs (minimum 100 iterations).
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { calculateZodiacSign } from './zodiac';
import { ZodiacSign } from './types';

/**
 * Helper function to determine expected zodiac sign based on date
 * This is the reference implementation for validation
 */
function getExpectedZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  // Zodiac date ranges (standard Western astrology)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZodiacSign.ARIES;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZodiacSign.TAURUS;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZodiacSign.GEMINI;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZodiacSign.CANCER;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZodiacSign.LEO;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZodiacSign.VIRGO;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZodiacSign.LIBRA;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZodiacSign.SCORPIO;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZodiacSign.SAGITTARIUS;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZodiacSign.CAPRICORN;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZodiacSign.AQUARIUS;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZodiacSign.PISCES;

  // Fallback (should never reach here)
  return ZodiacSign.ARIES;
}

// Feature: popular-fortune-features, Property 7: Zodiac Sign Calculation Correctness
describe('Zodiac Sign Calculation - Property Tests', () => {
  it('should calculate correct zodiac sign for any valid birth date', () => {
    fc.assert(
      fc.property(
        // Generate random dates between 1900-01-01 and today
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date()
        }),
        (birthDate) => {
          const calculatedSign = calculateZodiacSign(birthDate);
          const expectedSign = getExpectedZodiacSign(birthDate);
          
          expect(calculatedSign).toBe(expectedSign);
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as per spec
    );
  });

  it('should handle all possible dates in a year correctly', () => {
    fc.assert(
      fc.property(
        // Generate dates for a specific year (2024) to cover all days
        fc.integer({ min: 1, max: 366 }), // Day of year (including leap year)
        (dayOfYear) => {
          // Create date from day of year
          const date = new Date(2024, 0, 1);
          date.setDate(dayOfYear);
          
          // Skip invalid dates (e.g., day 366 in non-leap years)
          if (date.getFullYear() !== 2024) {
            return true;
          }
          
          const calculatedSign = calculateZodiacSign(date);
          const expectedSign = getExpectedZodiacSign(date);
          
          expect(calculatedSign).toBe(expectedSign);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return a valid zodiac sign for any date', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date('2100-12-31')
        }),
        (birthDate) => {
          const zodiacSign = calculateZodiacSign(birthDate);
          
          // Verify the result is one of the 12 valid zodiac signs
          const validSigns = Object.values(ZodiacSign);
          expect(validSigns).toContain(zodiacSign);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle leap year dates correctly', () => {
    fc.assert(
      fc.property(
        // Generate leap years
        fc.integer({ min: 1900, max: 2100 }).map(year => {
          // Make it a leap year
          const leapYear = year - (year % 4);
          return new Date(leapYear, 1, 29); // Feb 29
        }),
        (leapDate) => {
          // Skip if not a valid leap year date
          if (leapDate.getMonth() !== 1 || leapDate.getDate() !== 29) {
            return true;
          }
          
          const zodiacSign = calculateZodiacSign(leapDate);
          const expectedSign = getExpectedZodiacSign(leapDate);
          
          // Feb 29 should always be Pisces
          expect(zodiacSign).toBe(ZodiacSign.PISCES);
          expect(zodiacSign).toBe(expectedSign);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be deterministic - same date always returns same sign', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1900-01-01'),
          max: new Date()
        }),
        (birthDate) => {
          const sign1 = calculateZodiacSign(birthDate);
          const sign2 = calculateZodiacSign(birthDate);
          const sign3 = calculateZodiacSign(birthDate);
          
          expect(sign1).toBe(sign2);
          expect(sign2).toBe(sign3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle year boundaries correctly (Capricorn)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1900, max: 2100 }),
        (year) => {
          // Test Dec 22 - should be Capricorn
          const dec22 = new Date(year, 11, 22);
          expect(calculateZodiacSign(dec22)).toBe(ZodiacSign.CAPRICORN);
          
          // Test Jan 19 - should be Capricorn
          const jan19 = new Date(year, 0, 19);
          expect(calculateZodiacSign(jan19)).toBe(ZodiacSign.CAPRICORN);
          
          // Test Dec 21 - should be Sagittarius
          const dec21 = new Date(year, 11, 21);
          expect(calculateZodiacSign(dec21)).toBe(ZodiacSign.SAGITTARIUS);
          
          // Test Jan 20 - should be Aquarius
          const jan20 = new Date(year, 0, 20);
          expect(calculateZodiacSign(jan20)).toBe(ZodiacSign.AQUARIUS);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Validates: Requirements 3.3
 * 
 * Property 7: Zodiac Sign Calculation Correctness
 * For any birth date, the derived zodiac sign should match the expected sign
 * based on the date's position in the zodiac calendar.
 * 
 * Date ranges:
 * - Aries: Mar 21 - Apr 19
 * - Taurus: Apr 20 - May 20
 * - Gemini: May 21 - Jun 20
 * - Cancer: Jun 21 - Jul 22
 * - Leo: Jul 23 - Aug 22
 * - Virgo: Aug 23 - Sep 22
 * - Libra: Sep 23 - Oct 22
 * - Scorpio: Oct 23 - Nov 21
 * - Sagittarius: Nov 22 - Dec 21
 * - Capricorn: Dec 22 - Jan 19
 * - Aquarius: Jan 20 - Feb 18
 * - Pisces: Feb 19 - Mar 20
 */
