import type {
  LibraryStateV1,
  SavedReading,
  SavedTarotReading,
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedSpiritPathReading,
  HoroscopeData,
  CompatibilityData,
  ChineseZodiacData,
  NameNumerologyData,
  SpecializedData,
  LibraryEntry,
} from "./types";

import { ReadingType } from "../reading/types";

const KEY = "reffortune.library.v1";
const MAX_ENTRIES = 50;

function emptyState(): LibraryStateV1 {
  return { version: 1, items: [] };
}

function safeParse(json: string | null): unknown {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Generate preview text from reading data (first 100 characters)
 */
export function generatePreview(reading: SavedReading | HoroscopeData | CompatibilityData | ChineseZodiacData | NameNumerologyData | SpecializedData): string {
  let text = '';
  
  if ("kind" in reading) {
    // Saved*Reading (tarot / daily / spirit)
    switch (reading.kind) {
      case "tarot":
        text = reading.aiSummary || reading.question || `${reading.count} ใบ`;
        break;
      case "daily_card":
        text = reading.summary || reading.title || reading.dayKey;
        break;
      case "spirit_card":
        text = reading.aiSummary || reading.title || reading.dob;
        break;
      case "spirit_path":
        text = reading.interpretationMarkdown || reading.title || `${reading.day}/${reading.month}/${reading.year}`;
        break;
    }
  } else if ("type" in reading) {
    // New reading types
    switch (reading.type) {
      case 'horoscope':
        text = reading.aspects.love || reading.advice;
        break;
      case 'compatibility':
        text = reading.advice || reading.strengths[0] || '';
        break;
      case 'chinese_zodiac':
        text = reading.fortune.overall || reading.advice;
        break;
      case 'name_numerology':
        text = reading.interpretation.personality || reading.advice;
        break;
      case 'specialized':
        text = reading.prediction || reading.advice;
        break;
    }
  }
  
  // Truncate to 100 characters
  if (text.length > 100) {
    return text.substring(0, 100) + '...';
  }
  
  return text;
}

/**
 * Convert SavedReading to LibraryEntry format
 */
export function toLibraryEntry(
  reading: SavedReading | HoroscopeData | CompatibilityData | ChineseZodiacData | NameNumerologyData | SpecializedData,
  favorite: boolean = false
): LibraryEntry {
  const preview = generatePreview(reading);

  if ("kind" in reading) {
    const type =
      reading.kind === "tarot"
        ? ReadingType.TAROT
        : reading.kind === "daily_card"
          ? ReadingType.DAILY_CARD
          : ReadingType.SPIRIT_CARD;

    return {
      id: reading.id,
      type,
      data: reading,
      preview,
      createdAt: reading.createdAt,
      favorite,
    };
  }

  return {
    id: reading.id,
    type: reading.type as ReadingType,
    data: reading,
    preview,
    createdAt: reading.createdAt,
    favorite,
  };
}

/**
 * Enforce 50-entry limit with oldest-first eviction (preserve favorites)
 */
function enforceEntryLimit(items: SavedReading[], favorites: Set<string> = new Set()): SavedReading[] {
  if (items.length <= MAX_ENTRIES) {
    return items;
  }
  
  // Separate favorites and non-favorites
  const favoriteItems = items.filter(item => favorites.has(item.id));
  const nonFavoriteItems = items.filter(item => !favorites.has(item.id));
  
  // If favorites alone exceed limit, keep all favorites (edge case)
  if (favoriteItems.length >= MAX_ENTRIES) {
    return favoriteItems;
  }
  
  // Sort non-favorites by createdAt (oldest first)
  const sortedNonFavorites = nonFavoriteItems.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
  
  // Calculate how many non-favorites we can keep
  const slotsForNonFavorites = MAX_ENTRIES - favoriteItems.length;
  
  // Keep newest non-favorites to fill remaining slots
  const keptNonFavorites = sortedNonFavorites.slice(-slotsForNonFavorites);
  
  // Combine favorites and kept non-favorites
  return [...favoriteItems, ...keptNonFavorites];
}

export function loadLibrary(): LibraryStateV1 {
  if (typeof window === "undefined") return emptyState();
  const raw = safeParse(window.localStorage.getItem(KEY));
  if (!raw || typeof raw !== "object") return emptyState();
  const obj = raw as Partial<LibraryStateV1>;
  if (obj.version !== 1 || !Array.isArray(obj.items)) return emptyState();
  return { version: 1, items: obj.items as SavedReading[] };
}

export function saveLibrary(state: LibraryStateV1): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

/**
 * Load favorites from localStorage
 */
function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = window.localStorage.getItem('reffortune.library.favorites');
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }
  return new Set();
}

