import { describe, it, expect, beforeEach } from 'vitest';
import {
  generatePreview,
  toLibraryEntry,
  buildSavedHoroscopeReading,
  buildSavedCompatibilityReading,
  buildSavedChineseZodiacReading,
  buildSavedNameNumerologyReading,
  buildSavedSpecializedReading,
  upsertReading,
  loadLibrary,
  clearLibrary
} from './storage';
import type { HoroscopeData, CompatibilityData, ChineseZodiacData, NameNumerologyData, SpecializedData, SavedTarotReading } from './types';
import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '../chinese-zodiac/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Library Storage - Preview Generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should generate preview from horoscope reading (first 100 chars)', () => {
    const horoscope: HoroscopeData = {
      id: 'test-1',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: {
        love: 'วันนี้ความรักของคุณจะเต็มไปด้วยความอบอุ่นและความเข้าใจ คนโสดอาจได้พบกับคนที่ใช่ในที่ที่ไม่คาดคิด',
        career: 'งานราชการ',
        finance: 'การเงิน',
        health: 'สุขภาพ'
      },
      luckyNumbers: [1, 2, 3],
      luckyColors: ['red'],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(horoscope);
    expect(preview.length).toBeLessThanOrEqual(103); // 100 + '...'
    expect(preview).toContain('วันนี้ความรักของคุณ');
  });

  it('should generate preview from compatibility reading', () => {
    const compatibility: CompatibilityData = {
      id: 'test-2',
      type: 'compatibility',
      person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
      person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
      scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
      strengths: ['ความเข้าใจกันดี', 'มีเป้าหมายร่วมกัน'],
      challenges: ['ต้องปรับตัว'],
      advice: 'ควรสื่อสารกันอย่างเปิดเผยและตรงไปตรงมา เพื่อสร้างความเข้าใจที่ดีขึ้น',
      elementCompatibility: 'Fire + Earth',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(compatibility);
    expect(preview).toContain('ควรสื่อสาร');
  });

  it('should generate preview from Chinese zodiac reading', () => {
    const chineseZodiac: ChineseZodiacData = {
      id: 'test-3',
      type: 'chinese_zodiac',
      animal: ChineseZodiacAnimal.DRAGON,
      element: ChineseElement.WOOD,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      fortune: {
        overall: 'โชคลาภดีมาก มีโอกาสก้าวหน้าในหน้าที่การงาน',
        career: 'งาน',
        wealth: 'การเงิน',
        health: 'สุขภาพ',
        relationships: 'ความสัมพันธ์'
      },
      luckyColors: ['green'],
      luckyNumbers: [3, 8],
      luckyDirections: ['East'],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(chineseZodiac);
    expect(preview).toContain('โชคลาภดีมาก');
  });

  it('should generate preview from name numerology reading', () => {
    const nameNumerology: NameNumerologyData = {
      id: 'test-4',
      type: 'name_numerology',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      scores: { firstName: 5, lastName: 7, fullName: 3, destiny: 1 },
      interpretation: {
        personality: 'คุณเป็นคนที่มีความคิดสร้างสรรค์และชอบความเป็นอิสระ',
        strengths: ['ความคิดสร้างสรรค์'],
        weaknesses: ['ขาดความอดทน'],
        lifePath: 'เส้นทางชีวิต',
        career: 'อาชีพ',
        relationships: 'ความสัมพันธ์'
      },
      luckyNumbers: [1, 5],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(nameNumerology);
    expect(preview).toContain('คุณเป็นคนที่มีความคิดสร้างสรรค์');
  });

  it('should generate preview from specialized reading', () => {
    const specialized: SpecializedData = {
      id: 'test-5',
      type: 'specialized',
      zodiacSign: ZodiacSign.LEO,
      domain: 'finance_career',
      period: TimePeriod.WEEKLY,
      dateRange: { start: '2024-01-01', end: '2024-01-07' },
      prediction: 'สัปดาห์นี้จะมีโอกาสทางการเงินที่ดี ควรใช้โอกาสนี้ให้เกิดประโยชน์สูงสุด',
      opportunities: ['โอกาสใหม่'],
      challenges: ['อุปสรรค'],
      actionItems: ['ทำสิ่งนี้'],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(specialized);
    expect(preview).toContain('สัปดาห์นี้');
  });

  it('should truncate long text to 100 characters', () => {
    const longText = 'ก'.repeat(150);
    const horoscope: HoroscopeData = {
      id: 'test-6',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: {
        love: longText,
        career: 'งาน',
        finance: 'การเงิน',
        health: 'สุขภาพ'
      },
      luckyNumbers: [1],
      luckyColors: ['red'],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const preview = generatePreview(horoscope);
    expect(preview.length).toBe(103); // 100 + '...'
    expect(preview.endsWith('...')).toBe(true);
  });

  it('should generate preview from tarot reading', () => {
    const tarot: SavedTarotReading = {
      id: 'test-7',
      kind: 'tarot',
      createdAt: '2024-01-01T00:00:00Z',
      count: 3,
      cardsToken: 'abc123',
      question: 'จะเจอความรักเมื่อไหร่',
      aiSummary: 'คุณจะพบความรักในเร็วๆ นี้',
      version: 1
    };

    const preview = generatePreview(tarot);
    expect(preview).toContain('คุณจะพบความรัก');
  });
});

describe('Library Storage - Builder Functions', () => {
  it('should build horoscope reading with id and timestamp', () => {
    const reading = buildSavedHoroscopeReading({
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

    expect(reading.id).toBeDefined();
    expect(reading.createdAt).toBeDefined();
    expect(reading.zodiacSign).toBe(ZodiacSign.ARIES);
  });

  it('should build compatibility reading with id and timestamp', () => {
    const reading = buildSavedCompatibilityReading({
      type: 'compatibility',
      person1: { birthDate: '1990-01-01', zodiacSign: ZodiacSign.ARIES },
      person2: { birthDate: '1992-05-15', zodiacSign: ZodiacSign.TAURUS },
      scores: { overall: 75, communication: 80, emotional: 70, longTerm: 75 },
      strengths: ['strength1'],
      challenges: ['challenge1'],
      advice: 'advice',
      elementCompatibility: 'Fire + Earth',
      aiEnhanced: false
    });

    expect(reading.id).toBeDefined();
    expect(reading.createdAt).toBeDefined();
    expect(reading.type).toBe('compatibility');
  });

  it('should build Chinese zodiac reading with id and timestamp', () => {
    const reading = buildSavedChineseZodiacReading({
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

    expect(reading.id).toBeDefined();
    expect(reading.createdAt).toBeDefined();
    expect(reading.animal).toBe(ChineseZodiacAnimal.DRAGON);
  });

  it('should build name numerology reading with id and timestamp', () => {
    const reading = buildSavedNameNumerologyReading({
      type: 'name_numerology',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      scores: { firstName: 5, lastName: 7, fullName: 3, destiny: 1 },
      interpretation: {
        personality: 'personality',
        strengths: ['strength1'],
        weaknesses: ['weakness1'],
        lifePath: 'lifePath',
        career: 'career',
        relationships: 'relationships'
      },
      luckyNumbers: [1, 5],
      advice: 'advice',
      aiEnhanced: false
    });

    expect(reading.id).toBeDefined();
    expect(reading.createdAt).toBeDefined();
    expect(reading.firstName).toBe('สมชาย');
  });

  it('should build specialized reading with id and timestamp', () => {
    const reading = buildSavedSpecializedReading({
      type: 'specialized',
      zodiacSign: ZodiacSign.LEO,
      domain: 'finance_career',
      period: TimePeriod.WEEKLY,
      dateRange: { start: '2024-01-01', end: '2024-01-07' },
      prediction: 'prediction',
      opportunities: ['opp1'],
      challenges: ['challenge1'],
      actionItems: ['action1'],
      advice: 'advice',
      aiEnhanced: false
    });

    expect(reading.id).toBeDefined();
    expect(reading.createdAt).toBeDefined();
    expect(reading.domain).toBe('finance_career');
  });
});

describe('Library Storage - 50-Entry Limit', () => {
  beforeEach(() => {
    localStorageMock.clear();
    clearLibrary();
  });

  it('should enforce 50-entry limit by removing oldest entries', () => {
    // Add 51 tarot readings
    for (let i = 0; i < 51; i++) {
      const reading: SavedTarotReading = {
        id: `reading-${i}`,
        kind: 'tarot',
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        count: 1,
        cardsToken: `token-${i}`,
        version: 1
      };
      upsertReading(reading);
    }

    const library = loadLibrary();
    expect(library.items.length).toBe(50);
    
    // Oldest reading (reading-0) should be removed
    const hasOldest = library.items.some(r => r.id === 'reading-0');
    expect(hasOldest).toBe(false);
    
    // Newest reading (reading-50) should be present
    const hasNewest = library.items.some(r => r.id === 'reading-50');
    expect(hasNewest).toBe(true);
  });

  it('should keep entries at or below 50', () => {
    // Add exactly 50 readings
    for (let i = 0; i < 50; i++) {
      const reading: SavedTarotReading = {
        id: `reading-${i}`,
        kind: 'tarot',
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        count: 1,
        cardsToken: `token-${i}`,
        version: 1
      };
      upsertReading(reading);
    }

    const library = loadLibrary();
    expect(library.items.length).toBe(50);
  });

  it('should update existing reading without affecting count', () => {
    // Add 50 readings
    for (let i = 0; i < 50; i++) {
      const reading: SavedTarotReading = {
        id: `reading-${i}`,
        kind: 'tarot',
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        count: 1,
        cardsToken: `token-${i}`,
        version: 1
      };
      upsertReading(reading);
    }

    // Update an existing reading
    const updatedReading: SavedTarotReading = {
      id: 'reading-25',
      kind: 'tarot',
      createdAt: new Date(2024, 0, 26).toISOString(),
      count: 3,
      cardsToken: 'updated-token',
      question: 'Updated question',
      version: 1
    };
    upsertReading(updatedReading);

    const library = loadLibrary();
    expect(library.items.length).toBe(50);
    
    const updated = library.items.find(r => r.id === 'reading-25');
    expect(updated?.count).toBe(3);
    expect(updated?.question).toBe('Updated question');
  });
});

describe('Library Storage - LibraryEntry Conversion', () => {
  it('should convert horoscope to LibraryEntry', () => {
    const horoscope: HoroscopeData = {
      id: 'test-1',
      type: 'horoscope',
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { start: '2024-01-01', end: '2024-01-01' },
      aspects: {
        love: 'ความรัก',
        career: 'งาน',
        finance: 'การเงิน',
        health: 'สุขภาพ'
      },
      luckyNumbers: [1, 2, 3],
      luckyColors: ['red'],
      advice: 'คำแนะนำ',
      aiEnhanced: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const entry = toLibraryEntry(horoscope, false);
    
    expect(entry.id).toBe('test-1');
    expect(entry.type).toBe('horoscope');
    expect(entry.preview).toBe('ความรัก');
    expect(entry.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(entry.favorite).toBe(false);
    expect(entry.data).toEqual(horoscope);
  });

  it('should convert tarot reading to LibraryEntry', () => {
    const tarot: SavedTarotReading = {
      id: 'test-2',
      kind: 'tarot',
      createdAt: '2024-01-01T00:00:00Z',
      count: 3,
      cardsToken: 'abc123',
      aiSummary: 'สรุปการดูไพ่',
      version: 1
    };

    const entry = toLibraryEntry(tarot, true);
    
    expect(entry.id).toBe('test-2');
    expect(entry.preview).toBe('สรุปการดูไพ่');
    expect(entry.favorite).toBe(true);
  });
});
