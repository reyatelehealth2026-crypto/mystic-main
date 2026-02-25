// Tests for Horoscope Engine
// Feature: popular-fortune-features

import { 
  calculateDateRange, 
  getBaselineHoroscopeReading, 
  generateHoroscope 
} from './engine';
import { ZodiacSign, TimePeriod } from './types';

describe('Horoscope Engine', () => {
  describe('calculateDateRange', () => {
    it('should calculate daily date range correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const range = calculateDateRange(date, TimePeriod.DAILY);
      
      expect(range.start.getDate()).toBe(15);
      expect(range.end.getDate()).toBe(15);
      expect(range.start.getHours()).toBe(0);
      expect(range.end.getHours()).toBe(23);
    });
    
    it('should calculate weekly date range (Monday to Sunday)', () => {
      // Wednesday, Jan 10, 2024
      const date = new Date('2024-01-10T12:00:00');
      const range = calculateDateRange(date, TimePeriod.WEEKLY);
      
      // Should start on Monday, Jan 8
      expect(range.start.getDate()).toBe(8);
      expect(range.start.getDay()).toBe(1); // Monday
      
      // Should end on Sunday, Jan 14
      expect(range.end.getDate()).toBe(14);
      expect(range.end.getDay()).toBe(0); // Sunday
    });
    
    it('should calculate monthly date range correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const range = calculateDateRange(date, TimePeriod.MONTHLY);
      
      // Should start on Jan 1
      expect(range.start.getDate()).toBe(1);
      expect(range.start.getMonth()).toBe(0); // January
      
      // Should end on Jan 31
      expect(range.end.getDate()).toBe(31);
      expect(range.end.getMonth()).toBe(0); // January
    });
    
    it('should handle February correctly', () => {
      const date = new Date('2024-02-15T12:00:00');
      const range = calculateDateRange(date, TimePeriod.MONTHLY);
      
      expect(range.start.getDate()).toBe(1);
      expect(range.end.getDate()).toBe(29); // 2024 is a leap year
    });
    
    it('should handle week starting on Sunday', () => {
      // Sunday, Jan 14, 2024
      const date = new Date('2024-01-14T12:00:00');
      const range = calculateDateRange(date, TimePeriod.WEEKLY);
      
      // Should start on Monday, Jan 8
      expect(range.start.getDate()).toBe(8);
      expect(range.start.getDay()).toBe(1); // Monday
      
      // Should end on Sunday, Jan 14
      expect(range.end.getDate()).toBe(14);
      expect(range.end.getDay()).toBe(0); // Sunday
    });
    
    it('should handle week starting on Monday', () => {
      // Monday, Jan 8, 2024
      const date = new Date('2024-01-08T12:00:00');
      const range = calculateDateRange(date, TimePeriod.WEEKLY);
      
      // Should start on same Monday
      expect(range.start.getDate()).toBe(8);
      expect(range.start.getDay()).toBe(1); // Monday
      
      // Should end on Sunday, Jan 14
      expect(range.end.getDate()).toBe(14);
      expect(range.end.getDay()).toBe(0); // Sunday
    });
  });
  
  describe('getBaselineHoroscopeReading', () => {
    it('should generate complete horoscope reading', () => {
      const reading = getBaselineHoroscopeReading({
        zodiacSign: ZodiacSign.ARIES,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });
      
      expect(reading.zodiacSign).toBe(ZodiacSign.ARIES);
      expect(reading.period).toBe(TimePeriod.DAILY);
      expect(reading.dateRange).toBeDefined();
      expect(reading.aspects.love).toBeTruthy();
      expect(reading.aspects.career).toBeTruthy();
      expect(reading.aspects.finance).toBeTruthy();
      expect(reading.aspects.health).toBeTruthy();
      expect(reading.luckyNumbers.length).toBeGreaterThan(0);
      expect(reading.luckyColors.length).toBeGreaterThan(0);
      expect(reading.advice).toBeTruthy();
      expect(reading.confidence).toBe(70);
    });
    
    it('should generate deterministic content for same input', () => {
      const input = {
        zodiacSign: ZodiacSign.LEO,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      };
      
      const reading1 = getBaselineHoroscopeReading(input);
      const reading2 = getBaselineHoroscopeReading(input);
      
      expect(reading1.aspects.love).toBe(reading2.aspects.love);
      expect(reading1.aspects.career).toBe(reading2.aspects.career);
      expect(reading1.luckyNumbers).toEqual(reading2.luckyNumbers);
      expect(reading1.luckyColors).toEqual(reading2.luckyColors);
    });
    
    it('should generate different content for different dates', () => {
      const reading1 = getBaselineHoroscopeReading({
        zodiacSign: ZodiacSign.GEMINI,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });
      
      const reading2 = getBaselineHoroscopeReading({
        zodiacSign: ZodiacSign.GEMINI,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-16')
      });
      
      // Content should be different for different dates
      expect(reading1.aspects.love).not.toBe(reading2.aspects.love);
    });
    
    it('should generate different content for different zodiac signs', () => {
      const date = new Date('2024-01-15');
      
      const reading1 = getBaselineHoroscopeReading({
        zodiacSign: ZodiacSign.ARIES,
        period: TimePeriod.DAILY,
        date
      });
      
      const reading2 = getBaselineHoroscopeReading({
        zodiacSign: ZodiacSign.TAURUS,
        period: TimePeriod.DAILY,
        date
      });
      
      // Content should be different for different signs
      expect(reading1.aspects.love).not.toBe(reading2.aspects.love);
    });
  });
  
  describe('generateHoroscope', () => {
    it('should generate horoscope with caching', async () => {
      const input = {
        zodiacSign: ZodiacSign.VIRGO,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      };
      
      const reading = await generateHoroscope(input);
      
      expect(reading).toBeDefined();
      expect(reading.zodiacSign).toBe(ZodiacSign.VIRGO);
      expect(reading.aspects.love).toBeTruthy();
    });
    
    it('should return cached reading on second call', async () => {
      const input = {
        zodiacSign: ZodiacSign.LIBRA,
        period: TimePeriod.WEEKLY,
        date: new Date('2024-01-15')
      };
      
      const reading1 = await generateHoroscope(input);
      const reading2 = await generateHoroscope(input);
      
      // Should return exact same object from cache
      expect(reading1.aspects.love).toBe(reading2.aspects.love);
      expect(reading1.luckyNumbers).toEqual(reading2.luckyNumbers);
    });
  });
});
