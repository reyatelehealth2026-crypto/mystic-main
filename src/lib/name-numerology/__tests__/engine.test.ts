/**
 * Unit tests for Name Numerology Engine
 * Feature: popular-fortune-features
 */

import {
  isValidThaiName,
  calculateNameScore,
  calculateAllNameScores,
  getBaselineNameNumerology,
  calculateNameNumerology
} from '../engine';

describe('Name Numerology Engine', () => {
  describe('isValidThaiName', () => {
    it('should accept valid Thai names', () => {
      expect(isValidThaiName('สมชาย')).toBe(true);
      expect(isValidThaiName('นางสาว')).toBe(true);
      expect(isValidThaiName('สม ชาย')).toBe(true);
    });

    it('should reject names with English characters', () => {
      expect(isValidThaiName('John')).toBe(false);
      expect(isValidThaiName('สมชาย Smith')).toBe(false);
    });

    it('should reject empty or whitespace-only names', () => {
      expect(isValidThaiName('')).toBe(false);
      expect(isValidThaiName('   ')).toBe(false);
    });
  });

  describe('calculateNameScore', () => {
    it('should calculate score for Thai names', () => {
      const score = calculateNameScore('สมชาย');
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(22);
    });

    it('should return consistent scores for same name', () => {
      const score1 = calculateNameScore('สมชาย');
      const score2 = calculateNameScore('สมชาย');
      expect(score1).toBe(score2);
    });

    it('should handle names with spaces', () => {
      const score1 = calculateNameScore('สมชาย');
      const score2 = calculateNameScore('สม ชาย');
      expect(score1).toBe(score2);
    });
  });

  describe('calculateAllNameScores', () => {
    it('should calculate all four scores', () => {
      const scores = calculateAllNameScores('สมชาย', 'ใจดี');
      
      expect(scores).toHaveProperty('firstName');
      expect(scores).toHaveProperty('lastName');
      expect(scores).toHaveProperty('fullName');
      expect(scores).toHaveProperty('destiny');
      
      expect(scores.firstName).toBeGreaterThanOrEqual(1);
      expect(scores.lastName).toBeGreaterThanOrEqual(1);
      expect(scores.fullName).toBeGreaterThanOrEqual(1);
      expect(scores.destiny).toBeGreaterThanOrEqual(1);
    });

    it('should calculate destiny as sum of first and last name', () => {
      const scores = calculateAllNameScores('ก', 'ข');
      // ก = 1, ข = 2, destiny should be 3
      expect(scores.firstName).toBe(1);
      expect(scores.lastName).toBe(2);
      expect(scores.destiny).toBe(3);
    });
  });

  describe('getBaselineNameNumerology', () => {
    it('should generate complete reading for valid names', () => {
      const reading = getBaselineNameNumerology({
        firstName: 'สมชาย',
        lastName: 'ใจดี'
      });

      expect(reading.firstName).toBe('สมชาย');
      expect(reading.lastName).toBe('ใจดี');
      expect(reading.scores).toBeDefined();
      expect(reading.interpretation).toBeDefined();
      expect(reading.interpretation.personality).toBeTruthy();
      expect(reading.interpretation.strengths).toBeInstanceOf(Array);
      expect(reading.interpretation.weaknesses).toBeInstanceOf(Array);
      expect(reading.interpretation.lifePath).toBeTruthy();
      expect(reading.interpretation.career).toBeTruthy();
      expect(reading.interpretation.relationships).toBeTruthy();
      expect(reading.luckyNumbers).toBeInstanceOf(Array);
      expect(reading.luckyNumbers.length).toBeGreaterThan(0);
      expect(reading.advice).toBeTruthy();
    });

    it('should throw error for invalid first name', () => {
      expect(() => {
        getBaselineNameNumerology({
          firstName: 'John',
          lastName: 'ใจดี'
        });
      }).toThrow('ชื่อต้องเป็นตัวอักษรไทยเท่านั้น');
    });

    it('should throw error for invalid last name', () => {
      expect(() => {
        getBaselineNameNumerology({
          firstName: 'สมชาย',
          lastName: 'Smith'
        });
      }).toThrow('นามสกุลต้องเป็นตัวอักษรไทยเท่านั้น');
    });
  });

  describe('calculateNameNumerology', () => {
    it('should return a promise that resolves to reading', async () => {
      const reading = await calculateNameNumerology({
        firstName: 'สมชาย',
        lastName: 'ใจดี'
      });

      expect(reading).toBeDefined();
      expect(reading.firstName).toBe('สมชาย');
      expect(reading.lastName).toBe('ใจดี');
      expect(reading.scores).toBeDefined();
      expect(reading.interpretation).toBeDefined();
    });
  });

  describe('Lucky Numbers', () => {
    it('should generate 5 lucky numbers', () => {
      const reading = getBaselineNameNumerology({
        firstName: 'สมชาย',
        lastName: 'ใจดี'
      });

      expect(reading.luckyNumbers).toHaveLength(5);
    });

    it('should include destiny number as first lucky number', () => {
      const reading = getBaselineNameNumerology({
        firstName: 'สมชาย',
        lastName: 'ใจดี'
      });

      expect(reading.luckyNumbers[0]).toBe(reading.scores.destiny);
    });
  });
});
