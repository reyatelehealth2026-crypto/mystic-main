// Compatibility Scoring Algorithm for REFFORTUNE
// Feature: popular-fortune-features
// Calculates love compatibility scores between zodiac signs

import { ZodiacSign } from '../horoscope/types';
import { getZodiacMetadata } from '../horoscope/zodiac';

/**
 * Element compatibility matrix
 * Defines how well different elements work together
 */
const ELEMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
  fire: {
    fire: 95,    // Same element - high compatibility
    air: 80,     // Compatible - air feeds fire
    earth: 40,   // Challenging - earth smothers fire
    water: 35    // Challenging - water extinguishes fire
  },
  earth: {
    earth: 92,   // Same element - high compatibility
    water: 78,   // Compatible - water nourishes earth
    fire: 40,    // Challenging - fire scorches earth
    air: 38      // Challenging - air erodes earth
  },
  air: {
    air: 90,     // Same element - high compatibility
    fire: 80,    // Compatible - air feeds fire
    water: 42,   // Challenging - water dampens air
    earth: 38    // Challenging - earth grounds air
  },
  water: {
    water: 93,   // Same element - high compatibility
    earth: 78,   // Compatible - earth contains water
    air: 42,     // Challenging - air evaporates water
    fire: 35     // Challenging - fire evaporates water
  }
};

/**
 * Quality compatibility matrix
 * Cardinal, Fixed, and Mutable qualities interact differently
 */
const QUALITY_COMPATIBILITY: Record<string, Record<string, number>> = {
  cardinal: {
    cardinal: 85,  // Same quality - both are initiators
    fixed: 65,     // Moderate - cardinal initiates, fixed sustains
    mutable: 70    // Good - cardinal starts, mutable adapts
  },
  fixed: {
    fixed: 88,     // Same quality - both are stable
    cardinal: 65,  // Moderate - fixed resists cardinal's changes
    mutable: 60    // Challenging - fixed resists mutable's flexibility
  },
  mutable: {
    mutable: 82,   // Same quality - both are adaptable
    cardinal: 70,  // Good - mutable adapts to cardinal's leadership
    fixed: 60      // Challenging - mutable's change vs fixed's stability
  }
};

/**
 * Sign-specific pairing bonuses/penalties
 * Traditional astrological pairings that have special dynamics
 */
