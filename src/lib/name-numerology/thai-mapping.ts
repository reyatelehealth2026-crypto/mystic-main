/**
 * Thai Character to Number Mapping for Name Numerology
 * 
 * This module implements the Pythagorean numerology system adapted for the Thai alphabet.
 * Each Thai character (consonant or vowel) maps to a number from 1-9.
 */

/**
 * Thai consonant to number mapping
 * Follows cycling pattern: ก=1, ข=2, ค=3, ง=4, จ=5, ฉ=6, ช=7, ซ=8, ฌ=9, then repeats
 */
const THAI_CONSONANT_MAP: Record<string, number> = {
  // Cycle 1: 1-9
  'ก': 1, 'ข': 2, 'ค': 3, 'ง': 4, 'จ': 5, 'ฉ': 6, 'ช': 7, 'ซ': 8, 'ฌ': 9,
  
  // Cycle 2: 1-9
  'ญ': 1, 'ฎ': 2, 'ฏ': 3, 'ฐ': 4, 'ฑ': 5, 'ฒ': 6, 'ณ': 7, 'ด': 8, 'ต': 9,
  
  // Cycle 3: 1-9
  'ถ': 1, 'ท': 2, 'ธ': 3, 'น': 4, 'บ': 5, 'ป': 6, 'ผ': 7, 'ฝ': 8, 'พ': 9,
  
  // Cycle 4: 1-9
  'ฟ': 1, 'ภ': 2, 'ม': 3, 'ย': 4, 'ร': 5, 'ล': 6, 'ว': 7, 'ศ': 8, 'ษ': 9,
  
  // Cycle 5: 1-9
  'ส': 1, 'ห': 2, 'ฬ': 3, 'อ': 4, 'ฮ': 5
};

/**
 * Thai vowel to number mapping
 * Based on traditional Thai numerology associations
 */
const THAI_VOWEL_MAP: Record<string, number> = {
  'ะ': 1,
  'า': 1,
  'ิ': 1,
  'ี': 2,
  'ึ': 3,
  'ื': 3,
  'ุ': 3,
  'ู': 6,
  'เ': 5,
  'แ': 5,
  'โ': 7,
  'ใ': 9,
  'ไ': 9,
  // Additional vowel forms
  'ำ': 1,
  'ๅ': 1,
  'ฤ': 5,
  'ฦ': 6,
  // Tone marks (treated as modifiers, assigned neutral value)
  '่': 1,
  '้': 2,
  '๊': 3,
  '๋': 4,
  // Special characters
  'ั': 1,
  '็': 1,
  '์': 0, // Silent marker, contributes 0
  'ๆ': 1  // Repetition mark
};

/**
 * Convert a single Thai character to its numerological number value
 * 
 * @param char - A single Thai character (consonant, vowel, or tone mark)
 * @returns The numerological value (1-9), or 0 if character is not mapped
 * 
 * @example
 * ```typescript
 * thaiCharToNumber('ก') // returns 1
 * thaiCharToNumber('ข') // returns 2
 * thaiCharToNumber('า') // returns 1
 * thaiCharToNumber('ี') // returns 2
 * ```
 */
export function thaiCharToNumber(char: string): number {
  // Check consonants first
  if (char in THAI_CONSONANT_MAP) {
    return THAI_CONSONANT_MAP[char];
  }
  
  // Check vowels and tone marks
  if (char in THAI_VOWEL_MAP) {
    return THAI_VOWEL_MAP[char];
  }
  
  // Space or unknown character contributes 0
  if (char === ' ' || char === '\u00A0') {
    return 0;
  }
  
  // Unknown Thai character - return 0 to avoid breaking calculation
  return 0;
}

/**
 * Get all supported Thai consonants
 * @returns Array of Thai consonant characters
 */
export function getSupportedConsonants(): string[] {
  return Object.keys(THAI_CONSONANT_MAP);
}

/**
 * Get all supported Thai vowels and marks
 * @returns Array of Thai vowel and tone mark characters
 */
export function getSupportedVowels(): string[] {
  return Object.keys(THAI_VOWEL_MAP);
}

/**
 * Check if a character is a supported Thai character
 * @param char - Character to check
 * @returns True if the character is in the mapping
 */
export function isSupportedThaiChar(char: string): boolean {
  return char in THAI_CONSONANT_MAP || char in THAI_VOWEL_MAP || char === ' ';
}
