// Property-based tests for library storage
// Feature: popular-fortune-features

import { describe, it, expect, beforeEach } from 'vitest';
import {
  upsertReading,
  removeReading,
  loadLibrary,
  clearLibrary,
  toLibraryEntry,
  buildSavedHoroscopeReading,
  buildSavedCompatibilityReading,
  buildSavedChineseZodiacReading
} from './storage';
import type { SavedReading, SavedTarotReading, HoroscopeData, CompatibilityData } from './types';
import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '../chinese-zodiac/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', { value: { localStorage: localStorageMock } });

// Helper to create mock readings
function createMockTarotReading(id: string, timestamp: Date): SavedTarotReading {
  return {
    id,
    kind: 'tarot',
    createdAt: timestamp.toISOString(),
    count: 1,
    cardsToken: `token-${id}`,
    version: 1
  };
}

function createMockHoroscopeReading(id: string, timestamp: Date): HoroscopeData {
  return {
    id,
    type: 'horoscope',
    zodiacSign: ZodiacSign.ARIES,
    period: TimePeriod.DAILY,
    dateRange: { start: timestamp.toISOString().split('T')[0], end: timestamp.toISOString().split('T')[0] },
    aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
    luckyNumbers: [1, 2, 3],
    luckyColors: ['red'],
    advice: 'advice',
    aiEnhanced: false,
    createdAt: timestamp.toISOString()
  };
}

