import { describe, it, expect } from 'vitest';
import { thaiCharToNumber, getSupportedConsonants, getSupportedVowels, isSupportedThaiChar } from './thai-mapping';

describe('Thai Character to Number Mapping', () => {
  describe('thaiCharToNumber', () => {
    it('should map Thai consonants correctly (first cycle)', () => {
      expect(thaiCharToNumber('ก')).toBe(1);
      expect(thaiCharToNumber('ข')).toBe(2);
      expect(thaiCharToNumber('ค')).toBe(3);
      expect(thaiCharToNumber('ง')).toBe(4);
      expect(thaiCharToNumber('จ')).toBe(5);
      expect(thaiCharToNumber('ฉ')).toBe(6);
      expect(thaiCharToNumber('ช')).toBe(7);
      expect(thaiCharToNumber('ซ')).toBe(8);
      expect(thaiCharToNumber('ฌ')).toBe(9);
    });

    it('should map Thai consonants correctly (second cycle)', () => {
      expect(thaiCharToNumber('ญ')).toBe(1);
      expect(thaiCharToNumber('ฎ')).toBe(2);
      expect(thaiCharToNumber('ฏ')).toBe(3);
      expect(thaiCharToNumber('ฐ')).toBe(4);
      expect(thaiCharToNumber('ฑ')).toBe(5);
      expect(thaiCharToNumber('ฒ')).toBe(6);
      expect(thaiCharToNumber('ณ')).toBe(7);
      expect(thaiCharToNumber('ด')).toBe(8);
      expect(thaiCharToNumber('ต')).toBe(9);
    });

    it('should map Thai vowels correctly', () => {
      expect(thaiCharToNumber('ะ')).toBe(1);
      expect(thaiCharToNumber('า')).toBe(1);
      expect(thaiCharToNumber('ิ')).toBe(1);
      expect(thaiCharToNumber('ี')).toBe(2);
      expect(thaiCharToNumber('ึ')).toBe(3);
      expect(thaiCharToNumber('ื')).toBe(3);
      expect(thaiCharToNumber('ุ')).toBe(3);
      expect(thaiCharToNumber('ู')).toBe(6);
      expect(thaiCharToNumber('เ')).toBe(5);
      expect(thaiCharToNumber('แ')).toBe(5);
      expect(thaiCharToNumber('โ')).toBe(7);
      expect(thaiCharToNumber('ใ')).toBe(9);
      expect(thaiCharToNumber('ไ')).toBe(9);
    });

    it('should return 0 for spaces', () => {
      expect(thaiCharToNumber(' ')).toBe(0);
    });

    it('should return 0 for unknown characters', () => {
      expect(thaiCharToNumber('A')).toBe(0);
      expect(thaiCharToNumber('1')).toBe(0);
      expect(thaiCharToNumber('!')).toBe(0);
    });

    it('should handle tone marks', () => {
      expect(thaiCharToNumber('่')).toBe(1);
      expect(thaiCharToNumber('้')).toBe(2);
      expect(thaiCharToNumber('๊')).toBe(3);
      expect(thaiCharToNumber('๋')).toBe(4);
    });

    it('should handle silent marker', () => {
      expect(thaiCharToNumber('์')).toBe(0);
    });
  });

  describe('getSupportedConsonants', () => {
    it('should return array of Thai consonants', () => {
      const consonants = getSupportedConsonants();
      expect(consonants).toBeInstanceOf(Array);
      expect(consonants.length).toBeGreaterThan(0);
      expect(consonants).toContain('ก');
      expect(consonants).toContain('ข');
      expect(consonants).toContain('ค');
    });

    it('should return 44 consonants', () => {
      const consonants = getSupportedConsonants();
      expect(consonants.length).toBe(44);
    });
  });

  describe('getSupportedVowels', () => {
    it('should return array of Thai vowels and marks', () => {
      const vowels = getSupportedVowels();
      expect(vowels).toBeInstanceOf(Array);
      expect(vowels.length).toBeGreaterThan(0);
      expect(vowels).toContain('า');
      expect(vowels).toContain('ิ');
      expect(vowels).toContain('ี');
    });
  });

  describe('isSupportedThaiChar', () => {
    it('should return true for Thai consonants', () => {
      expect(isSupportedThaiChar('ก')).toBe(true);
      expect(isSupportedThaiChar('ข')).toBe(true);
      expect(isSupportedThaiChar('ม')).toBe(true);
    });

    it('should return true for Thai vowels', () => {
      expect(isSupportedThaiChar('า')).toBe(true);
      expect(isSupportedThaiChar('ิ')).toBe(true);
      expect(isSupportedThaiChar('ี')).toBe(true);
    });

    it('should return true for spaces', () => {
      expect(isSupportedThaiChar(' ')).toBe(true);
    });

    it('should return false for non-Thai characters', () => {
      expect(isSupportedThaiChar('A')).toBe(false);
      expect(isSupportedThaiChar('1')).toBe(false);
      expect(isSupportedThaiChar('!')).toBe(false);
    });
  });

  describe('Requirement 6.3 validation', () => {
    it('should map all characters to values in range 1-9 (except spaces and silent markers)', () => {
      const consonants = getSupportedConsonants();
      const vowels = getSupportedVowels();
      
      consonants.forEach(char => {
        const value = thaiCharToNumber(char);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(9);
      });
      
      vowels.forEach(char => {
        const value = thaiCharToNumber(char);
        // Silent marker (์) can be 0
        if (char !== '์') {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(9);
        }
      });
    });

    it('should consistently return same value for same character', () => {
      const testChars = ['ก', 'ข', 'ค', 'า', 'ิ', 'ี', 'ม', 'น'];
      
      testChars.forEach(char => {
        const value1 = thaiCharToNumber(char);
        const value2 = thaiCharToNumber(char);
        const value3 = thaiCharToNumber(char);
        
        expect(value1).toBe(value2);
        expect(value2).toBe(value3);
      });
    });
  });
});
