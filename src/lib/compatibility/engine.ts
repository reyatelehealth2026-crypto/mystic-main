// Compatibility Engine for REFFORTUNE
// Feature: popular-fortune-features
// Calculates love compatibility between two people based on birth dates

import { ZodiacSign } from '../horoscope/types';
import { calculateZodiacSign } from '../horoscope/zodiac';
import { CompatibilityInput, CompatibilityReading } from './types';
import { calculateDetailedScores } from './scoring';
import { generateBaselineCompatibilityInterpretation } from './baseline';

/**
 * Calculate compatibility between two people
 * 
 * This function:
 * 1. Auto-calculates zodiac signs from birth dates if not provided
 * 2. Calculates all compatibility scores (overall, communication, emotional, long-term)
 * 3. Generates baseline interpretation (strengths, challenges, advice)
 * 4. Returns complete compatibility reading
 * 
 * The calculation is deterministic - same zodiac signs always produce same scores.
 * 
 * @param input - Compatibility input with two birth dates and optional zodiac signs
 * @returns Promise resolving to complete compatibility reading
 * 
 * @example
 * const reading = await calculateCompatibility({
 *   person1: { birthDate: new Date('1990-04-15') },
 *   person2: { birthDate: new Date('1992-08-10') }
 * });
 * console.log(reading.overallScore); // e.g., 85
 * console.log(reading.strengths); // Array of strength descriptions
 */
export async function calculateCompatibility(
  input: CompatibilityInput
): Promise<CompatibilityReading> {
  // Auto-calculate zodiac signs if not provided
  const zodiacSign1 = input.person1.zodiacSign ?? calculateZodiacSign(input.person1.birthDate);
  const zodiacSign2 = input.person2.zodiacSign ?? calculateZodiacSign(input.person2.birthDate);

  // Calculate all compatibility scores
  const scores = calculateDetailedScores(zodiacSign1, zodiacSign2);

  // Generate baseline interpretation
  const baseline = generateBaselineCompatibilityInterpretation(
    zodiacSign1,
    zodiacSign2,
    scores.overall
  );

  // Construct complete compatibility reading
  const reading: CompatibilityReading = {
    person1: {
      birthDate: input.person1.birthDate,
      zodiacSign: zodiacSign1
    },
    person2: {
      birthDate: input.person2.birthDate,
      zodiacSign: zodiacSign2
    },
    overallScore: scores.overall,
    scores: {
      overall: scores.overall,
      communication: scores.communication,
      emotional: scores.emotional,
      longTerm: scores.longTerm
    },
    strengths: baseline.strengths,
    challenges: baseline.challenges,
    advice: baseline.advice,
    elementCompatibility: baseline.elementCompatibility
  };

  return reading;
}

/**
 * Get baseline compatibility reading (synchronous, deterministic)
 * 
 * This is the same as calculateCompatibility but returns immediately
 * without async operations. Useful for testing and when AI enhancement
 * is not needed.
 * 
 * @param input - Compatibility input with two birth dates and optional zodiac signs
 * @returns Complete compatibility reading
 * 
 * @example
 * const reading = getBaselineCompatibility({
 *   person1: { birthDate: new Date('1990-04-15') },
 *   person2: { birthDate: new Date('1992-08-10') }
 * });
 */
export function getBaselineCompatibility(
  input: CompatibilityInput
): CompatibilityReading {
  // Auto-calculate zodiac signs if not provided
  const zodiacSign1 = input.person1.zodiacSign ?? calculateZodiacSign(input.person1.birthDate);
  const zodiacSign2 = input.person2.zodiacSign ?? calculateZodiacSign(input.person2.birthDate);

  // Calculate all compatibility scores
  const scores = calculateDetailedScores(zodiacSign1, zodiacSign2);

  // Generate baseline interpretation
  const baseline = generateBaselineCompatibilityInterpretation(
    zodiacSign1,
    zodiacSign2,
    scores.overall
  );

  // Construct complete compatibility reading
  return {
    person1: {
      birthDate: input.person1.birthDate,
      zodiacSign: zodiacSign1
    },
    person2: {
      birthDate: input.person2.birthDate,
      zodiacSign: zodiacSign2
    },
    overallScore: scores.overall,
    scores: {
      overall: scores.overall,
      communication: scores.communication,
      emotional: scores.emotional,
      longTerm: scores.longTerm
    },
    strengths: baseline.strengths,
    challenges: baseline.challenges,
    advice: baseline.advice,
    elementCompatibility: baseline.elementCompatibility
  };
}
