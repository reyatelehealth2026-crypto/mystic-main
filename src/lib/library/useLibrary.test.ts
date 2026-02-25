import { describe, it, expect, beforeEach } from 'vitest';
import type { SavedTarotReading, HoroscopeData, CompatibilityData } from './types';
import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ReadingType } from '../reading/types';
import { 
  loadLibrary, 
  upsertReading, 
  removeReading, 
  clearLibrary,
  toLibraryEntry 
} from './storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('useLibrary Hook - Storage Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should support filtering by reading type', () => {
    // Add multiple reading types
    const tarot: SavedTarotReading = {
      id: 'tarot-1',
      kind: 'tarot',
      createdAt: new Date().toISOString(),
      count: 1,
      cardsToken: 'abc',
      version: 1
    };

    const horoscope: HoroscopeData = {
      id: 'horoscope-1',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
      luckyNumbers: [1],
      luckyColors: ['red'],
      advice: 'advice',
      aiEnhanced: false,
      createdAt: new Date().toISOString()
    };

    upsertReading(tarot);
    upsertReading(horoscope);

    const library = loadLibrary();
    const entries = library.items.map(item => toLibraryEntry(item, false));

    expect(entries.length).toBe(2);

    // Filter by horoscope
    const horoscopeEntries = entries.filter(e => e.type === ReadingType.HOROSCOPE);
    expect(horoscopeEntries.length).toBe(1);
    expect(horoscopeEntries[0].type).toBe(ReadingType.HOROSCOPE);

    // Filter by tarot
    const tarotEntries = entries.filter(e => e.type === ReadingType.TAROT);
    expect(tarotEntries.length).toBe(1);
    expect(tarotEntries[0].type).toBe(ReadingType.TAROT);
  });

  it('should support deleting readings', () => {
    const tarot: SavedTarotReading = {
      id: 'tarot-1',
      kind: 'tarot',
      createdAt: new Date().toISOString(),
      count: 1,
      cardsToken: 'abc',
      version: 1
    };

    upsertReading(tarot);
    let library = loadLibrary();
    expect(library.items.length).toBe(1);

    removeReading('tarot-1');
    library = loadLibrary();
    expect(library.items.length).toBe(0);
  });

  it('should support clearing all readings', () => {
    const tarot: SavedTarotReading = {
      id: 'tarot-1',
      kind: 'tarot',
      createdAt: new Date().toISOString(),
      count: 1,
      cardsToken: 'abc',
      version: 1
    };

    const horoscope: HoroscopeData = {
      id: 'horoscope-1',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
      luckyNumbers: [1],
      luckyColors: ['red'],
      advice: 'advice',
      aiEnhanced: false,
      createdAt: new Date().toISOString()
    };

    upsertReading(tarot);
    upsertReading(horoscope);

    let library = loadLibrary();
    expect(library.items.length).toBe(2);

    clearLibrary();
    library = loadLibrary();
    expect(library.items.length).toBe(0);
  });

  it('should convert all reading types to LibraryEntry format', () => {
    const tarot: SavedTarotReading = {
      id: 'tarot-1',
      kind: 'tarot',
      createdAt: new Date().toISOString(),
      count: 1,
      cardsToken: 'abc',
      aiSummary: 'Tarot summary',
      version: 1
    };

    const horoscope: HoroscopeData = {
      id: 'horoscope-1',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: { love: 'Love aspect', career: 'career', finance: 'finance', health: 'health' },
      luckyNumbers: [1],
      luckyColors: ['red'],
      advice: 'advice',
      aiEnhanced: false,
      createdAt: new Date().toISOString()
    };

    const compatibility: CompatibilityData = {
      id: 'compatibility-1',
      type: 'compatibility',
      person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
      person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
      scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
      strengths: ['strength1'],
      challenges: ['challenge1'],
      advice: 'Compatibility advice',
      elementCompatibility: 'Fire + Earth',
      aiEnhanced: false,
      createdAt: new Date().toISOString()
    };

    const tarotEntry = toLibraryEntry(tarot, false);
    expect(tarotEntry.type).toBe(ReadingType.TAROT);
    expect(tarotEntry.preview).toBe('Tarot summary');
    expect(tarotEntry.favorite).toBe(false);

    const horoscopeEntry = toLibraryEntry(horoscope, true);
    expect(horoscopeEntry.type).toBe(ReadingType.HOROSCOPE);
    expect(horoscopeEntry.preview).toBe('Love aspect');
    expect(horoscopeEntry.favorite).toBe(true);

    const compatibilityEntry = toLibraryEntry(compatibility, false);
    expect(compatibilityEntry.type).toBe(ReadingType.COMPATIBILITY);
    expect(compatibilityEntry.preview).toBe('Compatibility advice');
  });

  it('should support favorite flag in LibraryEntry', () => {
    const tarot: SavedTarotReading = {
      id: 'tarot-1',
      kind: 'tarot',
      createdAt: new Date().toISOString(),
      count: 1,
      cardsToken: 'abc',
      version: 1
    };

    const entryNotFavorite = toLibraryEntry(tarot, false);
    expect(entryNotFavorite.favorite).toBe(false);

    const entryFavorite = toLibraryEntry(tarot, true);
    expect(entryFavorite.favorite).toBe(true);
  });

  it('should handle mixed reading types in library', () => {
    const readings = [
      {
        id: 'tarot-1',
        kind: 'tarot' as const,
        createdAt: new Date(2024, 0, 1).toISOString(),
        count: 1,
        cardsToken: 'abc',
        version: 1 as const
      },
      {
        id: 'horoscope-1',
        type: 'horoscope' as const,
        zodiacSign: ZodiacSign.ARIES,
        period: TimePeriod.DAILY,
        dateRange: { start: '2024-01-02', end: '2024-01-02' },
        aspects: { love: 'love', career: 'career', finance: 'finance', health: 'health' },
        luckyNumbers: [1],
        luckyColors: ['red'],
        advice: 'advice',
        aiEnhanced: false,
        createdAt: new Date(2024, 0, 2).toISOString()
      },
      {
        id: 'compatibility-1',
        type: 'compatibility' as const,
        person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
        person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
        scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
        strengths: ['strength1'],
        challenges: ['challenge1'],
        advice: 'advice',
        elementCompatibility: 'Fire + Earth',
        aiEnhanced: false,
        createdAt: new Date(2024, 0, 3).toISOString()
      }
    ];

    readings.forEach(reading => upsertReading(reading as any));

    const library = loadLibrary();
    expect(library.items.length).toBe(3);

    const entries = library.items.map(item => toLibraryEntry(item, false));
    
    const types = entries.map(e => e.type);
    expect(types).toContain(ReadingType.TAROT);
    expect(types).toContain(ReadingType.HOROSCOPE);
    expect(types).toContain(ReadingType.COMPATIBILITY);
  });
});
