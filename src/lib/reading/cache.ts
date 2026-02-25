/**
 * Cache Manager for Fortune Readings
 * 
 * Provides TTL-based caching for horoscope readings to reduce API calls
 * and improve performance. Uses browser local storage with automatic
 * expiration and cleanup.
 */

import { ReadingType } from './types';

/**
 * Cache entry structure with metadata
 */
export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: Date;
  expiresAt: Date;
}

/**
 * Options for cache operations
 */
export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  keyPrefix: string;
}

const CACHE_PREFIX = 'fortune_cache_';

/**
 * Set a cache entry with TTL-based expiration
 * 
 * @param key - Cache key (without prefix)
 * @param data - Data to cache
 * @param options - Cache options including TTL and key prefix
 */
export function setCacheEntry<T>(key: string, data: T, options: CacheOptions): void {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + options.ttl);
    
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: now,
      expiresAt
    };
    
    const storageKey = `${CACHE_PREFIX}${options.keyPrefix}_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch (error) {
    // Silently fail if storage is full or unavailable
    console.error('Failed to set cache entry:', error);
  }
}

/**
 * Get a cache entry if it exists and is valid
 * 
 * @param key - Cache key (without prefix)
 * @param keyPrefix - Key prefix to use
 * @returns Cached data or null if not found or expired
 */
export function getCacheEntry<T>(key: string, keyPrefix: string = ''): T | null {
  try {
    const storageKey = `${CACHE_PREFIX}${keyPrefix}_${key}`;
    const item = localStorage.getItem(storageKey);
    
    if (!item) {
      return null;
    }
    
    const entry: CacheEntry<T> = JSON.parse(item);
    
    // Check if expired
    const now = new Date();
    const expiresAt = new Date(entry.expiresAt);
    
    if (now > expiresAt) {
      // Remove expired entry
      localStorage.removeItem(storageKey);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    // Return null on any error (corrupted data, etc.)
    console.error('Failed to get cache entry:', error);
    return null;
  }
}

/**
 * Check if a cache entry exists and is valid
 * 
 * @param key - Cache key (without prefix)
 * @param keyPrefix - Key prefix to use
 * @returns True if cache entry is valid, false otherwise
 */
export function isCacheValid(key: string, keyPrefix: string = ''): boolean {
  try {
    const storageKey = `${CACHE_PREFIX}${keyPrefix}_${key}`;
    const item = localStorage.getItem(storageKey);
    
    if (!item) {
      return false;
    }
    
    const entry: CacheEntry<unknown> = JSON.parse(item);
    const now = new Date();
    const expiresAt = new Date(entry.expiresAt);
    
    return now <= expiresAt;
  } catch (error) {
    return false;
  }
}

/**
 * Clear all expired cache entries
 * Useful for cleanup on page load or when storage quota is exceeded
 */
export function clearExpiredCache(): void {
  try {
    const keysToRemove: string[] = [];
    const now = new Date();
    
    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry<unknown> = JSON.parse(item);
            const expiresAt = new Date(entry.expiresAt);
            
            if (now > expiresAt) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // If we can't parse it, mark for removal
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
  }
}

/**
 * Clear all cache entries with a specific prefix
 * 
 * @param prefix - Key prefix to match (e.g., 'horoscope', 'compatibility')
 */
export function clearCacheByPrefix(prefix: string): void {
  try {
    const keysToRemove: string[] = [];
    const searchPrefix = `${CACHE_PREFIX}${prefix}`;
    
    // Find all keys with the specified prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(searchPrefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove matching entries
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear cache by prefix:', error);
  }
}

/**
 * Generate a cache key from reading type and parameters
 * 
 * @param type - Reading type
 * @param params - Parameters specific to the reading type
 * @returns Cache key string
 */
export function generateCacheKey(type: ReadingType, params: any): string {
  switch (type) {
    case ReadingType.HOROSCOPE:
      // Format: {zodiacSign}_{period}_{date}
      return `${params.zodiacSign}_${params.period}_${formatDate(params.date)}`;
      
    case ReadingType.CHINESE_ZODIAC:
      // Format: {animal}_{period}_{date}
      return `${params.animal}_${params.period}_${formatDate(params.date)}`;
      
    case ReadingType.SPECIALIZED:
      // Format: {zodiacSign}_{domain}_{period}_{date}
      return `${params.zodiacSign}_${params.domain}_${params.period}_${formatDate(params.date)}`;
      
    default:
      // For other types, create a simple hash of params
      return JSON.stringify(params);
  }
}

/**
 * Format date as YYYY-MM-DD for cache keys
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate milliseconds until end of day
 * Useful for daily horoscope cache TTL
 */
export function getMillisecondsUntilEndOfDay(date: Date = new Date()): number {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() - date.getTime();
}

/**
 * Calculate milliseconds until end of week (Sunday 23:59:59)
 * Useful for weekly horoscope cache TTL
 */
export function getMillisecondsUntilEndOfWeek(date: Date = new Date()): number {
  const endOfWeek = new Date(date);
  const daysUntilSunday = 7 - endOfWeek.getDay();
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek.getTime() - date.getTime();
}

/**
 * Calculate milliseconds until end of month
 * Useful for monthly horoscope cache TTL
 */
export function getMillisecondsUntilEndOfMonth(date: Date = new Date()): number {
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return endOfMonth.getTime() - date.getTime();
}
