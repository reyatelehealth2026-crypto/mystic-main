// Manual verification script for compatibility scoring
// Run with: npx tsx src/lib/compatibility/scoring.verify.ts

import { ZodiacSign } from '../horoscope/types';
import {
  calculateElementScore,
  calculateQualityScore,
  calculateOverallScore,
  calculateDetailedScores
} from './scoring';

console.log('=== Compatibility Scoring Verification ===\n');

// Test 1: Same element (Fire + Fire)
console.log('Test 1: Aries + Leo (Fire + Fire)');
const ariesLeoElement = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.LEO);
console.log(`  Element Score: ${ariesLeoElement} (expected: 90-100)`);
console.log(`  ✓ Pass: ${ariesLeoElement >= 90 && ariesLeoElement <= 100}\n`);

// Test 2: Compatible elements (Fire + Air)
console.log('Test 2: Aries + Gemini (Fire + Air)');
const ariesGeminiElement = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.GEMINI);
console.log(`  Element Score: ${ariesGeminiElement} (expected: 70-85)`);
console.log(`  ✓ Pass: ${ariesGeminiElement >= 70 && ariesGeminiElement <= 85}\n`);

// Test 3: Challenging elements (Fire + Water)
console.log('Test 3: Aries + Cancer (Fire + Water)');
const ariesCancerElement = calculateElementScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
console.log(`  Element Score: ${ariesCancerElement} (expected: 30-45)`);
console.log(`  ✓ Pass: ${ariesCancerElement >= 30 && ariesCancerElement <= 45}\n`);

// Test 4: Same quality
console.log('Test 4: Aries + Cancer (Both Cardinal)');
const ariesCancerQuality = calculateQualityScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
console.log(`  Quality Score: ${ariesCancerQuality} (expected: 80-90)`);
console.log(`  ✓ Pass: ${ariesCancerQuality >= 80 && ariesCancerQuality <= 90}\n`);

// Test 5: Overall score with fire trine
console.log('Test 5: Aries + Leo (Fire Trine)');
const ariesLeoOverall = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
console.log(`  Overall Score: ${ariesLeoOverall} (expected: >= 85)`);
console.log(`  ✓ Pass: ${ariesLeoOverall >= 85}\n`);

// Test 6: Overall score with square
console.log('Test 6: Aries + Cancer (Square)');
const ariesCancerOverall = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.CANCER);
console.log(`  Overall Score: ${ariesCancerOverall} (expected: <= 55)`);
console.log(`  ✓ Pass: ${ariesCancerOverall <= 55}\n`);

// Test 7: Detailed scores
console.log('Test 7: Detailed Scores for Aries + Leo');
const ariesLeoDetailed = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);
console.log(`  Overall: ${ariesLeoDetailed.overall}`);
console.log(`  Communication: ${ariesLeoDetailed.communication}`);
console.log(`  Emotional: ${ariesLeoDetailed.emotional}`);
console.log(`  Long-term: ${ariesLeoDetailed.longTerm}`);
console.log(`  ✓ All scores in range [0, 100]: ${
  ariesLeoDetailed.overall >= 0 && ariesLeoDetailed.overall <= 100 &&
  ariesLeoDetailed.communication >= 0 && ariesLeoDetailed.communication <= 100 &&
  ariesLeoDetailed.emotional >= 0 && ariesLeoDetailed.emotional <= 100 &&
  ariesLeoDetailed.longTerm >= 0 && ariesLeoDetailed.longTerm <= 100
}\n`);

// Test 8: Determinism
console.log('Test 8: Determinism Check');
const score1 = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
const score2 = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
console.log(`  First call: ${score1}`);
console.log(`  Second call: ${score2}`);
console.log(`  ✓ Pass: ${score1 === score2}\n`);

// Test 9: Symmetry
console.log('Test 9: Symmetry Check');
const scoreAB = calculateOverallScore(ZodiacSign.ARIES, ZodiacSign.LEO);
const scoreBA = calculateOverallScore(ZodiacSign.LEO, ZodiacSign.ARIES);
console.log(`  Aries + Leo: ${scoreAB}`);
console.log(`  Leo + Aries: ${scoreBA}`);
console.log(`  ✓ Pass: ${scoreAB === scoreBA}\n`);

// Test 10: All zodiac combinations
console.log('Test 10: All Zodiac Combinations');
const signs = Object.values(ZodiacSign);
let allValid = true;
let count = 0;
for (const sign1 of signs) {
  for (const sign2 of signs) {
    const score = calculateOverallScore(sign1, sign2);
    if (score < 0 || score > 100) {
      console.log(`  ✗ Invalid score for ${sign1} + ${sign2}: ${score}`);
      allValid = false;
    }
    count++;
  }
}
console.log(`  Tested ${count} combinations`);
console.log(`  ✓ All scores in range [0, 100]: ${allValid}\n`);

console.log('=== Verification Complete ===');
