// Unit tests for Compatibility Engine
// Feature: popular-fortune-features

import { calculateCompatibility, getBaselineCompatibility } from './engine';
import { ZodiacSign } from '../horoscope/types';

describe('Compatibility Engine', () => {
  describe('calculateCompatibility', () => {
    it('should auto-calculate zodiac signs from birth dates', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') }, // Aries
        person2: { birthDate: new Date('1992-08-10') }  // Leo
      });

      expect(reading.person1.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(reading.person2.zodiacSign).toBe(ZodiacSign.LEO);
    });

    it('should use provided zodiac signs if given', async () => {
      const reading = await calculateCompatibility({
        person1: { 
          birthDate: new Date('1990-04-15'),
          zodiacSign: ZodiacSign.TAURUS // Override
        },
        person2: { 
          birthDate: new Date('1992-08-10'),
          zodiacSign: ZodiacSign.VIRGO // Override
        }
      });

      expect(reading.person1.zodiacSign).toBe(ZodiacSign.TAURUS);
      expect(reading.person2.zodiacSign).toBe(ZodiacSign.VIRGO);
    });

    it('should calculate all score categories', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') },
        person2: { birthDate: new Date('1992-08-10') }
      });

      expect(reading.scores.overall).toBeGreaterThanOrEqual(0);
      expect(reading.scores.overall).toBeLessThanOrEqual(100);
      expect(reading.scores.communication).toBeGreaterThanOrEqual(0);
      expect(reading.scores.communication).toBeLessThanOrEqual(100);
      expect(reading.scores.emotional).toBeGreaterThanOrEqual(0);
      expect(reading.scores.emotional).toBeLessThanOrEqual(100);
      expect(reading.scores.longTerm).toBeGreaterThanOrEqual(0);
      expect(reading.scores.longTerm).toBeLessThanOrEqual(100);
    });

    it('should include strengths, challenges, and advice', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') },
        person2: { birthDate: new Date('1992-08-10') }
      });

      expect(Array.isArray(reading.strengths)).toBe(true);
      expect(reading.strengths.length).toBeGreaterThan(0);
      expect(Array.isArray(reading.challenges)).toBe(true);
      expect(reading.challenges.length).toBeGreaterThan(0);
      expect(typeof reading.advice).toBe('string');
      expect(reading.advice.length).toBeGreaterThan(0);
    });

    it('should include element compatibility description', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') },
        person2: { birthDate: new Date('1992-08-10') }
      });

      expect(typeof reading.elementCompatibility).toBe('string');
      expect(reading.elementCompatibility.length).toBeGreaterThan(0);
    });

    it('should preserve birth dates in result', async () => {
      const date1 = new Date('1990-04-15');
      const date2 = new Date('1992-08-10');
      
      const reading = await calculateCompatibility({
        person1: { birthDate: date1 },
        person2: { birthDate: date2 }
      });

      expect(reading.person1.birthDate).toBe(date1);
      expect(reading.person2.birthDate).toBe(date2);
    });
  });

  describe('getBaselineCompatibility', () => {
    it('should return same results as calculateCompatibility', () => {
      const input = {
        person1: { birthDate: new Date('1990-04-15') },
        person2: { birthDate: new Date('1992-08-10') }
      };

      const baseline = getBaselineCompatibility(input);

      expect(baseline.person1.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(baseline.person2.zodiacSign).toBe(ZodiacSign.LEO);
      expect(baseline.scores.overall).toBeGreaterThanOrEqual(0);
      expect(baseline.scores.overall).toBeLessThanOrEqual(100);
      expect(Array.isArray(baseline.strengths)).toBe(true);
      expect(Array.isArray(baseline.challenges)).toBe(true);
      expect(typeof baseline.advice).toBe('string');
    });

    it('should be deterministic - same inputs produce same outputs', () => {
      const input = {
        person1: { birthDate: new Date('1990-04-15') },
        person2: { birthDate: new Date('1992-08-10') }
      };

      const reading1 = getBaselineCompatibility(input);
      const reading2 = getBaselineCompatibility(input);

      expect(reading1.overallScore).toBe(reading2.overallScore);
      expect(reading1.scores).toEqual(reading2.scores);
      expect(reading1.strengths).toEqual(reading2.strengths);
      expect(reading1.challenges).toEqual(reading2.challenges);
      expect(reading1.advice).toBe(reading2.advice);
    });
  });

  describe('Edge cases', () => {
    it('should handle same zodiac sign compatibility', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') }, // Aries
        person2: { birthDate: new Date('1991-04-10') }  // Aries
      });

      expect(reading.person1.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(reading.person2.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(reading.overallScore).toBeGreaterThanOrEqual(0);
      expect(reading.overallScore).toBeLessThanOrEqual(100);
    });

    it('should handle zodiac boundary dates', async () => {
      // Test Aries/Taurus boundary (April 19/20)
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-19') }, // Aries
        person2: { birthDate: new Date('1990-04-20') }  // Taurus
      });

      expect(reading.person1.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(reading.person2.zodiacSign).toBe(ZodiacSign.TAURUS);
    });

    it('should handle year boundary (Capricorn)', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-12-25') }, // Capricorn
        person2: { birthDate: new Date('1991-01-15') }  // Capricorn
      });

      expect(reading.person1.zodiacSign).toBe(ZodiacSign.CAPRICORN);
      expect(reading.person2.zodiacSign).toBe(ZodiacSign.CAPRICORN);
    });
  });

  describe('Known compatibility pairs', () => {
    it('should give high score for fire trine (Aries + Leo)', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') }, // Aries
        person2: { birthDate: new Date('1992-08-10') }  // Leo
      });

      // Fire trine should have excellent compatibility
      expect(reading.overallScore).toBeGreaterThanOrEqual(85);
    });

    it('should give moderate score for challenging pairs', async () => {
      const reading = await calculateCompatibility({
        person1: { birthDate: new Date('1990-04-15') }, // Aries
        person2: { birthDate: new Date('1992-07-10') }  // Cancer
      });

      // Square aspect should have lower compatibility
      expect(reading.overallScore).toBeLessThan(70);
    });
  });
});
