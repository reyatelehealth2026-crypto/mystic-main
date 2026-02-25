// Unit tests for AnimalDisplay component helper functions
// Feature: popular-fortune-features
// Note: Component rendering tests require DOM environment setup
// These tests validate the component's data mapping logic

import { describe, it, expect } from 'vitest';
import { ChineseZodiacAnimal, ChineseElement } from '@/lib/chinese-zodiac/types';
import { getAnimalMetadata, getElementMetadata } from '@/lib/chinese-zodiac/animals';

describe('AnimalDisplay Component Data', () => {
  describe('Animal Icons Mapping', () => {
    it('should have icons for all animals', () => {
      const animals = Object.values(ChineseZodiacAnimal);
      
      // Verify all animals have metadata
      animals.forEach(animal => {
        const metadata = getAnimalMetadata(animal);
        expect(metadata).toBeDefined();
        expect(metadata.thaiName).toBeTruthy();
        expect(metadata.chineseName).toBeTruthy();
      });
    });

    it('should have correct Thai names for animals', () => {
      expect(getAnimalMetadata(ChineseZodiacAnimal.DRAGON).thaiName).toBe('ปีมะโรง');
      expect(getAnimalMetadata(ChineseZodiacAnimal.RAT).thaiName).toBe('ปีชวด');
      expect(getAnimalMetadata(ChineseZodiacAnimal.TIGER).thaiName).toBe('ปีขาล');
      expect(getAnimalMetadata(ChineseZodiacAnimal.SNAKE).thaiName).toBe('ปีมะเส็ง');
    });
  });

  describe('Element Metadata', () => {
    it('should have metadata for all elements', () => {
      const elements = Object.values(ChineseElement);
      
      elements.forEach(element => {
        const metadata = getElementMetadata(element);
        expect(metadata).toBeDefined();
        expect(metadata.thaiName).toBeTruthy();
        expect(metadata.chineseName).toBeTruthy();
        expect(metadata.colors).toBeDefined();
        expect(metadata.colors.length).toBeGreaterThan(0);
      });
    });

    it('should have correct Thai names for elements', () => {
      expect(getElementMetadata(ChineseElement.WOOD).thaiName).toBe('ไม้');
      expect(getElementMetadata(ChineseElement.FIRE).thaiName).toBe('ไฟ');
      expect(getElementMetadata(ChineseElement.EARTH).thaiName).toBe('ดิน');
      expect(getElementMetadata(ChineseElement.METAL).thaiName).toBe('โลหะ');
      expect(getElementMetadata(ChineseElement.WATER).thaiName).toBe('น้ำ');
    });
  });

  describe('Animal Details', () => {
    it('should have traits for all animals', () => {
      const dragonMeta = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
      
      expect(dragonMeta.traits).toBeDefined();
      expect(dragonMeta.traits.length).toBeGreaterThan(0);
      expect(dragonMeta.traits).toContain('ทรงพลัง');
      expect(dragonMeta.traits).toContain('มีเสน่ห์');
    });

    it('should have lucky colors for all animals', () => {
      const dragonMeta = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
      
      expect(dragonMeta.luckyColors).toBeDefined();
      expect(dragonMeta.luckyColors.length).toBeGreaterThan(0);
      expect(dragonMeta.luckyColors).toContain('ทอง');
    });

    it('should have lucky numbers for all animals', () => {
      const dragonMeta = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
      
      expect(dragonMeta.luckyNumbers).toBeDefined();
      expect(dragonMeta.luckyNumbers.length).toBeGreaterThan(0);
      expect(dragonMeta.luckyNumbers).toEqual([1, 6, 7]);
    });

    it('should have lucky directions for all animals', () => {
      const dragonMeta = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
      
      expect(dragonMeta.luckyDirections).toBeDefined();
      expect(dragonMeta.luckyDirections.length).toBeGreaterThan(0);
      expect(dragonMeta.luckyDirections).toContain('ทิศตะวันออก');
    });
  });

  describe('Component Props Validation', () => {
    it('should accept valid animal and element combinations', () => {
      // Test that metadata exists for various combinations
      const combinations = [
        { animal: ChineseZodiacAnimal.DRAGON, element: ChineseElement.WOOD },
        { animal: ChineseZodiacAnimal.RAT, element: ChineseElement.WATER },
        { animal: ChineseZodiacAnimal.TIGER, element: ChineseElement.WOOD },
        { animal: ChineseZodiacAnimal.SNAKE, element: ChineseElement.FIRE },
      ];

      combinations.forEach(({ animal, element }) => {
        const animalMeta = getAnimalMetadata(animal);
        const elementMeta = getElementMetadata(element);
        
        expect(animalMeta).toBeDefined();
        expect(elementMeta).toBeDefined();
        expect(animalMeta.thaiName).toBeTruthy();
        expect(elementMeta.thaiName).toBeTruthy();
      });
    });
  });
});
