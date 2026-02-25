// Manual verification script for compatibility engine
// Run with: node --loader ts-node/esm src/lib/compatibility/engine.verify.ts

import { calculateCompatibility, getBaselineCompatibility } from './engine';
import { ZodiacSign } from '../horoscope/types';

async function verify() {
  console.log('🧪 Verifying Compatibility Engine Implementation\n');

  // Test 1: Auto-calculate zodiac signs
  console.log('Test 1: Auto-calculate zodiac signs from birth dates');
  const test1 = await calculateCompatibility({
    person1: { birthDate: new Date('1990-04-15') }, // Aries
    person2: { birthDate: new Date('1992-08-10') }  // Leo
  });
  console.log(`✓ Person 1: ${test1.person1.zodiacSign} (expected: aries)`);
  console.log(`✓ Person 2: ${test1.person2.zodiacSign} (expected: leo)`);
  console.log(`✓ Overall Score: ${test1.overallScore}/100\n`);

  // Test 2: All score categories present
  console.log('Test 2: All score categories calculated');
  console.log(`✓ Overall: ${test1.scores.overall}`);
  console.log(`✓ Communication: ${test1.scores.communication}`);
  console.log(`✓ Emotional: ${test1.scores.emotional}`);
  console.log(`✓ Long-term: ${test1.scores.longTerm}\n`);

  // Test 3: Interpretation completeness
  console.log('Test 3: Complete interpretation generated');
  console.log(`✓ Strengths: ${test1.strengths.length} items`);
  console.log(`  - ${test1.strengths[0]}`);
  console.log(`✓ Challenges: ${test1.challenges.length} items`);
  console.log(`  - ${test1.challenges[0]}`);
  console.log(`✓ Advice: ${test1.advice.substring(0, 50)}...`);
  console.log(`✓ Element Compatibility: ${test1.elementCompatibility.substring(0, 50)}...\n`);

  // Test 4: Deterministic baseline
  console.log('Test 4: Baseline compatibility is deterministic');
  const baseline1 = getBaselineCompatibility({
    person1: { birthDate: new Date('1990-04-15') },
    person2: { birthDate: new Date('1992-08-10') }
  });
  const baseline2 = getBaselineCompatibility({
    person1: { birthDate: new Date('1990-04-15') },
    person2: { birthDate: new Date('1992-08-10') }
  });
  console.log(`✓ Score consistency: ${baseline1.overallScore === baseline2.overallScore ? 'PASS' : 'FAIL'}`);
  console.log(`✓ Interpretation consistency: ${baseline1.advice === baseline2.advice ? 'PASS' : 'FAIL'}\n`);

  // Test 5: Known pairing - Fire trine (should be high)
  console.log('Test 5: Fire trine compatibility (Aries + Leo)');
  const fireTrine = await calculateCompatibility({
    person1: { birthDate: new Date('1990-04-15') }, // Aries
    person2: { birthDate: new Date('1992-08-10') }  // Leo
  });
  console.log(`✓ Score: ${fireTrine.overallScore}/100 (expected: 85+)`);
  console.log(`✓ High compatibility: ${fireTrine.overallScore >= 85 ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Challenging pairing (should be lower)
  console.log('Test 6: Challenging compatibility (Aries + Cancer)');
  const challenging = await calculateCompatibility({
    person1: { birthDate: new Date('1990-04-15') }, // Aries
    person2: { birthDate: new Date('1992-07-10') }  // Cancer
  });
  console.log(`✓ Score: ${challenging.overallScore}/100 (expected: <70)`);
  console.log(`✓ Lower compatibility: ${challenging.overallScore < 70 ? 'PASS' : 'FAIL'}\n`);

  // Test 7: Manual zodiac override
  console.log('Test 7: Manual zodiac sign override');
  const override = await calculateCompatibility({
    person1: { 
      birthDate: new Date('1990-04-15'),
      zodiacSign: ZodiacSign.TAURUS // Override from Aries
    },
    person2: { 
      birthDate: new Date('1992-08-10'),
      zodiacSign: ZodiacSign.VIRGO // Override from Leo
    }
  });
  console.log(`✓ Person 1: ${override.person1.zodiacSign} (expected: taurus)`);
  console.log(`✓ Person 2: ${override.person2.zodiacSign} (expected: virgo)`);
  console.log(`✓ Override works: ${override.person1.zodiacSign === ZodiacSign.TAURUS ? 'PASS' : 'FAIL'}\n`);

  console.log('✅ All verification tests completed!');
}

// Run verification
verify().catch(console.error);
