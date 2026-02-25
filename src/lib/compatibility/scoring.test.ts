// Unit tests for compatibility scoring algorithm
// Feature: popular-fortune-features

import { ZodiacSign } from '../horoscope/types';
import {
  calculateElementScore,
  calculateQualityScore,
  getSignSpecificAdjustment,
  calculateOverallScore,
  calculateDetailedScores
} from './scoring';

describe('Compatibility Scoring Algorithm', () => {
  describe('calculateElementScore', () => {
    it('should return high score for same element', () => {
      // Fire + Fire
      const score = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(score).toBeGreaterThanOrEqual(90);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return compatible score for Fire + Air', () => {
      const score = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.GEMINI);
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThanOrEqual(85);
    });

    it('should return compatible score for Earth + Water', () => {
      const score = calculateElementScore(ZodiacSign.TAURUS, ZodiacSign.CANCER);
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThanOrEqual(85);
    });

    it('should return challenging score for Fire + Water', () => {
      const score = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
      expect(score).toBeGreaterThanOrEqual(30);
      expect(score).toBeLessThanOrEqual(45);
    });

    it('should return challenging score for Earth + Fire', () => {
      const score = calculateElementScore(ZodiacSign.TAURUS, ZodiacSign.ARIES);
      expect(score).toBeGreaterThanOrEqual(30);
      expect(score).toBeLessThanOrEqual(45);
    });
  });

  describe('calculateQualityScore', () => {
    it('should return high score for same quality', () => {
      // Both cardinal
      const score = calculateQualityScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
      expect(score).toBeGreaterThanOrEqual(80);
      expect(score).toBeLessThanOrEqual(90);
    });

    it('should return moderate score for different qualities', () => {
      // Cardinal + Fixed
      const score = calculateQualityScore(ZodiacSign.ARIES, ZodiacSign.TAURUS);
      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThanOrEqual(75);
    });
  });

  describe('getSignSpecificAdjustment', () => {
    it('should return positive adjustment for fire trines', () => {
      const adjustment = getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(adjustment).toBe(10);
    });

    it('should return negative adjustment for squares', () => {
      const adjustment = getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.CANCER);
      expect(adjustment).toBe(-8);
    });

    it('should return zero for neutral pairings', () => {
      const adjustment = getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.TAURUS);
      expect(adjustment).toBe(0);
    });

    it('should be symmetric', () => {
      const adj1 = getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.LEO);
      const adj2 = getSignSpecificAdjustment(ZodiacSign.LEO, ZodiacSign.ARIES);
      expect(adj1).toBe(adj2);
    });
  });

  describe('calculateOverallScore', () => {
    it('should return score in valid range [0, 100]', () => {
      const score = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return high score for excellent matches', () => {
      // Aries + Leo (fire trine)
      const score = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(score).toBeGreaterThanOrEqual(85);
    });

    it('should return low score for challenging matches', () => {
      // Aries + Cancer (square)
      const score = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
      expect(score).toBeLessThanOrEqual(55);
    });

    it('should be deterministic', () => {
      const score1 = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      const score2 = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      expect(score1).toBe(score2);
    });

    it('should be symmetric', () => {
      const score1 = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
      const score2 = calculateOverallScore(ZodiacSign.LEO, ZodiacSign.ARIES);
      expect(score1).toBe(score2);
    });
  });

  describe('calculateDetailedScores', () => {
    it('should return all four score categories', () => {
      const scores = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
      
      expect(scores).toHaveProperty('overall');
      expect(scores).toHaveProperty('communication');
      expect(scores).toHaveProperty('emotional');
      expect(scores).toHaveProperty('longTerm');
    });

    it('should return scores in valid range [0, 100]', () => {
      const scores = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
      
      expect(scores.overall).toBeGreaterThanOrEqual(0);
      expect(scores.overall).toBeLessThanOrEqual(100);
      expect(scores.communication).toBeGreaterThanOrEqual(0);
      expect(scores.communication).toBeLessThanOrEqual(100);
      expect(scores.emotional).toBeGreaterThanOrEqual(0);
      expect(scores.emotional).toBeLessThanOrEqual(100);
      expect(scores.longTerm).toBeGreaterThanOrEqual(0);
      expect(scores.longTerm).toBeLessThanOrEqual(100);
    });

    it('should boost communication for air signs', () => {
      // Gemini (air) + Leo (fire)
      const airScores = calculateDetailedScores(ZodiacSign.GEMINI, ZodiacSign.LEO);
      // Aries (fire) + Leo (fire) - no air
      const noAirScores = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
      
      // Air signs should have higher communication scores
      expect(airScores.communication).toBeGreaterThanOrEqual(noAirScores.communication - 5);
    });

    it('should boost emotional for water signs', () => {
      // Cancer (water) + Scorpio (water)
      const waterScores = calculateDetailedScores(ZodiacSign.CANCER, ZodiacSign.SCORPIO);
      
      // Water signs should have high emotional scores
      expect(waterScores.emotional).toBeGreaterThanOrEqual(80);
    });

    it('should boost long-term for earth signs', () => {
      // Taurus (earth) + Virgo (earth)
      const earthScores = calculateDetailedScores(ZodiacSign.TAURUS, ZodiacSign.VIRGO);
      
      // Earth signs should have high long-term scores
      expect(earthScores.longTerm).toBeGreaterThanOrEqual(80);
    });

    it('should be deterministic', () => {
      const scores1 = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
      const scores2 = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
      
      expect(scores1).toEqual(scores2);
    });
  });

  describe('Edge cases', () => {
    it('should handle all zodiac sign combinations', () => {
      const signs = Object.values(ZodiacSign);
      
      signs.forEach(sign1 => {
        signs.forEach(sign2 => {
          const score = calculateOverallScore(sign1, sign2);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        });
      });
    });

    it('should handle same sign pairing', () => {
      const score = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.ARIES);
      expect(score).toBeGreaterThanOrEqual(85); // Same element and quality
    });
  });

  describe('Known compatibility pairings', () => {
    it('should rate fire trines highly', () => {
      // Aries + Leo
      expect(calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO)).toBeGreaterThanOrEqual(85);
      // Aries + Sagittarius
      expect(calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.SAGITTARIUS)).toBeGreaterThanOrEqual(85);
      // Leo + Sagittarius
      expect(calculateOverallScore(ZodiacSign.LEO, ZodiacSign.SAGITTARIUS)).toBeGreaterThanOrEqual(85);
    });

    it('should rate earth trines highly', () => {
      // Taurus + Virgo
      expect(calculateOverallScore(ZodiacSign.TAURUS, ZodiacSign.VIRGO)).toBeGreaterThanOrEqual(85);
      // Taurus + Capricorn
      expect(calculateOverallScore(ZodiacSign.TAURUS, ZodiacSign.CAPRICORN)).toBeGreaterThanOrEqual(85);
      // Virgo + Capricorn
      expect(calculateOverallScore(ZodiacSign.VIRGO, ZodiacSign.CAPRICORN)).toBeGreaterThanOrEqual(85);
    });

    it('should rate air trines highly', () => {
      // Gemini + Libra
      expect(calculateOverallScore(ZodiacSign.GEMINI, ZodiacSign.LIBRA)).toBeGreaterThanOrEqual(85);
      // Gemini + Aquarius
      expect(calculateOverallScore(ZodiacSign.GEMINI, ZodiacSign.AQUARIUS)).toBeGreaterThanOrEqual(85);
      // Libra + Aquarius
      expect(calculateOverallScore(ZodiacSign.LIBRA, ZodiacSign.AQUARIUS)).toBeGreaterThanOrEqual(85);
    });

    it('should rate water trines highly', () => {
      // Cancer + Scorpio
      expect(calculateOverallScore(ZodiacSign.CANCER, ZodiacSign.SCORPIO)).toBeGreaterThanOrEqual(85);
      // Cancer + Pisces
      expect(calculateOverallScore(ZodiacSign.CANCER, ZodiacSign.PISCES)).toBeGreaterThanOrEqual(85);
      // Scorpio + Pisces
      expect(calculateOverallScore(ZodiacSign.SCORPIO, ZodiacSign.PISCES)).toBeGreaterThanOrEqual(85);
    });
  });
});
