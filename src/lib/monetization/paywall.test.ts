/**
 * Unit tests for Paywall Integration
 * Feature: popular-fortune-features
 * Tests Requirements 7.1, 7.3, 7.5, 7.6
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  checkCredits, 
  deductCredits, 
  getReadingCreditCost,
  type CreditCheckResult 
} from './paywall';
import { ReadingType } from '@/lib/reading/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Paywall Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  describe('checkCredits', () => {
    it('should allow first reading of each type for free', () => {
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(result.hasCredits).toBe(true);
      expect(result.isFreeReading).toBe(true);
      expect(result.requiredCredits).toBe(1);
      expect(result.reason).toBe('first_reading_free');
    });

    it('should check credits for second reading of same type', () => {
      // Mark first reading as used
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '5');
      
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(result.hasCredits).toBe(true);
      expect(result.isFreeReading).toBe(false);
      expect(result.requiredCredits).toBe(1);
      expect(result.currentCredits).toBe(5);
      expect(result.reason).toBe('sufficient_credits');
    });

    it('should return insufficient credits when user has not enough credits', () => {
      // Mark first reading as used
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '0');
      
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(result.hasCredits).toBe(false);
      expect(result.isFreeReading).toBe(false);
      expect(result.requiredCredits).toBe(1);
      expect(result.currentCredits).toBe(0);
      expect(result.reason).toBe('insufficient_credits');
    });

    it('should handle different credit costs for different periods', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '2');
      
      // Weekly horoscope costs 2 credits
      const weeklyResult = checkCredits(ReadingType.HOROSCOPE, { period: 'weekly' });
      expect(weeklyResult.hasCredits).toBe(true);
      expect(weeklyResult.requiredCredits).toBe(2);
      
      // Monthly horoscope costs 3 credits
      const monthlyResult = checkCredits(ReadingType.HOROSCOPE, { period: 'monthly' });
      expect(monthlyResult.hasCredits).toBe(false);
      expect(monthlyResult.requiredCredits).toBe(3);
    });

    it('should track free readings separately per feature type', () => {
      // Mark horoscope as used
      localStorageMock.setItem('free_readings_horoscope', 'true');
      
      // Compatibility should still be free
      const compatResult = checkCredits(ReadingType.COMPATIBILITY);
      expect(compatResult.isFreeReading).toBe(true);
      
      // Horoscope should not be free
      const horoscopeResult = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(horoscopeResult.isFreeReading).toBe(false);
    });
  });

  describe('deductCredits', () => {
    it('should mark free reading as used without deducting credits', () => {
      localStorageMock.setItem('mf.user.credits', '10');
      
      const success = deductCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(success).toBe(true);
      expect(localStorageMock.getItem('free_readings_horoscope')).toBe('true');
      expect(localStorageMock.getItem('mf.user.credits')).toBe('10'); // Credits unchanged
    });

    it('should deduct credits for second reading', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '5');
      
      const success = deductCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(success).toBe(true);
      expect(localStorageMock.getItem('mf.user.credits')).toBe('4'); // 5 - 1 = 4
    });

    it('should return false when insufficient credits', () => {
      localStorageMock.setItem('free_readings_compatibility', 'true');
      localStorageMock.setItem('mf.user.credits', '1');
      
      const success = deductCredits(ReadingType.COMPATIBILITY); // Costs 2 credits
      
      expect(success).toBe(false);
      expect(localStorageMock.getItem('mf.user.credits')).toBe('1'); // Credits unchanged
    });

    it('should deduct correct amount for different reading types', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '10');
      
      // Weekly horoscope costs 2 credits
      deductCredits(ReadingType.HOROSCOPE, { period: 'weekly' });
      expect(localStorageMock.getItem('mf.user.credits')).toBe('8'); // 10 - 2 = 8
      
      // Compatibility costs 2 credits
      localStorageMock.setItem('free_readings_compatibility', 'true');
      deductCredits(ReadingType.COMPATIBILITY);
      expect(localStorageMock.getItem('mf.user.credits')).toBe('6'); // 8 - 2 = 6
      
      // Chinese zodiac costs 1 credit
      localStorageMock.setItem('free_readings_chinese_zodiac', 'true');
      deductCredits(ReadingType.CHINESE_ZODIAC);
      expect(localStorageMock.getItem('mf.user.credits')).toBe('5'); // 6 - 1 = 5
    });

    it('should handle edge case of exactly enough credits', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '3');
      
      // Monthly horoscope costs exactly 3 credits
      const success = deductCredits(ReadingType.HOROSCOPE, { period: 'monthly' });
      
      expect(success).toBe(true);
      expect(localStorageMock.getItem('mf.user.credits')).toBe('0');
    });
  });

  describe('getReadingCreditCost', () => {
    it('should return correct costs for all reading types', () => {
      expect(getReadingCreditCost(ReadingType.HOROSCOPE, { period: 'daily' })).toBe(1);
      expect(getReadingCreditCost(ReadingType.HOROSCOPE, { period: 'weekly' })).toBe(2);
      expect(getReadingCreditCost(ReadingType.HOROSCOPE, { period: 'monthly' })).toBe(3);
      expect(getReadingCreditCost(ReadingType.COMPATIBILITY)).toBe(2);
      expect(getReadingCreditCost(ReadingType.CHINESE_ZODIAC)).toBe(1);
      expect(getReadingCreditCost(ReadingType.SPECIALIZED, { period: 'daily' })).toBe(1);
      expect(getReadingCreditCost(ReadingType.SPECIALIZED, { period: 'weekly' })).toBe(2);
      expect(getReadingCreditCost(ReadingType.NAME_NUMEROLOGY)).toBe(2);
    });
  });

  describe('First-time free reading policy (Requirement 7.5)', () => {
    it('should allow one free reading per feature type', () => {
      // First horoscope reading should be free
      const horoscope1 = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(horoscope1.isFreeReading).toBe(true);
      
      deductCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      // Second horoscope reading should require credits
      const horoscope2 = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(horoscope2.isFreeReading).toBe(false);
      
      // But first compatibility reading should still be free
      const compatibility1 = checkCredits(ReadingType.COMPATIBILITY);
      expect(compatibility1.isFreeReading).toBe(true);
    });
  });

  describe('Credit evaluation before processing (Requirement 7.1)', () => {
    it('should evaluate credits before allowing reading', () => {
      localStorageMock.setItem('free_readings_name_numerology', 'true');
      localStorageMock.setItem('mf.user.credits', '1');
      
      // Name numerology costs 2 credits, user has 1
      const result = checkCredits(ReadingType.NAME_NUMEROLOGY);
      
      expect(result.hasCredits).toBe(false);
      expect(result.reason).toBe('insufficient_credits');
    });
  });

  describe('Insufficient credits handling (Requirement 7.3)', () => {
    it('should identify insufficient credits scenario', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '0');
      
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      expect(result.hasCredits).toBe(false);
      expect(result.reason).toBe('insufficient_credits');
      expect(result.requiredCredits).toBe(1);
      expect(result.currentCredits).toBe(0);
    });
  });

  describe('Local storage key format (Requirement 7.6)', () => {
    it('should use correct key format for free readings', () => {
      deductCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(localStorageMock.getItem('free_readings_horoscope')).toBe('true');
      
      deductCredits(ReadingType.COMPATIBILITY);
      expect(localStorageMock.getItem('free_readings_compatibility')).toBe('true');
      
      deductCredits(ReadingType.CHINESE_ZODIAC);
      expect(localStorageMock.getItem('free_readings_chinese_zodiac')).toBe('true');
      
      deductCredits(ReadingType.SPECIALIZED, { period: 'daily' });
      expect(localStorageMock.getItem('free_readings_specialized')).toBe('true');
      
      deductCredits(ReadingType.NAME_NUMEROLOGY);
      expect(localStorageMock.getItem('free_readings_name_numerology')).toBe('true');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid credit values gracefully', () => {
      localStorageMock.setItem('mf.user.credits', 'invalid');
      
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(result.currentCredits).toBe(0);
    });

    it('should handle negative credit values', () => {
      localStorageMock.setItem('mf.user.credits', '-5');
      
      const result = checkCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      expect(result.currentCredits).toBe(0);
    });

    it('should not allow negative credits after deduction', () => {
      localStorageMock.setItem('free_readings_horoscope', 'true');
      localStorageMock.setItem('mf.user.credits', '1');
      
      deductCredits(ReadingType.HOROSCOPE, { period: 'daily' });
      
      const credits = localStorageMock.getItem('mf.user.credits');
      expect(Number(credits)).toBeGreaterThanOrEqual(0);
    });
  });
});