export function upsertReading(reading: SavedReading): LibraryStateV1 {
  const state = loadLibrary();
  const favorites = loadFavorites();
  const idx = state.items.findIndex((r) => r.id === reading.id);
  
  let items: SavedReading[];
  if (idx >= 0) {
    // Update existing reading
    items = state.items.map((r, i) => (i === idx ? reading : r));
  } else {
    // Add new reading at the beginning
    items = [reading, ...state.items];
    // Enforce 50-entry limit (preserve favorites)
    items = enforceEntryLimit(items, favorites);
  }
  
  const next: LibraryStateV1 = { version: 1, items };
  saveLibrary(next);
  return next;
}

export function removeReading(id: string): LibraryStateV1 {
  const state = loadLibrary();
  const next: LibraryStateV1 = { version: 1, items: state.items.filter((r) => r.id !== id) };
  saveLibrary(next);
  return next;
}

export function clearLibrary(): LibraryStateV1 {
  const next = emptyState();
  saveLibrary(next);
  return next;
}

export function buildSavedTarotReading(params: {
  id: string;
  createdAt?: string;
  count: number;
  cardsToken: string;
  question?: string;
  aiSummary?: string;
  aiCardStructure?: string;
  snapshot?: SavedTarotReading["snapshot"];
}): SavedTarotReading {
  return {
    id: params.id,
    kind: "tarot",
    createdAt: params.createdAt ?? new Date().toISOString(),
    count: params.count,
    cardsToken: params.cardsToken,
    question: params.question,
    aiSummary: params.aiSummary,
    aiCardStructure: params.aiCardStructure,
    snapshot: params.snapshot,
    version: 1,
  };
}

export function buildSavedDailyCardReading(params: {
  id: string;
  createdAt?: string;
  dayKey: string;
  cardId: string;
  orientation: "upright" | "reversed";
  title?: string;
  summary?: string;
  tags?: string[];
  snapshot?: SavedDailyCardReading["snapshot"];
}): SavedDailyCardReading {
  return {
    id: params.id,
    kind: "daily_card",
    createdAt: params.createdAt ?? new Date().toISOString(),
    dayKey: params.dayKey,
    cardId: params.cardId,
    orientation: params.orientation,
    title: params.title,
    summary: params.summary,
    tags: params.tags,
    snapshot: params.snapshot,
    version: 1,
  };
}

export function buildSavedSpiritCardReading(params: {
  id: string;
  createdAt?: string;
  dob: string;
  cardId: string;
  orientation: "upright" | "reversed";
  lifePathNumber?: number;
  title?: string;
  aiSummary?: string;
  aiCardStructure?: string;
  tags?: string[];
  snapshot?: SavedSpiritCardReading["snapshot"];
}): SavedSpiritCardReading {
  return {
    id: params.id,
    kind: "spirit_card",
    createdAt: params.createdAt ?? new Date().toISOString(),
    dob: params.dob,
    cardId: params.cardId,
    orientation: params.orientation,
    lifePathNumber: params.lifePathNumber,
    title: params.title,
    aiSummary: params.aiSummary,
    aiCardStructure: params.aiCardStructure,
    tags: params.tags,
    snapshot: params.snapshot,
    version: 1,
  };
}

export function buildSavedSpiritPathReading(params: {
  id: string;
  createdAt?: string;
  day: number;
  month: number;
  year: number;
  zodiacCardId: string;
  soulCardId: string;
  title?: string;
  interpretationMarkdown?: string;
  tags?: string[];
  snapshot?: SavedSpiritPathReading["snapshot"];
}): SavedSpiritPathReading {
  return {
    id: params.id,
    kind: "spirit_path",
    createdAt: params.createdAt ?? new Date().toISOString(),
    day: params.day,
    month: params.month,
    year: params.year,
    zodiacCardId: params.zodiacCardId,
    soulCardId: params.soulCardId,
    title: params.title,
    interpretationMarkdown: params.interpretationMarkdown,
    tags: params.tags,
    snapshot: params.snapshot,
    version: 1,
  };
}

/**
 * Build saved horoscope reading
 */
export function buildSavedHoroscopeReading(data: Omit<HoroscopeData, 'id' | 'createdAt'>): HoroscopeData {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}

/**
 * Build saved compatibility reading
 */
export function buildSavedCompatibilityReading(data: Omit<CompatibilityData, 'id' | 'createdAt'>): CompatibilityData {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}

/**
 * Build saved Chinese zodiac reading
 */
export function buildSavedChineseZodiacReading(data: Omit<ChineseZodiacData, 'id' | 'createdAt'>): ChineseZodiacData {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}

/**
 * Build saved name numerology reading
 */
export function buildSavedNameNumerologyReading(data: Omit<NameNumerologyData, 'id' | 'createdAt'>): NameNumerologyData {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}

/**
 * Build saved specialized reading
 */
export function buildSavedSpecializedReading(data: Omit<SpecializedData, 'id' | 'createdAt'>): SpecializedData {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}
