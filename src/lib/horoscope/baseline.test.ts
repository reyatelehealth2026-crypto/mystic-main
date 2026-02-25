// Unit tests for baseline horoscope generation
// Feature: popular-fortune-features

import { describe, it, expect } from 'vitest';
import { getBaselineHoroscope } from './baseline';
import { ZodiacSign } from './types';

describe('Baseline Horoscope Generation', () => {
  describe('getBaselineHoroscope', () => {
    it('should generate complete horoscope with all aspects', () => {
      const result = getBaselineHoroscope(ZodiacSign.ARIES, new Date('2024-01-15'));
      
      expect(result.love).toBeTruthy();
      expect(result.career).toBeTruthy();
      expect(result.finance).toBeTruthy();
      expect(result.health).toBeTruthy();
      expect(result.advice).toBeTruthy();
      expect(result.luckyNumbers).toHaveLength(expect.any(Number));
      expect(result.luckyColors).toHaveLength(expect.any(Number));
    });

    it('should generate deterministic content for same zodiac and date', () => {
      const date = new Date('2024-01-15');
      const result1 = getBaselineHoroscope(ZodiacSign.ARIES, date);
      const result2 = getBaselineHoroscope(ZodiacSign.ARIES, date);
      
      expect(result1.love).toBe(result2.love);
      expect(result1.career).toBe(result2.career);
      expect(result1.finance).toBe(result2.finance);
      expect(result1.health).toBe(result2.health);
      expect(result1.advice).toBe(result2.advice);
      expect(result1.luckyNumbers).toEqual(result2.luckyNumbers);
      expect(result1.luckyColors).toEqual(result2.luckyColors);
    });

    it('should generate different content for different dates', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      const result1 = getBaselineHoroscope(ZodiacSign.ARIES, date1);
      const result2 = getBaselineHoroscope(ZodiacSign.ARIES, date2);
      
      // At least some aspects should be different
      const hasDifference = 
        result1.love !== result2.love ||
        result1.career !== result2.career ||
        result1.finance !== result2.finance ||
        result1.health !== result2.health ||
        result1.advice !== result2.advice;
      
      expect(hasDifference).toBe(true);
    });

    it('should generate lucky numbers in valid range (1-99)', () => {
      const result = getBaselineHoroscope(ZodiacSign.ARIES, new Date('2024-01-15'));
      
      expect(result.luckyNumbers.length).toBeGreaterThanOrEqual(3);
      expect(result.luckyNumbers.length).toBeLessThanOrEqual(5);
      
      result.luckyNumbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(99);
      });
    });

    it('should generate lucky colors (2-3 colors)', () => {
      const result = getBaselineHoroscope(ZodiacSign.ARIES, new Date('2024-01-15'));
      
      expect(result.luckyColors.length).toBeGreaterThanOrEqual(2);
      expect(result.luckyColors.length).toBeLessThanOrEqual(3);
      
      result.luckyColors.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color.length).toBeGreaterThan(0);
      });
    });

    it('should generate Thai language content', () => {
      const result = getBaselineHoroscope(ZodiacSign.ARIES, new Date('2024-01-15'));
      
      // Check for Thai characters (Unicode range U+0E00-U+0E7F)
      const thaiCharRegex = /[\u0E00-\u0E7F]/;
      
      expect(thaiCharRegex.test(result.love)).toBe(true);
      expect(thaiCharRegex.test(result.career)).toBe(true);
      expect(thaiCharRegex.test(result.finance)).toBe(true);
      expect(thaiCharRegex.test(result.health)).toBe(true);
      expect(thaiCharRegex.test(result.advice)).toBe(true);
    });

    it('should work for all zodiac signs', () => {
      const date = new Date('2024-01-15');
      const allSigns = Object.values(ZodiacSign);
      
      allSigns.forEach(sign => {
        const result = getBaselineHoroscope(sign, date);
        
        expect(result.love).toBeTruthy();
        expect(result.career).toBeTruthy();
        expect(result.finance).toBeTruthy();
        expect(result.health).toBeTruthy();
        expect(result.advice).toBeTruthy();
        expect(result.luckyNumbers.length).toBeGreaterThan(0);
        expect(result.luckyColors.length).toBeGreaterThan(0);
      });
    });
  });
});