describe('Library Storage - Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearLibrary();
  });

  // Feature: popular-fortune-features, Property 4: Reading History Persistence
  describe('Property 4: Reading History Persistence', () => {
    it('should persist completed readings and remain retrievable', () => {
      // Test with multiple iterations
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        localStorageMock.clear();
        clearLibrary();
        
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, (i % 28) + 1);
        const reading = createMockTarotReading(readingId, timestamp);
        
        // Add reading
        upsertReading(reading);
        
        // Verify it appears in history
        const library = loadLibrary();
        const found = library.items.find(r => r.id === readingId);
        
        expect(found).toBeDefined();
        expect(found?.id).toBe(readingId);
        expect(found?.createdAt).toBe(timestamp.toISOString());
      }
    });

    it('should keep readings retrievable until explicitly deleted', () => {
      const iterations = 50;
      const readings: SavedReading[] = [];
      
      // Add multiple readings
      for (let i = 0; i < iterations; i++) {
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, i + 1);
        const reading = createMockTarotReading(readingId, timestamp);
        readings.push(reading);
        upsertReading(reading);
      }
      
      // Verify all are retrievable
      const library = loadLibrary();
      expect(library.items.length).toBe(iterations);
      
      readings.forEach(reading => {
        const found = library.items.find(r => r.id === reading.id);
        expect(found).toBeDefined();
      });
    });

    it('should maintain reading data integrity across storage operations', () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        const zodiacSigns = Object.values(ZodiacSign);
        const periods = Object.values(TimePeriod);
        
        const reading = buildSavedHoroscopeReading({
          type: 'horoscope',
          zodiacSign: zodiacSigns[i % zodiacSigns.length],
          period: periods[i % periods.length],
          dateRange: { start: '2024-01-01', end: '2024-01-01' },
          aspects: { 
            love: `love-${i}`, 
            career: `career-${i}`, 
            finance: `finance-${i}`, 
            health: `health-${i}` 
          },
          luckyNumbers: [i, i + 1, i + 2],
          luckyColors: [`color-${i}`],
          advice: `advice-${i}`,
          aiEnhanced: i % 2 === 0
        });
        
        upsertReading(reading);
        
        const library = loadLibrary();
        const retrieved = library.items.find(r => r.id === reading.id) as HoroscopeData;
        
        expect(retrieved).toBeDefined();
        expect(retrieved.zodiacSign).toBe(reading.zodiacSign);
        expect(retrieved.period).toBe(reading.period);
        expect(retrieved.aspects.love).toBe(reading.aspects.love);
        expect(retrieved.luckyNumbers).toEqual(reading.luckyNumbers);
        expect(retrieved.aiEnhanced).toBe(reading.aiEnhanced);
      }
    });
  });

  // Feature: popular-fortune-features, Property 18: Reading History Size Limit
  describe('Property 18: Reading History Size Limit', () => {
    it('should never exceed 50 entries', () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, i + 1);
        const reading = createMockTarotReading(readingId, timestamp);
        
        upsertReading(reading);
        
        const library = loadLibrary();
        expect(library.items.length).toBeLessThanOrEqual(50);
      }
    });

    it('should remove oldest entry when adding 51st reading', () => {
      // Add 50 readings
      const readings: SavedReading[] = [];
      for (let i = 0; i < 50; i++) {
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, i + 1);
        const reading = createMockTarotReading(readingId, timestamp);
        readings.push(reading);
        upsertReading(reading);
      }
      
      // Verify we have 50
      let library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Add 51st reading
      const newReading = createMockTarotReading('reading-50', new Date(2024, 0, 51));
      upsertReading(newReading);
      
      // Verify still 50 entries
      library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Verify oldest (reading-0) is removed
      const hasOldest = library.items.some(r => r.id === 'reading-0');
      expect(hasOldest).toBe(false);
      
      // Verify newest is present
      const hasNewest = library.items.some(r => r.id === 'reading-50');
      expect(hasNewest).toBe(true);
    });

    it('should preserve favorites when at limit', () => {
      // Mock favorites storage
      const favoritesKey = 'reffortune.library.favorites';
      const favorites = new Set(['reading-0', 'reading-1', 'reading-2']);
      localStorageMock.setItem(favoritesKey, JSON.stringify([...favorites]));
      
      // Add 50 readings (first 3 are favorites)
      for (let i = 0; i < 50; i++) {
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, i + 1);
        const reading = createMockTarotReading(readingId, timestamp);
        upsertReading(reading);
      }
      
      // Add 51st reading
      const newReading = createMockTarotReading('reading-50', new Date(2024, 0, 51));
      upsertReading(newReading);
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Verify favorites are still present
      favorites.forEach(favId => {
        const found = library.items.some(r => r.id === favId);
        expect(found).toBe(true);
      });
    });

    it('should handle various reading types at limit', () => {
      const readingTypes = ['tarot', 'horoscope', 'compatibility', 'chinese_zodiac'];
      
      // Add 52 readings of mixed types
      for (let i = 0; i < 52; i++) {
        const readingId = `reading-${i}`;
        const timestamp = new Date(2024, 0, i + 1);
        
        let reading: SavedReading;
        const typeIndex = i % readingTypes.length;
        
        if (typeIndex === 0) {
          reading = createMockTarotReading(readingId, timestamp);
        } else if (typeIndex === 1) {
          reading = createMockHoroscopeReading(readingId, timestamp);
        } else if (typeIndex === 2) {
          reading = buildSavedCompatibilityReading({
            type: 'compatibility',
            person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
            person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
            scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
            strengths: ['strength'],
            challenges: ['challenge'],
            advice: 'advice',
            elementCompatibility: 'Fire + Earth',
            aiEnhanced: false
          });
        } else {
          reading = buildSavedChineseZodiacReading({
            type: 'chinese_zodiac',
            animal: ChineseZodiacAnimal.DRAGON,
            element: ChineseElement.WOOD,
            period: TimePeriod.DAILY,
            dateRange: { start: '2024-01-01', end: '2024-01-01' },
            fortune: { overall: 'good', career: 'career', wealth: 'wealth', health: 'health', relationships: 'relationships' },
            luckyColors: ['green'],
            luckyNumbers: [3, 8],
            luckyDirections: ['East'],
            advice: 'advice',
            aiEnhanced: false
          });
        }
        
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
    });
  });

  // Feature: popular-fortune-features, Property 20: Reading Deletion Completeness
  describe('Property 20: Reading Deletion Completeness', () => {
    it('should remove reading and decrease count by one', () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        localStorageMock.clear();
        clearLibrary();
        
        // Add multiple readings
        const count = (i % 20) + 5; // 5 to 24 readings
        const readingIds: string[] = [];
        
        for (let j = 0; j < count; j++) {
          const readingId = `reading-${j}`;
          readingIds.push(readingId);
          const timestamp = new Date(2024, 0, j + 1);
          const reading = createMockTarotReading(readingId, timestamp);
          upsertReading(reading);
        }
        
        const beforeLibrary = loadLibrary();
        const beforeCount = beforeLibrary.items.length;
        expect(beforeCount).toBe(count);
        
        // Delete a random reading
        const deleteIndex = i % count;
        const deleteId = readingIds[deleteIndex];
        removeReading(deleteId);
        
        const afterLibrary = loadLibrary();
        const afterCount = afterLibrary.items.length;
        
        // Verify count decreased by one
        expect(afterCount).toBe(beforeCount - 1);
        
        // Verify deleted reading is not present
        const found = afterLibrary.items.find(r => r.id === deleteId);
        expect(found).toBeUndefined();
      }
    });

    it('should handle deletion of non-existent reading gracefully', () => {
      // Add some readings
      for (let i = 0; i < 10; i++) {
        const reading = createMockTarotReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const beforeLibrary = loadLibrary();
      const beforeCount = beforeLibrary.items.length;
      
      // Try to delete non-existent reading
      removeReading('non-existent-id');
      
      const afterLibrary = loadLibrary();
      const afterCount = afterLibrary.items.length;
      
      // Count should remain the same
      expect(afterCount).toBe(beforeCount);
    });

    it('should handle multiple deletions correctly', () => {
      // Add 30 readings
      const readingIds: string[] = [];
      for (let i = 0; i < 30; i++) {
        const readingId = `reading-${i}`;
        readingIds.push(readingId);
        const reading = createMockTarotReading(readingId, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      let library = loadLibrary();
      expect(library.items.length).toBe(30);
      
      // Delete 10 readings
      for (let i = 0; i < 10; i++) {
        removeReading(readingIds[i]);
        
        library = loadLibrary();
        expect(library.items.length).toBe(30 - i - 1);
        
        // Verify deleted reading is not present
        const found = library.items.find(r => r.id === readingIds[i]);
        expect(found).toBeUndefined();
      }
      
      // Final count should be 20
      library = loadLibrary();
      expect(library.items.length).toBe(20);
    });
  });
});
