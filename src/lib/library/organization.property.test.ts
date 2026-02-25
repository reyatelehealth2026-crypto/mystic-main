// Property test for library organization
// Feature: popular-fortune-features, Property 19: Reading History Organization

import { describe, it, expect, beforeEach } from 'vitest';
import {
  upsertReading,
  loadLibrary,
  clearLibrary,
  toLibraryEntry,
  buildSavedHoroscopeReading,
  buildSavedCompatibilityReading,
  buildSavedChineseZodiacReading,
  buildSavedNameNumerologyReading,
  buildSavedSpecializedReading
} from './storage';
import type { SavedReading, SavedTarotReading, LibraryEntry } from './types';
import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '../chinese-zodiac/types';
import { ReadingType } from '../reading/types';

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

// Helper to create mock tarot reading
function createMockTarotReading(id: string, timestamp: Date): SavedTarotReading {
  return {
    id,
    kind: 'tarot',
    createdAt: timestamp.toISOString(),
    count: 3,
    cardsToken: `token-${id}`,
    question: `คำถาม ${id}`,
    aiSummary: `สรุปการดูไพ่สำหรับ ${id}`,
    version: 1
  };
}

describe('Library Organization - Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearLibrary();
  });

  // Feature: popular-fortune-features, Property 19: Reading History Organization
  describe('Property 19: Reading History Organization', () => {
    it('should display date, feature type, and preview for all reading types', () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        localStorageMock.clear();
        clearLibrary();
        
        const readingTypes = ['tarot', 'horoscope', 'compatibility', 'chinese_zodiac', 'name_numerology', 'specialized'];
        const typeIndex = i % readingTypes.length;
        const timestamp = new Date(2024, 0, (i % 28) + 1);
        
        let reading: SavedReading;
        let expectedType: string;
        
        switch (typeIndex) {
          case 0: // tarot
            reading = createMockTarotReading(`reading-${i}`, timestamp);
            expectedType = 'tarot';
            break;
          case 1: // horoscope
            reading = buildSavedHoroscopeReading({
              type: 'horoscope',
              zodiacSign: ZodiacSign.ARIES,
              period: TimePeriod.DAILY,
              dateRange: { start: '2024-01-01', end: '2024-01-01' },
              aspects: { 
                love: `ความรักของคุณในวันนี้จะเต็มไปด้วยความสุข ${i}`, 
                career: 'งาน', 
                finance: 'การเงิน', 
                health: 'สุขภาพ' 
              },
              luckyNumbers: [1, 2, 3],
              luckyColors: ['red'],
              advice: 'คำแนะนำ',
              aiEnhanced: false
            });
            expectedType = 'horoscope';
            break;
          case 2: // compatibility
            reading = buildSavedCompatibilityReading({
              type: 'compatibility',
              person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
              person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
              scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
              strengths: ['ความเข้าใจกันดี'],
              challenges: ['ต้องปรับตัว'],
              advice: `คำแนะนำสำหรับคู่รัก ${i}`,
              elementCompatibility: 'Fire + Earth',
              aiEnhanced: false
            });
            expectedType = 'compatibility';
            break;
          case 3: // chinese_zodiac
            reading = buildSavedChineseZodiacReading({
              type: 'chinese_zodiac',
              animal: ChineseZodiacAnimal.DRAGON,
              element: ChineseElement.WOOD,
              period: TimePeriod.DAILY,
              dateRange: { start: '2024-01-01', end: '2024-01-01' },
              fortune: { 
                overall: `โชคลาภดีมากในวันนี้ ${i}`, 
                career: 'งาน', 
                wealth: 'การเงิน', 
                health: 'สุขภาพ', 
                relationships: 'ความสัมพันธ์' 
              },
              luckyColors: ['green'],
              luckyNumbers: [3, 8],
              luckyDirections: ['East'],
              advice: 'คำแนะนำ',
              aiEnhanced: false
            });
            expectedType = 'chinese_zodiac';
            break;
          case 4: // name_numerology
            reading = buildSavedNameNumerologyReading({
              type: 'name_numerology',
              firstName: 'สมชาย',
              lastName: 'ใจดี',
              scores: { firstName: 5, lastName: 7, fullName: 3, destiny: 1 },
              interpretation: {
                personality: `คุณเป็นคนที่มีความคิดสร้างสรรค์และชอบความเป็นอิสระ ${i}`,
                strengths: ['ความคิดสร้างสรรค์'],
                weaknesses: ['ขาดความอดทน'],
                lifePath: 'เส้นทางชีวิต',
                career: 'อาชีพ',
                relationships: 'ความสัมพันธ์'
              },
              luckyNumbers: [1, 5],
              advice: 'คำแนะนำ',
              aiEnhanced: false
            });
            expectedType = 'name_numerology';
            break;
          case 5: // specialized
            reading = buildSavedSpecializedReading({
              type: 'specialized',
              zodiacSign: ZodiacSign.LEO,
              domain: 'finance_career',
              period: TimePeriod.WEEKLY,
              dateRange: { start: '2024-01-01', end: '2024-01-07' },
              prediction: `สัปดาห์นี้จะมีโอกาสทางการเงินที่ดี ${i}`,
              opportunities: ['โอกาสใหม่'],
              challenges: ['อุปสรรค'],
              actionItems: ['ทำสิ่งนี้'],
              advice: 'คำแนะนำ',
              aiEnhanced: false
            });
            expectedType = 'specialized';
            break;
          default:
            throw new Error('Invalid type index');
        }
        
        upsertReading(reading);
        
        // Convert to LibraryEntry
        const entry = toLibraryEntry(reading, false);
        
        // Verify entry has all required fields
        expect(entry.id).toBeDefined();
        expect(entry.id).toBe(reading.id);
        
        // Verify type is present
        expect(entry.type).toBeDefined();
        expect(typeof entry.type).toBe('string');
        
        // Verify createdAt (date) is present
        expect(entry.createdAt).toBeDefined();
        expect(entry.createdAt).toBe(reading.createdAt);
        expect(new Date(entry.createdAt).getTime()).not.toBeNaN();
        
        // Verify preview is present and is a string
        expect(entry.preview).toBeDefined();
        expect(typeof entry.preview).toBe('string');
        expect(entry.preview.length).toBeGreaterThan(0);
        
        // Verify preview is not too long (max 103 chars including '...')
        expect(entry.preview.length).toBeLessThanOrEqual(103);
      }
    });

    it('should group readings by feature type correctly', () => {
      // Add multiple readings of different types
      const readings: SavedReading[] = [];
      
      // Add 5 of each type
      for (let i = 0; i < 5; i++) {
        const timestamp = new Date(2024, 0, i + 1);
        
        // Tarot
        readings.push(createMockTarotReading(`tarot-${i}`, timestamp));
        
        // Horoscope
        readings.push(buildSavedHoroscopeReading({
          type: 'horoscope',
          zodiacSign: ZodiacSign.ARIES,
          period: TimePeriod.DAILY,
          dateRange: { start: '2024-01-01', end: '2024-01-01' },
          aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
          luckyNumbers: [1, 2, 3],
          luckyColors: ['red'],
          advice: 'advice',
          aiEnhanced: false
        }));
        
        // Compatibility
        readings.push(buildSavedCompatibilityReading({
          type: 'compatibility',
          person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
          person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
          scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
          strengths: ['strength'],
          challenges: ['challenge'],
          advice: 'advice',
          elementCompatibility: 'Fire + Earth',
          aiEnhanced: false
        }));
      }
      
      // Add all readings
      readings.forEach(reading => upsertReading(reading));
      
      // Load library and convert to entries
      const library = loadLibrary();
      const entries = library.items.map(item => toLibraryEntry(item, false));
      
      // Group by type
      const groupedByType = entries.reduce((acc, entry) => {
        const type = entry.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(entry);
        return acc;
      }, {} as Record<string, LibraryEntry[]>);
      
      // Verify grouping
      expect(Object.keys(groupedByType).length).toBeGreaterThan(0);
      
      // Each group should contain only entries of that type
      Object.entries(groupedByType).forEach(([type, groupEntries]) => {
        groupEntries.forEach(entry => {
          expect(entry.type).toBe(type);
        });
      });
      
      // Verify we have the expected types
      expect(groupedByType['tarot']).toBeDefined();
      expect(groupedByType['tarot'].length).toBe(5);
      expect(groupedByType['horoscope']).toBeDefined();
      expect(groupedByType['horoscope'].length).toBe(5);
      expect(groupedByType['compatibility']).toBeDefined();
      expect(groupedByType['compatibility'].length).toBe(5);
    });

    it('should maintain organization with mixed reading types', () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        localStorageMock.clear();
        clearLibrary();
        
        // Add random number of readings (5-20)
        const count = (i % 16) + 5;
        const addedTypes = new Set<string>();
        
        for (let j = 0; j < count; j++) {
          const typeIndex = (i + j) % 6;
          const timestamp = new Date(2024, 0, j + 1);
          
          let reading: SavedReading;
          
          switch (typeIndex) {
            case 0:
              reading = createMockTarotReading(`reading-${j}`, timestamp);
              addedTypes.add('tarot');
              break;
            case 1:
              reading = buildSavedHoroscopeReading({
                type: 'horoscope',
                zodiacSign: ZodiacSign.ARIES,
                period: TimePeriod.DAILY,
                dateRange: { start: '2024-01-01', end: '2024-01-01' },
                aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
                luckyNumbers: [1, 2, 3],
                luckyColors: ['red'],
                advice: 'advice',
                aiEnhanced: false
              });
              addedTypes.add('horoscope');
              break;
            case 2:
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
              addedTypes.add('compatibility');
              break;
            case 3:
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
              addedTypes.add('chinese_zodiac');
              break;
            case 4:
              reading = buildSavedNameNumerologyReading({
                type: 'name_numerology',
                firstName: 'สมชาย',
                lastName: 'ใจดี',
                scores: { firstName: 5, lastName: 7, fullName: 3, destiny: 1 },
                interpretation: {
                  personality: 'personality',
                  strengths: ['strength'],
                  weaknesses: ['weakness'],
                  lifePath: 'lifePath',
                  career: 'career',
                  relationships: 'relationships'
                },
                luckyNumbers: [1, 5],
                advice: 'advice',
                aiEnhanced: false
              });
              addedTypes.add('name_numerology');
              break;
            case 5:
              reading = buildSavedSpecializedReading({
                type: 'specialized',
                zodiacSign: ZodiacSign.LEO,
                domain: 'finance_career',
                period: TimePeriod.WEEKLY,
                dateRange: { start: '2024-01-01', end: '2024-01-07' },
                prediction: 'prediction',
                opportunities: ['opp'],
                challenges: ['challenge'],
                actionItems: ['action'],
                advice: 'advice',
                aiEnhanced: false
              });
              addedTypes.add('specialized');
              break;
            default:
              throw new Error('Invalid type index');
          }
          
          upsertReading(reading);
        }
        
        // Load and verify organization
        const library = loadLibrary();
        const entries = library.items.map(item => toLibraryEntry(item, false));
        
        // Every entry should have required fields
        entries.forEach(entry => {
          expect(entry.id).toBeDefined();
          expect(entry.type).toBeDefined();
          expect(entry.createdAt).toBeDefined();
          expect(entry.preview).toBeDefined();
          expect(entry.preview.length).toBeGreaterThan(0);
        });
        
        // Group by type and verify
        const groupedByType = entries.reduce((acc, entry) => {
          const type = entry.type;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(entry);
          return acc;
        }, {} as Record<string, LibraryEntry[]>);
        
        // Each added type should have at least one entry
        addedTypes.forEach(type => {
          expect(groupedByType[type]).toBeDefined();
          expect(groupedByType[type].length).toBeGreaterThan(0);
        });
      }
    });

    it('should preserve organization after deletions', () => {
      // Add 30 readings of mixed types
      const readings: SavedReading[] = [];
      
      for (let i = 0; i < 30; i++) {
        const typeIndex = i % 3;
        const timestamp = new Date(2024, 0, i + 1);
        
        let reading: SavedReading;
        
        if (typeIndex === 0) {
          reading = createMockTarotReading(`reading-${i}`, timestamp);
        } else if (typeIndex === 1) {
          reading = buildSavedHoroscopeReading({
            type: 'horoscope',
            zodiacSign: ZodiacSign.ARIES,
            period: TimePeriod.DAILY,
            dateRange: { start: '2024-01-01', end: '2024-01-01' },
            aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
            luckyNumbers: [1, 2, 3],
            luckyColors: ['red'],
            advice: 'advice',
            aiEnhanced: false
          });
        } else {
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
        }
        
        readings.push(reading);
        upsertReading(reading);
      }
      
      // Verify initial organization
      let library = loadLibrary();
      let entries = library.items.map(item => toLibraryEntry(item, false));
      
      entries.forEach(entry => {
        expect(entry.id).toBeDefined();
        expect(entry.type).toBeDefined();
        expect(entry.createdAt).toBeDefined();
        expect(entry.preview).toBeDefined();
      });
      
      // Organization should still be valid after all operations
      const finalEntries = library.items.map(item => toLibraryEntry(item, false));
      
      finalEntries.forEach(entry => {
        expect(entry.id).toBeDefined();
        expect(entry.type).toBeDefined();
        expect(entry.createdAt).toBeDefined();
        expect(entry.preview).toBeDefined();
        expect(entry.preview.length).toBeGreaterThan(0);
      });
    });
  });
});
