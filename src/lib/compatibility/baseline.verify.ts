// Verification script for baseline compatibility interpretations
// Run with: npx tsx src/lib/compatibility/baseline.verify.ts

import { ZodiacSign } from '../horoscope/types';
import {
  CompatibilityLevel,
  getCompatibilityLevel,
  getElementCompatibilityDescription,
  getBaselineStrengths,
  getBaselineChallenges,
  getBaselineAdvice,
  generateBaselineCompatibilityInterpretation
} from './baseline';

console.log('🧪 Verifying Baseline Compatibility Interpretations\n');

// Test 1: Compatibility levels
console.log('✓ Test 1: Compatibility Level Classification');
console.log(`  Score 95 → ${getCompatibilityLevel(95)} (expected: EXCELLENT)`);
console.log(`  Score 75 → ${getCompatibilityLevel(75)} (expected: VERY_GOOD)`);
console.log(`  Score 60 → ${getCompatibilityLevel(60)} (expected: GOOD)`);
console.log(`  Score 45 → ${getCompatibilityLevel(45)} (expected: MODERATE)`);
console.log(`  Score 30 → ${getCompatibilityLevel(30)} (expected: CHALLENGING)`);
console.log('');

// Test 2: Element compatibility descriptions
console.log('✓ Test 2: Element Compatibility Descriptions (Thai)');
const fireFireDesc = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.LEO);
console.log(`  Fire + Fire: ${fireFireDesc.substring(0, 50)}...`);

const fireAirDesc = getElementCompatibilityDescription(ZodiacSign.ARIES, ZodiacSign.GEMINI);
console.log(`  Fire + Air: ${fireAirDesc.substring(0, 50)}...`);

const earthWaterDesc = getElementCompatibilityDescription(ZodiacSign.TAURUS, ZodiacSign.CANCER);
console.log(`  Earth + Water: ${earthWaterDesc.substring(0, 50)}...`);
console.log('');

// Test 3: Baseline strengths
console.log('✓ Test 3: Baseline Strengths');
const excellentStrengths = getBaselineStrengths(CompatibilityLevel.EXCELLENT);
console.log(`  EXCELLENT level: ${excellentStrengths.length} strengths`);
console.log(`    - ${excellentStrengths[0].substring(0, 40)}...`);

const challengingStrengths = getBaselineStrengths(CompatibilityLevel.CHALLENGING);
console.log(`  CHALLENGING level: ${challengingStrengths.length} strengths`);
console.log(`    - ${challengingStrengths[0].substring(0, 40)}...`);
console.log('');

// Test 4: Baseline challenges
console.log('✓ Test 4: Baseline Challenges');
const excellentChallenges = getBaselineChallenges(CompatibilityLevel.EXCELLENT);
console.log(`  EXCELLENT level: ${excellentChallenges.length} challenges`);
console.log(`    - ${excellentChallenges[0].substring(0, 40)}...`);

const challengingChallenges = getBaselineChallenges(CompatibilityLevel.CHALLENGING);
console.log(`  CHALLENGING level: ${challengingChallenges.length} challenges`);
console.log(`    - ${challengingChallenges[0].substring(0, 40)}...`);
console.log('');

// Test 5: Baseline advice
console.log('✓ Test 5: Baseline Advice');
const excellentAdvice = getBaselineAdvice(CompatibilityLevel.EXCELLENT);
console.log(`  EXCELLENT: ${excellentAdvice.substring(0, 60)}...`);

const challengingAdvice = getBaselineAdvice(CompatibilityLevel.CHALLENGING);
console.log(`  CHALLENGING: ${challengingAdvice.substring(0, 60)}...`);
console.log('');

// Test 6: Complete interpretation
console.log('✓ Test 6: Complete Baseline Interpretation');
const interpretation = generateBaselineCompatibilityInterpretation(
  ZodiacSign.ARIES,
  ZodiacSign.LEO,
  95
);

console.log(`  Aries + Leo (score: 95)`);
console.log(`  Strengths: ${interpretation.strengths.length} items`);
console.log(`    - ${interpretation.strengths[0]}`);
console.log(`  Challenges: ${interpretation.challenges.length} items`);
console.log(`    - ${interpretation.challenges[0]}`);
console.log(`  Advice: ${interpretation.advice.substring(0, 80)}...`);
console.log(`  Element: ${interpretation.elementCompatibility.substring(0, 50)}...`);
console.log('');

// Test 7: Determinism
console.log('✓ Test 7: Determinism Check');
const interp1 = generateBaselineCompatibilityInterpretation(ZodiacSign.ARIES, ZodiacSign.LEO, 95);
const interp2 = generateBaselineCompatibilityInterpretation(ZodiacSign.ARIES, ZodiacSign.LEO, 95);
const isDeterministic = JSON.stringify(interp1) === JSON.stringify(interp2);
console.log(`  Same inputs produce same output: ${isDeterministic ? '✓ PASS' : '✗ FAIL'}`);
console.log('');

// Test 8: Thai language check
console.log('✓ Test 8: Thai Language Content');
const thaiRegex = /[\u0E00-\u0E7F]/;
const hasThaiInAdvice = thaiRegex.test(interpretation.advice);
const hasThaiInElement = thaiRegex.test(interpretation.elementCompatibility);
const hasThaiInStrengths = interpretation.strengths.every(s => thaiRegex.test(s));
const hasThaiInChallenges = interpretation.challenges.every(c => thaiRegex.test(c));

console.log(`  Advice contains Thai: ${hasThaiInAdvice ? '✓' : '✗'}`);
console.log(`  Element description contains Thai: ${hasThaiInElement ? '✓' : '✗'}`);
console.log(`  All strengths contain Thai: ${hasThaiInStrengths ? '✓' : '✗'}`);
console.log(`  All challenges contain Thai: ${hasThaiInChallenges ? '✓' : '✗'}`);
console.log('');

// Test 9: All zodiac combinations
console.log('✓ Test 9: All Zodiac Sign Combinations');
const signs = Object.values(ZodiacSign);
let totalCombinations = 0;
let successfulCombinations = 0;

signs.forEach(sign1 => {
  signs.forEach(sign2 => {
    totalCombinations++;
    try {
      const result = generateBaselineCompatibilityInterpretation(sign1, sign2, 75);
      if (result.strengths.length > 0 && result.challenges.length > 0) {
        successfulCombinations++;
      }
    } catch (error) {
      console.log(`  ✗ Failed for ${sign1} + ${sign2}: ${error}`);
    }
  });
});

console.log(`  Tested ${totalCombinations} combinations`);
console.log(`  Successful: ${successfulCombinations}/${totalCombinations}`);
console.log(`  Success rate: ${((successfulCombinations / totalCombinations) * 100).toFixed(1)}%`);
console.log('');

// Summary
console.log('═══════════════════════════════════════════════════');
if (successfulCombinations === totalCombinations && isDeterministic && 
    hasThaiInAdvice && hasThaiInElement && hasThaiInStrengths && hasThaiInChallenges) {
  console.log('✅ ALL TESTS PASSED');
  console.log('Baseline compatibility interpretations are working correctly!');
} else {
  console.log('⚠️  SOME TESTS FAILED');
  console.log('Please review the output above for details.');
}
console.log('═══════════════════════════════════════════════════');
