// Unit tests for baseline compatibility interpretations
// Feature: popular-fortune-features

import { ZodiacSign } from '../horoscope/types';
import {
  CompatibilityLevel,
  getCompatibilityLevel,
  getElementCompatibilityDescription,
  getBaselineStrengths,
  getBaselineChallenges,
  getBaselineAdvice,
  generateBaselineCompatibilityInterpretation
} from './baseline';

describe('Baseline Compatibility Interpretations', () => {
  describe('getCompatibilityLevel', () => {
    it('should return EXCELLENT for scores 85-100', () => {
      expect(getCompatibilityLevel(85)).toBe(CompatibilityLevel.EXCELLENT);
      expect(getCompatibilityLevel(95)).toBe(CompatibilityLevel.EXCELLENT);
      expect(getCompatibilityLevel(100)).toBe(CompatibilityLevel.EXCELLENT);
    });

    it('should return VERY_GOOD for scores 70-84', () => {
      expect(getCompatibilityLevel(70)).toBe(CompatibilityLevel.VERY_GOOD);
      expect(getCompatibilityLevel(77)).toBe(CompatibilityLevel.VERY_GOOD);
      expect(getCompatibilityLevel(84)).toBe(CompatibilityLevel.VERY_GOOD);
    });

    it('should return GOOD for scores 55-69', () => {
      expect(getCompatibilityLevel(55)).toBe(CompatibilityLevel.GOOD);
      expect(getCompatibilityLevel(62)).toBe(CompatibilityLevel.GOOD);
      expect(getCompatibilityLevel(69)).toBe(CompatibilityLevel.GOOD);
    });

    it('should return MODERATE for scores 40-54', () => {
      expect(getCompatibilityLevel(40)).toBe(CompatibilityLevel.MODERATE);
      expect(getCompatibilityLevel(47)).toBe(CompatibilityLevel.MODERATE);
      expect(getCompatibilityLevel(54)).toBe(CompatibilityLevel.MODERATE);
    });

    it('should return CHALLENGING for scores 0-39', () => {
      expect(getCompatibilityLevel(0)).toBe(CompatibilityLevel.CHALLENGING);
      expect(getCompatibilityLevel(25)).toBe(CompatibilityLevel.CHALLENGING);
      expect(getCompatibilityLevel(39)).toBe(CompatibilityLevel.CHALLENGING);
    });
  });

  describe('getElementCompatibilityDescription', () => {
    it('should return Thai description for Fire + Fire', () => {
      const desc = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(desc).toContain('ไฟ + ไฟ');
      expect(typeof desc).toBe('string');
      expect(desc.length).toBeGreaterThan(0);
    });

    it('should return Thai description for Fire + Air', () => {
      const desc = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.GEMINI);
      expect(desc).toContain('ไฟ + ลม');
      expect(typeof desc).toBe('string');
    });

    it('should return Thai description for Earth + Water', () => {
      const desc = getElementCompatibilityDescription(ZodiacSign.TAURUS, ZodiacSign.CANCER);
      expect(desc).toContain('ดิน + น้ำ');
      expect(typeof desc).toBe('string');
    });

    it('should return Thai description for Fire + Water', () => {
      const desc = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.CANCER);
      expect(desc).toContain('ไฟ + น้ำ');
      expect(typeof desc).toBe('string');
    });

    it('should be symmetric', () => {
      const desc1 = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.GEMINI);
      const desc2 = getElementCompatibilityDescription(ZodiacSign.GEMINI, ZodiacSign.ARIES);
      // Should describe the same element pairing (though order might differ)
      expect(desc1).toContain('ไฟ');
      expect(desc1).toContain('ลม');
      expect(desc2).toContain('ลม');
      expect(desc2).toContain('ไฟ');
    });
  });

  describe('getBaselineStrengths', () => {
    it('should return array of Thai strings', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.EXCELLENT);
      expect(Array.isArray(strengths)).toBe(true);
      expect(strengths.length).toBeGreaterThan(0);
      strengths.forEach(strength => {
        expect(typeof strength).toBe('string');
        expect(strength.length).toBeGreaterThan(0);
      });
    });

    it('should return 4 strengths for EXCELLENT level', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.EXCELLENT);
      expect(strengths.length).toBe(4);
    });

    it('should return 4 strengths for VERY_GOOD level', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.VERY_GOOD);
      expect(strengths.length).toBe(4);
    });

    it('should return 3 strengths for GOOD level', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.GOOD);
      expect(strengths.length).toBe(3);
    });

    it('should return 3 strengths for MODERATE level', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.MODERATE);
      expect(strengths.length).toBe(3);
    });

    it('should return 3 strengths for CHALLENGING level', () => {
      const strengths = getBaselineStrengths(CompatibilityLevel.CHALLENGING);
      expect(strengths.length).toBe(3);
    });
  });

  describe('getBaselineChallenges', () => {
    it('should return array of Thai strings', () => {
      const challenges = getBaselineChallenges(CompatibilityLevel.MODERATE);
      expect(Array.isArray(challenges)).toBe(true);
      expect(challenges.length).toBeGreaterThan(0);
      challenges.forEach(challenge => {
        expect(typeof challenge).toBe('string');
        expect(challenge.length).toBeGreaterThan(0);
      });
    });

    it('should return 4 challenges for CHALLENGING level', () => {
      const challenges = getBaselineChallenges(CompatibilityLevel.CHALLENGING);
      expect(challenges.length).toBe(4);
    });

    it('should return 4 challenges for MODERATE level', () => {
      const challenges = getBaselineChallenges(CompatibilityLevel.MODERATE);
      expect(challenges.length).toBe(4);
    });

    it('should return 3 challenges for GOOD level', () => {
      const challenges = getBaselineChallenges(CompatibilityLevel.GOOD);
      expect(challenges.length).toBe(3);
    });
  });

  describe('getBaselineAdvice', () => {
    it('should return Thai string', () => {
      const advice = getBaselineAdvice(CompatibilityLevel.EXCELLENT);
      expect(typeof advice).toBe('string');
      expect(advice.length).toBeGreaterThan(0);
    });

    it('should return different advice for different levels', () => {
      const excellentAdvice = getBaselineAdvice(CompatibilityLevel.EXCELLENT);
      const challengingAdvice = getBaselineAdvice(CompatibilityLevel.CHALLENGING);
      
      expect(excellentAdvice).not.toBe(challengingAdvice);
    });

    it('should return longer advice for challenging levels', () => {
      const excellentAdvice = getBaselineAdvice(CompatibilityLevel.EXCELLENT);
      const challengingAdvice = getBaselineAdvice(CompatibilityLevel.CHALLENGING);
      
      // Challenging advice should be longer (more guidance needed)
      expect(challengingAdvice.length).toBeGreaterThan(excellentAdvice.length);
    });
  });

  describe('generateBaselineCompatibilityInterpretation', () => {
    it('should return complete interpretation object', () => {
      const interpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );

      expect(interpretation).toHaveProperty('strengths');
      expect(interpretation).toHaveProperty('challenges');
      expect(interpretation).toHaveProperty('advice');
      expect(interpretation).toHaveProperty('elementCompatibility');
    });

    it('should return arrays for strengths and challenges', () => {
      const interpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );

      expect(Array.isArray(interpretation.strengths)).toBe(true);
      expect(Array.isArray(interpretation.challenges)).toBe(true);
      expect(interpretation.strengths.length).toBeGreaterThan(0);
      expect(interpretation.challenges.length).toBeGreaterThan(0);
    });

    it('should return strings for advice and elementCompatibility', () => {
      const interpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );

      expect(typeof interpretation.advice).toBe('string');
      expect(typeof interpretation.elementCompatibility).toBe('string');
      expect(interpretation.advice.length).toBeGreaterThan(0);
      expect(interpretation.elementCompatibility.length).toBeGreaterThan(0);
    });

    it('should use appropriate level based on score', () => {
      const excellentInterpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );
      const challengingInterpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.CANCER,
        35
      );

      // Excellent should have more strengths
      expect(excellentInterpretation.strengths.length).toBeGreaterThanOrEqual(
        challengingInterpretation.strengths.length
      );
    });

    it('should be deterministic for same inputs', () => {
      const interpretation1 = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );
      const interpretation2 = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );

      expect(interpretation1).toEqual(interpretation2);
    });

    it('should contain Thai text in all fields', () => {
      const interpretation = generateBaselineCompatibilityInterpretation(
        ZodiacSign.ARIES,
        ZodiacSign.LEO,
        95
      );

      // Check for Thai characters (Unicode range U+0E00 to U+0E7F)
      const thaiRegex = /[\u0E00-\u0E7F]/;
      
      expect(thaiRegex.test(interpretation.advice)).toBe(true);
      expect(thaiRegex.test(interpretation.elementCompatibility)).toBe(true);
      interpretation.strengths.forEach(strength => {
        expect(thaiRegex.test(strength)).toBe(true);
      });
      interpretation.challenges.forEach(challenge => {
        expect(thaiRegex.test(challenge)).toBe(true);
      });
    });
  });

  describe('Score range boundaries', () => {
    it('should handle boundary scores correctly', () => {
      // Test boundary between EXCELLENT and VERY_GOOD (85)
      expect(getCompatibilityLevel(84)).toBe(CompatibilityLevel.VERY_GOOD);
      expect(getCompatibilityLevel(85)).toBe(CompatibilityLevel.EXCELLENT);

      // Test boundary between VERY_GOOD and GOOD (70)
      expect(getCompatibilityLevel(69)).toBe(CompatibilityLevel.GOOD);
      expect(getCompatibilityLevel(70)).toBe(CompatibilityLevel.VERY_GOOD);

      // Test boundary between GOOD and MODERATE (55)
      expect(getCompatibilityLevel(54)).toBe(CompatibilityLevel.MODERATE);
      expect(getCompatibilityLevel(55)).toBe(CompatibilityLevel.GOOD);

      // Test boundary between MODERATE and CHALLENGING (40)
      expect(getCompatibilityLevel(39)).toBe(CompatibilityLevel.CHALLENGING);
      expect(getCompatibilityLevel(40)).toBe(CompatibilityLevel.MODERATE);
    });
  });

  describe('All zodiac sign combinations', () => {
    it('should generate interpretations for all sign pairs', () => {
      const signs = Object.values(ZodiacSign);
      
      signs.forEach(sign1 => {
        signs.forEach(sign2 => {
          const interpretation = generateBaselineCompatibilityInterpretation(
            sign1,
            sign2,
            75 // Use a middle score
          );

          expect(interpretation.strengths.length).toBeGreaterThan(0);
          expect(interpretation.challenges.length).toBeGreaterThan(0);
          expect(interpretation.advice.length).toBeGreaterThan(0);
          expect(interpretation.elementCompatibility.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