const SIGN_SPECIFIC_RULES: Record<ZodiacSign, Partial<Record<ZodiacSign, number>>> = {
  [ZodiacSign.ARIES]: {
    [ZodiacSign.LEO]: 10,        // Fire trine - excellent
    [ZodiacSign.SAGITTARIUS]: 10, // Fire trine - excellent
    [ZodiacSign.LIBRA]: -5,       // Opposition - tension
    [ZodiacSign.CANCER]: -8       // Square - challenging
  },
  [ZodiacSign.TAURUS]: {
    [ZodiacSign.VIRGO]: 10,       // Earth trine - excellent
    [ZodiacSign.CAPRICORN]: 10,   // Earth trine - excellent
    [ZodiacSign.SCORPIO]: -5,     // Opposition - tension
    [ZodiacSign.LEO]: -8          // Square - challenging
  },
  [ZodiacSign.GEMINI]: {
    [ZodiacSign.LIBRA]: 10,       // Air trine - excellent
    [ZodiacSign.AQUARIUS]: 10,    // Air trine - excellent
    [ZodiacSign.SAGITTARIUS]: -5, // Opposition - tension
    [ZodiacSign.VIRGO]: -8        // Square - challenging
  },
  [ZodiacSign.CANCER]: {
    [ZodiacSign.SCORPIO]: 10,     // Water trine - excellent
    [ZodiacSign.PISCES]: 10,      // Water trine - excellent
    [ZodiacSign.CAPRICORN]: -5,   // Opposition - tension
    [ZodiacSign.ARIES]: -8        // Square - challenging
  },
  [ZodiacSign.LEO]: {
    [ZodiacSign.ARIES]: 10,       // Fire trine - excellent
    [ZodiacSign.SAGITTARIUS]: 10, // Fire trine - excellent
    [ZodiacSign.AQUARIUS]: -5,    // Opposition - tension
    [ZodiacSign.TAURUS]: -8       // Square - challenging
  },
  [ZodiacSign.VIRGO]: {
    [ZodiacSign.TAURUS]: 10,      // Earth trine - excellent
    [ZodiacSign.CAPRICORN]: 10,   // Earth trine - excellent
    [ZodiacSign.PISCES]: -5,      // Opposition - tension
    [ZodiacSign.GEMINI]: -8       // Square - challenging
  },
  [ZodiacSign.LIBRA]: {
    [ZodiacSign.GEMINI]: 10,      // Air trine - excellent
    [ZodiacSign.AQUARIUS]: 10,    // Air trine - excellent
    [ZodiacSign.ARIES]: -5,       // Opposition - tension
    [ZodiacSign.CANCER]: -8       // Square - challenging
  },
  [ZodiacSign.SCORPIO]: {
    [ZodiacSign.CANCER]: 10,      // Water trine - excellent
    [ZodiacSign.PISCES]: 10,      // Water trine - excellent
    [ZodiacSign.TAURUS]: -5,      // Opposition - tension
    [ZodiacSign.LEO]: -8          // Square - challenging
  },
  [ZodiacSign.SAGITTARIUS]: {
    [ZodiacSign.ARIES]: 10,       // Fire trine - excellent
    [ZodiacSign.LEO]: 10,         // Fire trine - excellent
    [ZodiacSign.GEMINI]: -5,      // Opposition - tension
    [ZodiacSign.VIRGO]: -8        // Square - challenging
  },
  [ZodiacSign.CAPRICORN]: {
    [ZodiacSign.TAURUS]: 10,      // Earth trine - excellent
    [ZodiacSign.VIRGO]: 10,       // Earth trine - excellent
    [ZodiacSign.CANCER]: -5,      // Opposition - tension
    [ZodiacSign.LIBRA]: -8        // Square - challenging
  },
  [ZodiacSign.AQUARIUS]: {
    [ZodiacSign.GEMINI]: 10,      // Air trine - excellent
    [ZodiacSign.LIBRA]: 10,       // Air trine - excellent
    [ZodiacSign.LEO]: -5,         // Opposition - tension
    [ZodiacSign.SCORPIO]: -8      // Square - challenging
  },
  [ZodiacSign.PISCES]: {
    [ZodiacSign.CANCER]: 10,      // Water trine - excellent
    [ZodiacSign.SCORPIO]: 10,     // Water trine - excellent
    [ZodiacSign.VIRGO]: -5,       // Opposition - tension
    [ZodiacSign.SAGITTARIUS]: -8  // Square - challenging
  }
};

/**
 * Calculate element compatibility score between two zodiac signs
 * 
 * Element compatibility rules:
 * - Same element: 90-100 (high compatibility)
 * - Compatible elements (Fire+Air, Earth+Water): 70-85
 * - Neutral: 50-65
 * - Challenging: 30-45
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Element compatibility score (0-100)
 * 
 * @example
 * calculateElementScore(ZodiacSign.ARIES, ZodiacSign.LEO) // Returns 95 (both fire)
 * calculateElementScore(ZodiacSign.ARIES, ZodiacSign.GEMINI) // Returns 80 (fire + air)
 */
export function calculateElementScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const metadata1 = getZodiacMetadata(sign1);
  const metadata2 = getZodiacMetadata(sign2);
  
  const element1 = metadata1.element;
  const element2 = metadata2.element;
  
  return ELEMENT_COMPATIBILITY[element1][element2];
}

/**
 * Calculate quality compatibility score between two zodiac signs
 * 
 * Quality compatibility rules:
 * - Same quality: 80-90
 * - Compatible qualities: 60-75
 * - Challenging: 40-55
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Quality compatibility score (0-100)
 * 
 * @example
 * calculateQualityScore(ZodiacSign.ARIES, ZodiacSign.CANCER) // Returns 85 (both cardinal)
 * calculateQualityScore(ZodiacSign.TAURUS, ZodiacSign.LEO) // Returns 88 (both fixed)
 */
export function calculateQualityScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const metadata1 = getZodiacMetadata(sign1);
  const metadata2 = getZodiacMetadata(sign2);
  
  const quality1 = metadata1.quality;
  const quality2 = metadata2.quality;
  
  return QUALITY_COMPATIBILITY[quality1][quality2];
}

