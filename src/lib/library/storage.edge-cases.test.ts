// Unit tests for library storage edge cases
// Feature: popular-fortune-features
// Focus: Favorite handling and edge cases

import { describe, it, expect, beforeEach } from 'vitest';
import {
  upsertReading,
  loadLibrary,
  clearLibrary
} from './storage';
import type { SavedTarotReading } from './types';

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

// Helper to create mock reading
function createMockReading(id: string, timestamp: Date): SavedTarotReading {
  return {
    id,
    kind: 'tarot',
    createdAt: timestamp.toISOString(),
    count: 1,
    cardsToken: `token-${id}`,
    version: 1
  };
}

// Helper to set favorites
function setFavorites(favoriteIds: string[]) {
  const favoritesKey = 'reffortune.library.favorites';
  localStorageMock.setItem(favoritesKey, JSON.stringify(favoriteIds));
}

describe('Library Storage - Edge Cases', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearLibrary();
  });

  describe('Favorite readings preservation at limit', () => {
    it('should not remove favorite readings when at 50-entry limit', () => {
      // Mark first 5 readings as favorites
      const favoriteIds = ['reading-0', 'reading-1', 'reading-2', 'reading-3', 'reading-4'];
      setFavorites(favoriteIds);
      
      // Add 50 readings
      for (let i = 0; i < 50; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      let library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Add 51st reading
      const newReading = createMockReading('reading-50', new Date(2024, 0, 51));
      upsertReading(newReading);
      
      library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Verify all favorites are still present
      favoriteIds.forEach(favId => {
        const found = library.items.find(r => r.id === favId);
        expect(found).toBeDefined();
        expect(found?.id).toBe(favId);
      });
    });

    it('should remove oldest non-favorite reading first', () => {
      // Mark readings 10-14 as favorites (not the oldest)
      const favoriteIds = ['reading-10', 'reading-11', 'reading-12', 'reading-13', 'reading-14'];
      setFavorites(favoriteIds);
      
      // Add 50 readings
      for (let i = 0; i < 50; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      let library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Add 51st reading
      const newReading = createMockReading('reading-50', new Date(2024, 0, 51));
      upsertReading(newReading);
      
      library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Oldest non-favorite (reading-0) should be removed
      const hasOldest = library.items.find(r => r.id === 'reading-0');
      expect(hasOldest).toBeUndefined();
      
      // Favorites should still be present
      favoriteIds.forEach(favId => {
        const found = library.items.find(r => r.id === favId);
        expect(found).toBeDefined();
      });
      
      // Newest should be present
      const hasNewest = library.items.find(r => r.id === 'reading-50');
      expect(hasNewest).toBeDefined();
    });

    it('should handle case where all 50 entries are favorites', () => {
      // Add 50 readings and mark all as favorites
      const favoriteIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const id = `reading-${i}`;
        favoriteIds.push(id);
        const reading = createMockReading(id, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      setFavorites(favoriteIds);
      
      let library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Add 51st reading (not a favorite)
      const newReading = createMockReading('reading-50', new Date(2024, 0, 51));
      upsertReading(newReading);
      
      library = loadLibrary();
      
      // Should still have 50 entries (all favorites preserved)
      expect(library.items.length).toBe(50);
      
      // All original favorites should still be present
      favoriteIds.forEach(favId => {
        const found = library.items.find(r => r.id === favId);
        expect(found).toBeDefined();
      });
      
      // New reading should not be added since all slots are taken by favorites
      const hasNew = library.items.find(r => r.id === 'reading-50');
      expect(hasNew).toBeUndefined();
    });

    it('should handle mixed favorites and non-favorites correctly', () => {
      // Mark every 5th reading as favorite
      const favoriteIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const id = `reading-${i}`;
        if (i % 5 === 0) {
          favoriteIds.push(id);
        }
        const reading = createMockReading(id, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      setFavorites(favoriteIds);
      
      let library = loadLibrary();
      expect(library.items.length).toBe(50);
      expect(favoriteIds.length).toBe(10); // 10 favorites
      
      // Add 5 more readings
      for (let i = 50; i < 55; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // All favorites should still be present
      favoriteIds.forEach(favId => {
        const found = library.items.find(r => r.id === favId);
        expect(found).toBeDefined();
      });
      
      // Oldest non-favorites should be removed
      // reading-1, reading-2, reading-3, reading-4 should be gone
      expect(library.items.find(r => r.id === 'reading-1')).toBeUndefined();
      expect(library.items.find(r => r.id === 'reading-2')).toBeUndefined();
      expect(library.items.find(r => r.id === 'reading-3')).toBeUndefined();
      expect(library.items.find(r => r.id === 'reading-4')).toBeUndefined();
      
      // Newest readings should be present
      expect(library.items.find(r => r.id === 'reading-54')).toBeDefined();
    });

    it('should preserve favorites even when they are the oldest', () => {
      // Mark the 3 oldest readings as favorites
      const favoriteIds = ['reading-0', 'reading-1', 'reading-2'];
      setFavorites(favoriteIds);
      
      // Add 50 readings
      for (let i = 0; i < 50; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      // Add 10 more readings
      for (let i = 50; i < 60; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // The 3 oldest favorites should still be present
      favoriteIds.forEach(favId => {
        const found = library.items.find(r => r.id === favId);
        expect(found).toBeDefined();
      });
      
      // Non-favorite old readings should be removed
      // reading-3 through reading-12 should be gone (10 removed)
      for (let i = 3; i < 13; i++) {
        expect(library.items.find(r => r.id === `reading-${i}`)).toBeUndefined();
      }
    });
  });

  describe('Edge cases with empty library', () => {
    it('should handle adding first reading correctly', () => {
      const reading = createMockReading('first-reading', new Date(2024, 0, 1));
      upsertReading(reading);
      
      const library = loadLibrary();
      expect(library.items.length).toBe(1);
      expect(library.items[0].id).toBe('first-reading');
    });

    it('should handle loading empty library', () => {
      const library = loadLibrary();
      expect(library.items).toEqual([]);
      expect(library.items.length).toBe(0);
    });
  });

  describe('Edge cases with timestamps', () => {
    it('should handle readings with same timestamp', () => {
      const timestamp = new Date(2024, 0, 15);
      
      // Add multiple readings with same timestamp
      for (let i = 0; i < 10; i++) {
        const reading = createMockReading(`reading-${i}`, timestamp);
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(10);
    });

    it('should handle readings added in reverse chronological order', () => {
      // Add readings from newest to oldest
      for (let i = 49; i >= 0; i--) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // All readings should be present
      for (let i = 0; i < 50; i++) {
        const found = library.items.find(r => r.id === `reading-${i}`);
        expect(found).toBeDefined();
      }
    });
  });

  describe('Edge cases with favorites storage', () => {
    it('should handle corrupted favorites data gracefully', () => {
      // Set invalid JSON in favorites
      localStorageMock.setItem('reffortune.library.favorites', 'invalid-json{');
      
      // Add 51 readings
      for (let i = 0; i < 51; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Should still work, treating all as non-favorites
      // Oldest should be removed
      expect(library.items.find(r => r.id === 'reading-0')).toBeUndefined();
    });

    it('should handle empty favorites array', () => {
      setFavorites([]);
      
      // Add 51 readings
      for (let i = 0; i < 51; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // Oldest should be removed
      expect(library.items.find(r => r.id === 'reading-0')).toBeUndefined();
    });

    it('should handle favorites that do not exist in library', () => {
      // Set favorites for readings that don't exist
      setFavorites(['non-existent-1', 'non-existent-2', 'reading-5']);
      
      // Add 51 readings
      for (let i = 0; i < 51; i++) {
        const reading = createMockReading(`reading-${i}`, new Date(2024, 0, i + 1));
        upsertReading(reading);
      }
      
      const library = loadLibrary();
      expect(library.items.length).toBe(50);
      
      // reading-5 should be preserved
      expect(library.items.find(r => r.id === 'reading-5')).toBeDefined();
      
      // Oldest non-favorite should be removed
      expect(library.items.find(r => r.id === 'reading-0')).toBeUndefined();
    });
  });
});
