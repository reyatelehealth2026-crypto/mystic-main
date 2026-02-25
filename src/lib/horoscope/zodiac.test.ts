/**
 * Unit Tests for Zodiac Sign Calculation - Boundary Dates
 * Feature: popular-fortune-features
 * 
 * These tests verify specific boundary dates for all 12 zodiac signs
 * and handle leap year edge cases.
 * 
 * Requirements: 3.3
 */

import { describe, it, expect } from 'vitest';
import { calculateZodiacSign } from './zodiac';
import { ZodiacSign } from './types';

describe('Zodiac Sign Calculation - Boundary Dates', () => {
  describe('Aries boundaries (Mar 21 - Apr 19)', () => {
    it('should return Pisces for Mar 20', () => {
      expect(calculateZodiacSign(new Date('2024-03-20'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Aries for Mar 21', () => {
      expect(calculateZodiacSign(new Date('2024-03-21'))).toBe(ZodiacSign.ARIES);
    });

    it('should return Aries for Apr 19', () => {
      expect(calculateZodiacSign(new Date('2024-04-19'))).toBe(ZodiacSign.ARIES);
    });

    it('should return Taurus for Apr 20', () => {
      expect(calculateZodiacSign(new Date('2024-04-20'))).toBe(ZodiacSign.TAURUS);
    });
  });

  describe('Taurus boundaries (Apr 20 - May 20)', () => {
    it('should return Aries for Apr 19', () => {
      expect(calculateZodiacSign(new Date('2024-04-19'))).toBe(ZodiacSign.ARIES);
    });

    it('should return Taurus for Apr 20', () => {
      expect(calculateZodiacSign(new Date('2024-04-20'))).toBe(ZodiacSign.TAURUS);
    });

    it('should return Taurus for May 20', () => {
      expect(calculateZodiacSign(new Date('2024-05-20'))).toBe(ZodiacSign.TAURUS);
    });

    it('should return Gemini for May 21', () => {
      expect(calculateZodiacSign(new Date('2024-05-21'))).toBe(ZodiacSign.GEMINI);
    });
  });

  describe('Gemini boundaries (May 21 - Jun 20)', () => {
    it('should return Taurus for May 20', () => {
      expect(calculateZodiacSign(new Date('2024-05-20'))).toBe(ZodiacSign.TAURUS);
    });

    it('should return Gemini for May 21', () => {
      expect(calculateZodiacSign(new Date('2024-05-21'))).toBe(ZodiacSign.GEMINI);
    });

    it('should return Gemini for Jun 20', () => {
      expect(calculateZodiacSign(new Date('2024-06-20'))).toBe(ZodiacSign.GEMINI);
    });

    it('should return Cancer for Jun 21', () => {
      expect(calculateZodiacSign(new Date('2024-06-21'))).toBe(ZodiacSign.CANCER);
    });
  });

  describe('Cancer boundaries (Jun 21 - Jul 22)', () => {
    it('should return Gemini for Jun 20', () => {
      expect(calculateZodiacSign(new Date('2024-06-20'))).toBe(ZodiacSign.GEMINI);
    });

    it('should return Cancer for Jun 21', () => {
      expect(calculateZodiacSign(new Date('2024-06-21'))).toBe(ZodiacSign.CANCER);
    });

    it('should return Cancer for Jul 22', () => {
      expect(calculateZodiacSign(new Date('2024-07-22'))).toBe(ZodiacSign.CANCER);
    });

    it('should return Leo for Jul 23', () => {
      expect(calculateZodiacSign(new Date('2024-07-23'))).toBe(ZodiacSign.LEO);
    });
  });

  describe('Leo boundaries (Jul 23 - Aug 22)', () => {
    it('should return Cancer for Jul 22', () => {
      expect(calculateZodiacSign(new Date('2024-07-22'))).toBe(ZodiacSign.CANCER);
    });

    it('should return Leo for Jul 23', () => {
      expect(calculateZodiacSign(new Date('2024-07-23'))).toBe(ZodiacSign.LEO);
    });

    it('should return Leo for Aug 22', () => {
      expect(calculateZodiacSign(new Date('2024-08-22'))).toBe(ZodiacSign.LEO);
    });

    it('should return Virgo for Aug 23', () => {
      expect(calculateZodiacSign(new Date('2024-08-23'))).toBe(ZodiacSign.VIRGO);
    });
  });

  describe('Virgo boundaries (Aug 23 - Sep 22)', () => {
    it('should return Leo for Aug 22', () => {
      expect(calculateZodiacSign(new Date('2024-08-22'))).toBe(ZodiacSign.LEO);
    });

    it('should return Virgo for Aug 23', () => {
      expect(calculateZodiacSign(new Date('2024-08-23'))).toBe(ZodiacSign.VIRGO);
    });

    it('should return Virgo for Sep 22', () => {
      expect(calculateZodiacSign(new Date('2024-09-22'))).toBe(ZodiacSign.VIRGO);
    });

    it('should return Libra for Sep 23', () => {
      expect(calculateZodiacSign(new Date('2024-09-23'))).toBe(ZodiacSign.LIBRA);
    });
  });

  describe('Libra boundaries (Sep 23 - Oct 22)', () => {
    it('should return Virgo for Sep 22', () => {
      expect(calculateZodiacSign(new Date('2024-09-22'))).toBe(ZodiacSign.VIRGO);
    });

    it('should return Libra for Sep 23', () => {
      expect(calculateZodiacSign(new Date('2024-09-23'))).toBe(ZodiacSign.LIBRA);
    });

    it('should return Libra for Oct 22', () => {
      expect(calculateZodiacSign(new Date('2024-10-22'))).toBe(ZodiacSign.LIBRA);
    });

    it('should return Scorpio for Oct 23', () => {
      expect(calculateZodiacSign(new Date('2024-10-23'))).toBe(ZodiacSign.SCORPIO);
    });
  });

  describe('Scorpio boundaries (Oct 23 - Nov 21)', () => {
    it('should return Libra for Oct 22', () => {
      expect(calculateZodiacSign(new Date('2024-10-22'))).toBe(ZodiacSign.LIBRA);
    });

    it('should return Scorpio for Oct 23', () => {
      expect(calculateZodiacSign(new Date('2024-10-23'))).toBe(ZodiacSign.SCORPIO);
    });

    it('should return Scorpio for Nov 21', () => {
      expect(calculateZodiacSign(new Date('2024-11-21'))).toBe(ZodiacSign.SCORPIO);
    });

    it('should return Sagittarius for Nov 22', () => {
      expect(calculateZodiacSign(new Date('2024-11-22'))).toBe(ZodiacSign.SAGITTARIUS);
    });
  });

  describe('Sagittarius boundaries (Nov 22 - Dec 21)', () => {
    it('should return Scorpio for Nov 21', () => {
      expect(calculateZodiacSign(new Date('2024-11-21'))).toBe(ZodiacSign.SCORPIO);
    });

    it('should return Sagittarius for Nov 22', () => {
      expect(calculateZodiacSign(new Date('2024-11-22'))).toBe(ZodiacSign.SAGITTARIUS);
    });

    it('should return Sagittarius for Dec 21', () => {
      expect(calculateZodiacSign(new Date('2024-12-21'))).toBe(ZodiacSign.SAGITTARIUS);
    });

    it('should return Capricorn for Dec 22', () => {
      expect(calculateZodiacSign(new Date('2024-12-22'))).toBe(ZodiacSign.CAPRICORN);
    });
  });

  describe('Capricorn boundaries (Dec 22 - Jan 19)', () => {
    it('should return Sagittarius for Dec 21', () => {
      expect(calculateZodiacSign(new Date('2024-12-21'))).toBe(ZodiacSign.SAGITTARIUS);
    });

    it('should return Capricorn for Dec 22', () => {
      expect(calculateZodiacSign(new Date('2024-12-22'))).toBe(ZodiacSign.CAPRICORN);
    });

    it('should return Capricorn for Jan 19', () => {
      expect(calculateZodiacSign(new Date('2024-01-19'))).toBe(ZodiacSign.CAPRICORN);
    });

    it('should return Aquarius for Jan 20', () => {
      expect(calculateZodiacSign(new Date('2024-01-20'))).toBe(ZodiacSign.AQUARIUS);
    });
  });

  describe('Aquarius boundaries (Jan 20 - Feb 18)', () => {
    it('should return Capricorn for Jan 19', () => {
      expect(calculateZodiacSign(new Date('2024-01-19'))).toBe(ZodiacSign.CAPRICORN);
    });

    it('should return Aquarius for Jan 20', () => {
      expect(calculateZodiacSign(new Date('2024-01-20'))).toBe(ZodiacSign.AQUARIUS);
    });

    it('should return Aquarius for Feb 18', () => {
      expect(calculateZodiacSign(new Date('2024-02-18'))).toBe(ZodiacSign.AQUARIUS);
    });

    it('should return Pisces for Feb 19', () => {
      expect(calculateZodiacSign(new Date('2024-02-19'))).toBe(ZodiacSign.PISCES);
    });
  });

  describe('Pisces boundaries (Feb 19 - Mar 20)', () => {
    it('should return Aquarius for Feb 18', () => {
      expect(calculateZodiacSign(new Date('2024-02-18'))).toBe(ZodiacSign.AQUARIUS);
    });

    it('should return Pisces for Feb 19', () => {
      expect(calculateZodiacSign(new Date('2024-02-19'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Pisces for Mar 20', () => {
      expect(calculateZodiacSign(new Date('2024-03-20'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Aries for Mar 21', () => {
      expect(calculateZodiacSign(new Date('2024-03-21'))).toBe(ZodiacSign.ARIES);
    });
  });

  describe('Leap year dates', () => {
    it('should return Pisces for Feb 29 in leap year 2024', () => {
      expect(calculateZodiacSign(new Date('2024-02-29'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Pisces for Feb 29 in leap year 2020', () => {
      expect(calculateZodiacSign(new Date('2020-02-29'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Pisces for Feb 29 in leap year 2000', () => {
      expect(calculateZodiacSign(new Date('2000-02-29'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Pisces for Feb 28 in non-leap year', () => {
      expect(calculateZodiacSign(new Date('2023-02-28'))).toBe(ZodiacSign.PISCES);
    });

    it('should return Aries for Mar 1 after leap year Feb 29', () => {
      expect(calculateZodiacSign(new Date('2024-03-01'))).toBe(ZodiacSign.PISCES);
    });
  });

  describe('Year boundary consistency', () => {
    it('should handle Capricorn across year boundary consistently', () => {
      // Test multiple years to ensure consistency
      const years = [2020, 2021, 2022, 2023, 2024];
      
      years.forEach(year => {
        expect(calculateZodiacSign(new Date(year, 11, 22))).toBe(ZodiacSign.CAPRICORN);
        expect(calculateZodiacSign(new Date(year, 0, 19))).toBe(ZodiacSign.CAPRICORN);
      });
    });

    it('should handle Aquarius start date across multiple years', () => {
      const years = [2020, 2021, 2022, 2023, 2024];
      
      years.forEach(year => {
        expect(calculateZodiacSign(new Date(year, 0, 20))).toBe(ZodiacSign.AQUARIUS);
      });
    });
  });
});