/**
 * Get sign-specific pairing adjustment
 * 
 * Returns bonus or penalty for specific zodiac pairings based on
 * traditional astrological aspects (trines, oppositions, squares)
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Adjustment value (-10 to +10)
 * 
 * @example
 * getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.LEO) // Returns 10 (fire trine)
 * getSignSpecificAdjustment(ZodiacSign.ARIES, ZodiacSign.CANCER) // Returns -8 (square)
 */
export function getSignSpecificAdjustment(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const adjustment1 = SIGN_SPECIFIC_RULES[sign1]?.[sign2] ?? 0;
  const adjustment2 = SIGN_SPECIFIC_RULES[sign2]?.[sign1] ?? 0;
  
  // Use the defined adjustment (they should be symmetric, but check both)
  return adjustment1 || adjustment2;
}

/**
 * Calculate overall compatibility score between two zodiac signs
 * 
 * Scoring formula:
 * - Element compatibility: 40% weight
 * - Quality compatibility: 30% weight
 * - Sign-specific rules: 30% base + adjustments
 * 
 * Final score is clamped to [0, 100] range
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Overall compatibility score (0-100)
 * 
 * @example
 * calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO) // Returns ~95 (excellent match)
 * calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.CANCER) // Returns ~45 (challenging)
 */
export function calculateOverallScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const elementScore = calculateElementScore(sign1, sign2);
  const qualityScore = calculateQualityScore(sign1, sign2);
  const signAdjustment = getSignSpecificAdjustment(sign1, sign2);
  
  // Weighted calculation
  const baseScore = (
    elementScore * 0.40 +
    qualityScore * 0.30 +
    60 * 0.30  // Base score for sign-specific component
  );
  
  // Apply sign-specific adjustment
  const finalScore = baseScore + signAdjustment;
  
  // Clamp to [0, 100] range
  return Math.max(0, Math.min(100, Math.round(finalScore)));
}

/**
 * Calculate detailed compatibility scores for all aspects
 * 
 * Returns scores for:
 * - Overall compatibility
 * - Communication (influenced by air element and mutable quality)
 * - Emotional connection (influenced by water element and cardinal quality)
 * - Long-term potential (influenced by earth element and fixed quality)
 * 
 * @param sign1 - First zodiac sign
 * @param sign2 - Second zodiac sign
 * @returns Object with all compatibility scores
 * 
 * @example
 * const scores = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
 * console.log(scores.overall); // 95
 * console.log(scores.communication); // 88
 */
export function calculateDetailedScores(
  sign1: ZodiacSign,
  sign2: ZodiacSign
): {
  overall: number;
  communication: number;
  emotional: number;
  longTerm: number;
} {
  const overall = calculateOverallScore(sign1, sign2);
  const elementScore = calculateElementScore(sign1, sign2);
  const qualityScore = calculateQualityScore(sign1, sign2);
  
  const metadata1 = getZodiacMetadata(sign1);
  const metadata2 = getZodiacMetadata(sign2);
  
  // Communication: Higher for air signs and mutable qualities
  const airBonus = (metadata1.element === 'air' || metadata2.element === 'air') ? 5 : 0;
  const mutableBonus = (metadata1.quality === 'mutable' || metadata2.quality === 'mutable') ? 5 : 0;
  const communication = Math.min(100, Math.round(
    overall * 0.7 + elementScore * 0.2 + qualityScore * 0.1 + airBonus + mutableBonus
  ));
  
  // Emotional: Higher for water signs and cardinal qualities
  const waterBonus = (metadata1.element === 'water' || metadata2.element === 'water') ? 5 : 0;
  const cardinalBonus = (metadata1.quality === 'cardinal' || metadata2.quality === 'cardinal') ? 5 : 0;
  const emotional = Math.min(100, Math.round(
    overall * 0.7 + elementScore * 0.2 + qualityScore * 0.1 + waterBonus + cardinalBonus
  ));
  
  // Long-term: Higher for earth signs and fixed qualities
  const earthBonus = (metadata1.element === 'earth' || metadata2.element === 'earth') ? 5 : 0;
  const fixedBonus = (metadata1.quality === 'fixed' || metadata2.quality === 'fixed') ? 5 : 0;
  const longTerm = Math.min(100, Math.round(
    overall * 0.7 + elementScore * 0.2 + qualityScore * 0.1 + earthBonus + fixedBonus
  ));
  
  return {
    overall,
    communication,
    emotional,
    longTerm
  };
}
