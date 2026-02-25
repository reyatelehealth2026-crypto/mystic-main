// Unit tests for Chinese Zodiac calculations
// Feature: popular-fortune-features

import {
  calculateChineseZodiac,
  calculateChineseElement,
  getAnimalMetadata,
  getElementMetadata,
  getAnimalThaiName,
  getAnimalChineseName,
  getElementThaiName,
  getElementChineseName,
  getAllAnimals,
  getAllElements,
  ANIMAL_METADATA,
  ELEMENT_METADATA
} from './animals';
import { ChineseZodiacAnimal, ChineseElement } from './types';

describe('Chinese Zodiac Calculation', () => {
  describe('calculateChineseZodiac', () => {
    it('should calculate correct animal for known years', () => {
      // Test specific known years
      expect(calculateChineseZodiac(2024)).toBe(ChineseZodiacAnimal.DRAGON);
      expect(calculateChineseZodiac(2025)).toBe(ChineseZodiacAnimal.SNAKE);
      expect(calculateChineseZodiac(2020)).toBe(ChineseZodiacAnimal.RAT);
      expect(calculateChineseZodiac(2021)).toBe(ChineseZodiacAnimal.OX);
      expect(calculateChineseZodiac(2022)).toBe(ChineseZodiacAnimal.TIGER);
      expect(calculateChineseZodiac(2023)).toBe(ChineseZodiacAnimal.RABBIT);
    });

    it('should handle the full 12-year cycle', () => {
      const baseYear = 2020; // Rat year
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

      for (let i = 0; i < 12; i++) {
        expect(calculateChineseZodiac(baseYear + i)).toBe(expectedAnimals[i]);
      }
    });

    it('should handle historical years', () => {
      expect(calculateChineseZodiac(1900)).toBe(ChineseZodiacAnimal.RAT);
      expect(calculateChineseZodiac(1950)).toBe(ChineseZodiacAnimal.TIGER);
      expect(calculateChineseZodiac(2000)).toBe(ChineseZodiacAnimal.DRAGON);
    });
  });

  describe('calculateChineseElement', () => {
    it('should calculate correct element for known years', () => {
      // Test specific known years
      expect(calculateChineseElement(2024)).toBe(ChineseElement.WOOD);
      expect(calculateChineseElement(2025)).toBe(ChineseElement.WOOD);
      expect(calculateChineseElement(2026)).toBe(ChineseElement.FIRE);
      expect(calculateChineseElement(2027)).toBe(ChineseElement.FIRE);
      expect(calculateChineseElement(2028)).toBe(ChineseElement.EARTH);
      expect(calculateChineseElement(2029)).toBe(ChineseElement.EARTH);
    });

    it('should handle the full 10-year element cycle', () => {
      const baseYear = 2024; // Wood year
      const expectedElements = [
        ChineseElement.WOOD,   // 2024
        ChineseElement.WOOD,   // 2025
        ChineseElement.FIRE,   // 2026
        ChineseElement.FIRE,   // 2027
        ChineseElement.EARTH,  // 2028
        ChineseElement.EARTH,  // 2029
        ChineseElement.METAL,  // 2030
        ChineseElement.METAL,  // 2031
        ChineseElement.WATER,  // 2032
        ChineseElement.WATER   // 2033
      ];

      for (let i = 0; i < 10; i++) {
        expect(calculateChineseElement(baseYear + i)).toBe(expectedElements[i]);
      }
    });

    it('should handle historical years', () => {
      expect(calculateChineseElement(1900)).toBe(ChineseElement.METAL);
      expect(calculateChineseElement(1950)).toBe(ChineseElement.METAL);
      expect(calculateChineseElement(2000)).toBe(ChineseElement.METAL);
    });
  });

  describe('Animal Metadata', () => {
    it('should have metadata for all 12 animals', () => {
      expect(Object.keys(ANIMAL_METADATA).length).toBe(12);
    });

    it('should have Thai names for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.thaiName).toBeTruthy();
        expect(metadata.thaiName.length).toBeGreaterThan(0);
      });
    });

    it('should have Chinese names for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.chineseName).toBeTruthy();
        expect(metadata.chineseName.length).toBeGreaterThan(0);
      });
    });

    it('should have traits for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.traits).toBeDefined();
        expect(metadata.traits.length).toBeGreaterThan(0);
      });
    });

    it('should have lucky colors for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.luckyColors).toBeDefined();
        expect(metadata.luckyColors.length).toBeGreaterThan(0);
      });
    });

    it('should have lucky numbers for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.luckyNumbers).toBeDefined();
        expect(metadata.luckyNumbers.length).toBeGreaterThan(0);
      });
    });

    it('should have lucky directions for all animals', () => {
      Object.values(ANIMAL_METADATA).forEach(metadata => {
        expect(metadata.luckyDirections).toBeDefined();
        expect(metadata.luckyDirections.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Element Metadata', () => {
    it('should have metadata for all 5 elements', () => {
      expect(Object.keys(ELEMENT_METADATA).length).toBe(5);
    });

    it('should have Thai names for all elements', () => {
      Object.values(ELEMENT_METADATA).forEach(metadata => {
        expect(metadata.thaiName).toBeTruthy();
        expect(metadata.thaiName.length).toBeGreaterThan(0);
      });
    });

    it('should have Chinese names for all elements', () => {
      Object.values(ELEMENT_METADATA).forEach(metadata => {
        expect(metadata.chineseName).toBeTruthy();
        expect(metadata.chineseName.length).toBeGreaterThan(0);
      });
    });

    it('should have colors for all elements', () => {
      Object.values(ELEMENT_METADATA).forEach(metadata => {
        expect(metadata.colors).toBeDefined();
        expect(metadata.colors.length).toBeGreaterThan(0);
      });
    });

    it('should have characteristics for all elements', () => {
      Object.values(ELEMENT_METADATA).forEach(metadata => {
        expect(metadata.characteristics).toBeDefined();
        expect(metadata.characteristics.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Helper Functions', () => {
    it('should get animal metadata', () => {
      const metadata = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
      expect(metadata.animal).toBe(ChineseZodiacAnimal.DRAGON);
      expect(metadata.thaiName).toBe('ปีมะโรง');
    });

    it('should get element metadata', () => {
      const metadata = getElementMetadata(ChineseElement.WOOD);
      expect(metadata.element).toBe(ChineseElement.WOOD);
      expect(metadata.thaiName).toBe('ไม้');
    });

    it('should get animal Thai name', () => {
      expect(getAnimalThaiName(ChineseZodiacAnimal.RAT)).toBe('ปีชวด');
      expect(getAnimalThaiName(ChineseZodiacAnimal.DRAGON)).toBe('ปีมะโรง');
    });

    it('should get animal Chinese name', () => {
      expect(getAnimalChineseName(ChineseZodiacAnimal.RAT)).toContain('鼠');
      expect(getAnimalChineseName(ChineseZodiacAnimal.DRAGON)).toContain('龍');
    });

    it('should get element Thai name', () => {
      expect(getElementThaiName(ChineseElement.WOOD)).toBe('ไม้');
      expect(getElementThaiName(ChineseElement.FIRE)).toBe('ไฟ');
    });

    it('should get element Chinese name', () => {
      expect(getElementChineseName(ChineseElement.WOOD)).toContain('木');
      expect(getElementChineseName(ChineseElement.FIRE)).toContain('火');
    });

    it('should get all animals', () => {
      const animals = getAllAnimals();
      expect(animals.length).toBe(12);
    });

    it('should get all elements', () => {
      const elements = getAllElements();
      expect(elements.length).toBe(5);
    });
  });

  describe('Combined Animal and Element', () => {
    it('should calculate both animal and element for a year', () => {
      const year = 2024;
      const animal = calculateChineseZodiac(year);
      const element = calculateChineseElement(year);
      
      expect(animal).toBe(ChineseZodiacAnimal.DRAGON);
      expect(element).toBe(ChineseElement.WOOD);
    });

    it('should produce 60-year cycle combinations', () => {
      // The Chinese zodiac has a 60-year cycle (12 animals × 5 elements)
      const combinations = new Set<string>();
      
      for (let year = 2024; year < 2024 + 60; year++) {
        const animal = calculateChineseZodiac(year);
        const element = calculateChineseElement(year);
        combinations.add(`${element}-${animal}`);
      }
      
      // Should have 60 unique combinations
      expect(combinations.size).toBe(60);
    });
  });
});
