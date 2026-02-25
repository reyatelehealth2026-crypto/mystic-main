"use client";

import { useMemo, useState, useCallback } from "react";
import type { 
  LibraryStateV1, 
  SavedReading,
  LibraryEntry,
  HoroscopeData,
  CompatibilityData,
  ChineseZodiacData,
  NameNumerologyData,
  SpecializedData
} from "./types";
import { ReadingType } from "../reading/types";
import { 
  clearLibrary, 
  loadLibrary, 
  removeReading, 
  upsertReading,
  toLibraryEntry
} from "./storage";

export type FilterType = ReadingType | 'all';

export interface UseLibraryReturn {
  items: SavedReading[];
  entries: LibraryEntry[];
  filteredEntries: LibraryEntry[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  upsert: (reading: SavedReading | HoroscopeData | CompatibilityData | ChineseZodiacData | NameNumerologyData | SpecializedData) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  getReadingsByType: (type: ReadingType) => LibraryEntry[];
  totalCount: number;
  countByType: Record<ReadingType, number>;
}

export function useLibrary(): UseLibraryReturn {
  const [state, setState] = useState<LibraryStateV1>(() => loadLibrary());
  const [filter, setFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Load favorites from localStorage
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
  });

  // Convert SavedReading items to LibraryEntry format
  const entries = useMemo(() => {
    return state.items.map(item => toLibraryEntry(item, favorites.has(item.id)));
  }, [state.items, favorites]);

  // Filter entries by type
  const filteredEntries = useMemo(() => {
    if (filter === 'all') {
      return entries;
    }
    return entries.filter(entry => entry.type === filter);
  }, [entries, filter]);

  // Get readings by specific type
  const getReadingsByType = useCallback((type: ReadingType): LibraryEntry[] => {
    return entries.filter(entry => entry.type === type);
  }, [entries]);

  // Calculate total count
  const totalCount = useMemo(() => entries.length, [entries]);

  // Calculate count by type
  const countByType = useMemo(() => {
    const counts: Record<ReadingType, number> = {
      [ReadingType.TAROT]: 0,
      [ReadingType.SPIRIT_CARD]: 0,
      [ReadingType.NUMEROLOGY]: 0,
      [ReadingType.DAILY_CARD]: 0,
      [ReadingType.HOROSCOPE]: 0,
      [ReadingType.COMPATIBILITY]: 0,
      [ReadingType.CHINESE_ZODIAC]: 0,
      [ReadingType.SPECIALIZED]: 0,
      [ReadingType.NAME_NUMEROLOGY]: 0,
    };

    entries.forEach(entry => {
      if (entry.type in counts) {
        counts[entry.type]++;
      }
    });

    return counts;
  }, [entries]);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: Set<string>) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem('reffortune.library.favorites', JSON.stringify([...newFavorites]));
    } catch {
      // Ignore errors
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavorites(next);
      return next;
    });
  }, [saveFavorites]);

  // Upsert reading (supports both old and new types)
  const upsert = useCallback((reading: SavedReading | HoroscopeData | CompatibilityData | ChineseZodiacData | NameNumerologyData | SpecializedData) => {
    // Convert new reading types to SavedReading format for storage
    // For now, we store them as-is since storage.ts already handles both formats
    setState(upsertReading(reading as SavedReading));
  }, []);

  // Remove reading and its favorite status
  const remove = useCallback((id: string) => {
    setState(removeReading(id));
    setFavorites(prev => {
      const next = new Set(prev);
      next.delete(id);
      saveFavorites(next);
      return next;
    });
  }, [saveFavorites]);

  // Clear all readings and favorites
  const clear = useCallback(() => {
    setState(clearLibrary());
    setFavorites(new Set());
    saveFavorites(new Set());
  }, [saveFavorites]);

  return {
    items: state.items,
    entries,
    filteredEntries,
    filter,
    setFilter,
    upsert,
    remove,
    clear,
    toggleFavorite,
    getReadingsByType,
    totalCount,
    countByType
  };
}
