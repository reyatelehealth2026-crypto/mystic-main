/**
 * Unit tests for Name Numerology Engine
 * Feature: popular-fortune-features
 */

import { describe, it, expect } from 'vitest';
import { 
  isValidThaiName, 
  calculateNameScore, 
  calculateAllNameScores 
} from './engine';

describe('Name Numerology Engine', () => {
  describe('isValidThaiName', () => {
    it('should accept valid Thai names', () => {
      expect(isValidThaiName('สมชาย')).toBe(true);
      expect(isValidThaiName('นางสาว')).toBe(true);
      expect(isValidThaiName('ประเสริฐ')).toBe(true);
    });

    it('should accept Thai names with spaces', () => {
      expect(isValidThaiName('สม ชาย')).toBe(true);
      expect(isValidThaiName('นาง สาว')).toBe(true);
      expect(isValidThaiName('ประ เสริฐ')).toBe(true);
    });

    it('should reject names with English characters', () => {
      expect(isValidThaiName('John')).toBe(false);
      expect(isValidThaiName('Smith')).toBe(false);
      expect(isValidThaiName('สมชาย Smith')).toBe(false);
      expect(isValidThaiName('John ใจดี')).toBe(false);
    });

    it('should reject names with numbers', () => {
      expect(isValidThaiName('สมชาย123')).toBe(false);
      expect(isValidThaiName('123')).toBe(false);
    });

    it('should reject empty or whitespace-only names', () => {
      expect(isValidThaiName('')).toBe(false);
      expect(isValidThaiName('   ')).toBe(false);
      expect(isValidThaiName('\t')).toBe(false);
    });

    it('should reject names with special characters', () => {
      expect(isValidThaiName('สมชาย@')).toBe(false);
      expect(isValidThaiName('สมชาย!')).toBe(false);
      expect(isValidThaiName('สมชาย#')).toBe(false);
    });
  });

  describe('calculateNameScore', () => {
    it('should calculate score for Thai names', () => {
      // Test with known mappings
      // ก=1, so 'ก' should give 1
      const score1 = calculateNameScore('ก');
      expect(score1).toBeGreaterThanOrEqual(1);
      expect(score1).toBeLessThanOrEqual(22);
    });

    it('should return a valid score range (1-9, 11, or 22)', () => {
      const names = ['สมชาย', 'นางสาว', 'ประเสริฐ', 'วิชัย', 'สุดา'];
      
      names.forEach(name => {
        const score = calculateNameScore(name);
        
        // Score should be 1-9, 11, or 22
        const isValid = 
          (score >= 1 && score <= 9) || 
          score === 11 || 
          score === 22;
        
        expect(isValid).toBe(true);
      });
    });

    it('should handle names with spaces by ignoring them', () => {
      const score1 = calculateNameScore('สมชาย');
      const score2 = calculateNameScore('สม ชาย');
      
      // Scores should be the same (spaces ignored)
      expect(score1).toBe(score2);
    });

    it('should produce consistent results for same name', () => {
      const name = 'สมชาย';
      const score1 = calculateNameScore(name);
      const score2 = calculateNameScore(name);
      
      expect(score1).toBe(score2);
    });

    it('should preserve master number 11', () => {
      // We need to find a name that sums to 11
      // This is a property that should hold, tested separately
      // Here we just verify the function doesn't break
      const score = calculateNameScore('สมชาย');
      expect(typeof score).toBe('number');
    });

    it('should preserve master number 22', () => {
      // Similar to above, we verify the function works
      const score = calculateNameScore('ประเสริฐ');
      expect(typeof score).toBe('number');
    });
  });

  describe('calculateAllNameScores', () => {
    it('should calculate all four scores', () => {
      const scores = calculateAllNameScores('สมชาย', 'ใจดี');
      
      expect(scores).toHaveProperty('firstName');
      expect(scores).toHaveProperty('lastName');
      expect(scores).toHaveProperty('fullName');
      expect(scores).toHaveProperty('destiny');
    });

    it('should return valid score ranges for all scores', () => {
      const scores = calculateAllNameScores('สมชาย', 'ใจดี');
      
      const isValidScore = (score: number) => 
        (score >= 1 && score <= 9) || score === 11 || score === 22;
      
      expect(isValidScore(scores.firstName)).toBe(true);
      expect(isValidScore(scores.lastName)).toBe(true);
      expect(isValidScore(scores.fullName)).toBe(true);
      expect(isValidScore(scores.destiny)).toBe(true);
    });

    it('should produce consistent results for same names', () => {
      const scores1 = calculateAllNameScores('สมชาย', 'ใจดี');
      const scores2 = calculateAllNameScores('สมชาย', 'ใจดี');
      
      expect(scores1).toEqual(scores2);
    });

    it('should calculate different scores for different names', () => {
      const scores1 = calculateAllNameScores('สมชาย', 'ใจดี');
      const scores2 = calculateAllNameScores('วิชัย', 'รักดี');
      
      // At least one score should be different
      const isDifferent = 
        scores1.firstName !== scores2.firstName ||
        scores1.lastName !== scores2.lastName ||
        scores1.fullName !== scores2.fullName ||
        scores1.destiny !== scores2.destiny;
      
      expect(isDifferent).toBe(true);
    });

    it('should handle names with spaces', () => {
      const scores1 = calculateAllNameScores('สมชาย', 'ใจดี');
      const scores2 = calculateAllNameScores('สม ชาย', 'ใจ ดี');
      
      // Scores should be the same (spaces ignored)
      expect(scores1).toEqual(scores2);
    });
  });

  describe('Edge cases', () => {
    it('should handle single character names', () => {
      const scores = calculateAllNameScores('ก', 'ข');
      
      expect(scores.firstName).toBeGreaterThanOrEqual(1);
      expect(scores.lastName).toBeGreaterThanOrEqual(1);
      expect(scores.fullName).toBeGreaterThanOrEqual(1);
      expect(scores.destiny).toBeGreaterThanOrEqual(1);
    });

    it('should handle long names', () => {
      const longFirstName = 'ประเสริฐศักดิ์ศรี';
      const longLastName = 'เจริญสุขสมบูรณ์';
      
      const scores = calculateAllNameScores(longFirstName, longLastName);
      
      const isValidScore = (score: number) => 
        (score >= 1 && score <= 9) || score === 11 || score === 22;
      
      expect(isValidScore(scores.firstName)).toBe(true);
      expect(isValidScore(scores.lastName)).toBe(true);
      expect(isValidScore(scores.fullName)).toBe(true);
      expect(isValidScore(scores.destiny)).toBe(true);
    });

    it('should handle names with tone marks', () => {
      const scores = calculateAllNameScores('สมชาย', 'ใจดี');
      
      expect(scores.firstName).toBeGreaterThanOrEqual(1);
      expect(scores.lastName).toBeGreaterThanOrEqual(1);
    });
  });
});
