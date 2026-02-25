// Tests for Chinese Zodiac Baseline Interpretations
// Feature: popular-fortune-features

import { getBaselineChineseZodiacReading } from './baseline';
import { ChineseZodiacAnimal, ChineseElement } from './types';
import { TimePeriod } from '../horoscope/types';

describe('Chinese Zodiac Baseline', () => {
  describe('getBaselineChineseZodiacReading', () => {
    it('should generate complete reading for Dragon (2024)', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      expect(reading.animal).toBe(ChineseZodiacAnimal.DRAGON);
      expect(reading.element).toBe(ChineseElement.WOOD);
      expect(reading.thaiName).toBe('ปีมะโรง');
      expect(reading.fortune.overall).toBeTruthy();
      expect(reading.fortune.career).toBeTruthy();
      expect(reading.fortune.wealth).toBeTruthy();
      expect(reading.fortune.health).toBeTruthy();
      expect(reading.fortune.relationships).toBeTruthy();
      expect(reading.luckyColors.length).toBeGreaterThan(0);
      expect(reading.luckyNumbers.length).toBeGreaterThan(0);
      expect(reading.luckyDirections.length).toBeGreaterThan(0);
      expect(reading.advice).toBeTruthy();
    });

    it('should generate complete reading for Rat (2020)', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2020,
        period: TimePeriod.WEEKLY,
        date: new Date('2024-01-15')
      });

      expect(reading.animal).toBe(ChineseZodiacAnimal.RAT);
      expect(reading.element).toBe(ChineseElement.METAL);
      expect(reading.thaiName).toBe('ปีชวด');
      expect(reading.fortune.overall).toBeTruthy();
      expect(reading.luckyColors.length).toBeGreaterThan(0);
      expect(reading.luckyNumbers.length).toBeGreaterThan(0);
    });

    it('should generate different content for different periods', () => {
      const dailyReading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      const weeklyReading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.WEEKLY,
        date: new Date('2024-01-15')
      });

      const monthlyReading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.MONTHLY,
        date: new Date('2024-01-15')
      });

      // Content should be different for different periods
      expect(dailyReading.fortune.overall).not.toBe(weeklyReading.fortune.overall);
      expect(weeklyReading.fortune.overall).not.toBe(monthlyReading.fortune.overall);
    });

    it('should generate readings for all 12 animals', () => {
      const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];
      const expectedAnimals = [
        ChineseZodiacAnimal.RAT,
        ChineseZodiacAnimal.OX,
        ChineseZodiacAnimal.TIGER,
        ChineseZodiacAnimal.RABBIT,
        ChineseZodiacAnimal.DRAGON,
        ChineseZodiacAnimal.SNAKE,
        ChineseZodiacAnimal.HORSE,
        ChineseZodiacAnimal.GOAT,
        ChineseZodiacAnimal.MONKEY,
        ChineseZodiacAnimal.ROOSTER,
        ChineseZodiacAnimal.DOG,
        ChineseZodiacAnimal.PIG
      ];

      years.forEach((year, index) => {
        const reading = getBaselineChineseZodiacReading({
          birthYear: year,
          period: TimePeriod.DAILY,
          date: new Date('2024-01-15')
        });

        expect(reading.animal).toBe(expectedAnimals[index]);
        expect(reading.fortune.overall).toBeTruthy();
        expect(reading.fortune.career).toBeTruthy();
        expect(reading.fortune.wealth).toBeTruthy();
        expect(reading.fortune.health).toBeTruthy();
        expect(reading.fortune.relationships).toBeTruthy();
      });
    });

    it('should include lucky colors from both animal and element', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      expect(reading.luckyColors.length).toBeGreaterThan(0);
      expect(reading.luckyColors.length).toBeLessThanOrEqual(3);
    });

    it('should generate deterministic lucky numbers', () => {
      const reading1 = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      const reading2 = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      expect(reading1.luckyNumbers).toEqual(reading2.luckyNumbers);
    });

    it('should calculate correct date range for daily period', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      const start = new Date(reading.dateRange.start);
      const end = new Date(reading.dateRange.end);

      expect(start.getDate()).toBe(15);
      expect(end.getDate()).toBe(15);
      expect(start.getHours()).toBe(0);
      expect(end.getHours()).toBe(23);
    });

    it('should calculate correct date range for weekly period', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.WEEKLY,
        date: new Date('2024-01-15') // Monday
      });

      const start = new Date(reading.dateRange.start);
      const end = new Date(reading.dateRange.end);

      // Should span Monday to Sunday
      expect(start.getDay()).toBe(1); // Monday
      expect(end.getDay()).toBe(0); // Sunday
    });

    it('should calculate correct date range for monthly period', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.MONTHLY,
        date: new Date('2024-01-15')
      });

      const start = new Date(reading.dateRange.start);
      const end = new Date(reading.dateRange.end);

      expect(start.getDate()).toBe(1); // First day of month
      expect(end.getDate()).toBe(31); // Last day of January
    });

    it('should include all required fortune sections', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      expect(reading.fortune).toHaveProperty('overall');
      expect(reading.fortune).toHaveProperty('career');
      expect(reading.fortune).toHaveProperty('wealth');
      expect(reading.fortune).toHaveProperty('health');
      expect(reading.fortune).toHaveProperty('relationships');
    });

    it('should include lucky directions from animal metadata', () => {
      const reading = getBaselineChineseZodiacReading({
        birthYear: 2024,
        period: TimePeriod.DAILY,
        date: new Date('2024-01-15')
      });

      expect(reading.luckyDirections).toBeDefined();
      expect(reading.luckyDirections.length).toBeGreaterThan(0);
    });
  });
});
