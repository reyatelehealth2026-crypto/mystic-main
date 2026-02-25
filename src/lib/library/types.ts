import { ZodiacSign, TimePeriod } from '../horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '../chinese-zodiac/types';
import { ReadingSession, ReadingType } from '../reading/types';

export type SavedReadingKind =
  | "tarot"
  | "daily_card"
  | "spirit_card"
  | "spirit_path"
  | "horoscope"
  | "compatibility"
  | "chinese_zodiac"
  | "specialized"
  | "name_numerology";

export interface SavedTarotSnapshot {
  input: {
    count: number;
    cardsToken: string;
    question?: string;
  };
  /** Deterministic structured result (no API calls needed) */
  session: ReadingSession;
  /** Optional AI-enhanced copy (if/when available at save time) */
  ai?: {
    summary?: string;
    cardStructure?: string;
  };
}

export interface SavedTarotReading {
  id: string; // uuid
  kind: "tarot";
  createdAt: string; // ISO

  count: number;
  cardsToken: string;
  question?: string;

  // Optional denormalized preview
  aiSummary?: string;
  aiCardStructure?: string;

  /** Full output snapshot for read-only detail rendering */
  snapshot?: SavedTarotSnapshot;

  version: 1;
}

export interface SavedDailyCardSnapshot {
  dayKey: string;
  cardId: string;
  orientation: "upright" | "reversed";
  output: {
    /** Message/energy */
    message: string;
    focus: string[];
    advice: {
      action: string;
      avoid: string;
    };
  };
}

export interface SavedDailyCardReading {
  id: string; // uuid
  kind: "daily_card";
  createdAt: string; // ISO

  /** YYYY-MM-DD in user's local time at save time */
  dayKey: string;

  cardId: string;
  orientation: "upright" | "reversed";

  // Optional denormalized preview
  title?: string;
  summary?: string;
  tags?: string[];

  /** Full output snapshot for read-only detail rendering */
  snapshot?: SavedDailyCardSnapshot;

  version: 1;
}

export interface SavedSpiritCardSnapshot {
  input: {
    dob: string;
  };
  card: {
    cardId: string;
    orientation: "upright" | "reversed";
    lifePathNumber?: number;
  };
  /** Deterministic structured result (no API calls needed) */
  session: ReadingSession;
  output?: {
    message?: string;
    practice?: string;
  };
}

export interface SavedSpiritCardReading {
  id: string; // uuid
  kind: "spirit_card";
  createdAt: string; // ISO

  dob: string; // YYYY-MM-DD

  cardId: string;
  orientation: "upright" | "reversed";
  lifePathNumber?: number;

  // Optional denormalized preview
  title?: string;
  aiSummary?: string;
  aiCardStructure?: string;
  tags?: string[];

  /** Full output snapshot for read-only detail rendering */
  snapshot?: SavedSpiritCardSnapshot;

  version: 1;
}

export interface SavedSpiritPathSnapshot {
  input: {
    day: number;
    month: number;
    year: number; // CE
  };
  cards: {
    zodiacCardId: string;
    soulCardId: string;
  };
  output?: {
    /** MARKDOWN */
    interpretationMarkdown?: string;
  };
}

export interface SavedSpiritPathReading {
  id: string; // uuid
  kind: "spirit_path";
  createdAt: string; // ISO

  day: number;
  month: number;
  year: number; // CE

  zodiacCardId: string;
  soulCardId: string;

  // Optional denormalized preview
  title?: string;
  interpretationMarkdown?: string;
  tags?: string[];

  snapshot?: SavedSpiritPathSnapshot;

  version: 1;
}

/**
 * Horoscope reading data for library storage
 */
export interface HoroscopeData {
  id: string; // UUID
  type: 'horoscope';
  zodiacSign: ZodiacSign;
  period: TimePeriod;
  dateRange: {
    start: string; // ISO date
    end: string; // ISO date
  };
  aspects: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
  luckyNumbers: number[];
  luckyColors: string[];
  advice: string;
  aiEnhanced: boolean;
  createdAt: string; // ISO timestamp
}

/**
 * Compatibility reading data for library storage
 */
export interface CompatibilityData {
  id: string;
  type: 'compatibility';
  person1: {
    birthDate: string; // ISO date
    zodiacSign: ZodiacSign;
  };
  person2: {
    birthDate: string;
    zodiacSign: ZodiacSign;
  };
  scores: {
    overall: number;
    communication: number;
    emotional: number;
    longTerm: number;
  };
  strengths: string[];
  challenges: string[];
  advice: string;
  elementCompatibility: string;
  aiEnhanced: boolean;
  createdAt: string;
}

/**
 * Chinese zodiac reading data for library storage
 */
export interface ChineseZodiacData {
  id: string;
  type: 'chinese_zodiac';
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  period: TimePeriod;
  dateRange: {
    start: string;
    end: string;
  };
  fortune: {
    overall: string;
    career: string;
    wealth: string;
    health: string;
    relationships: string;
  };
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  advice: string;
  aiEnhanced: boolean;
  createdAt: string;
}

/**
 * Name numerology reading data for library storage
 */
export interface NameNumerologyData {
  id: string;
  type: 'name_numerology';
  firstName: string;
  lastName: string;
  scores: {
    firstName: number;
    lastName: number;
    fullName: number;
    destiny: number;
  };
  interpretation: {
    personality: string;
    strengths: string[];
    weaknesses: string[];
    lifePath: string;
    career: string;
    relationships: string;
  };
  luckyNumbers: number[];
  advice: string;
  aiEnhanced: boolean;
  createdAt: string;
}

/**
 * Specialized domain reading data for library storage
 */
export interface SpecializedData {
  id: string;
  type: 'specialized';
  zodiacSign: ZodiacSign;
  domain: 'finance_career' | 'love_relationships';
  period: TimePeriod;
  dateRange: {
    start: string;
    end: string;
  };
  prediction: string;
  opportunities: string[];
  challenges: string[];
  actionItems: string[];
  advice: string;
  aiEnhanced: boolean;
  createdAt: string;
}

export type SavedReading =
  | SavedTarotReading
  | SavedDailyCardReading
  | SavedSpiritCardReading
  | SavedSpiritPathReading
  | HoroscopeData
  | CompatibilityData
  | ChineseZodiacData
  | NameNumerologyData
  | SpecializedData;

/**
 * Library entry supporting all reading types
 */
export interface LibraryEntry {
  id: string;
  type: ReadingType;
  data:
    | HoroscopeData
    | CompatibilityData
    | ChineseZodiacData
    | NameNumerologyData
    | SpecializedData
    | SavedTarotReading
    | SavedDailyCardReading
    | SavedSpiritCardReading
    | SavedSpiritPathReading;
  preview: string; // Short text for list view
  createdAt: string;
  favorite: boolean;
}

/**
 * Complete library storage structure
 */
export interface Library {
  entries: LibraryEntry[];
  maxEntries: number; // 50
  lastUpdated: string;
}

export interface LibraryStateV1 {
  version: 1;
  items: SavedReading[];
}
