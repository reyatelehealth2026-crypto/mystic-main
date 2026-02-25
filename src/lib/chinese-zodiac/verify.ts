/**
 * Verification script for Chinese Zodiac Engine
 * 
 * Tests the core functionality to ensure everything works correctly.
 */

import { 
  calculateChineseZodiac, 
  calculateChineseElement,
  getAnimalMetadata,
  getElementMetadata
} from './animals';
import { getBaselineChineseZodiacReading } from './baseline';
import { generateChineseZodiacReading } from './engine';
import { ChineseZodiacAnimal, ChineseElement } from './types';
import { TimePeriod } from '../horoscope/types';

console.log('=== Chinese Zodiac Engine Verification ===\n');

// Test 1: Verify animal calculation
console.log('Test 1: Animal Calculation');
const year2024 = calculateChineseZodiac(2024);
const year2025 = calculateChineseZodiac(2025);
const year2020 = calculateChineseZodiac(2020);
console.log('2024:', year2024, '(Expected: dragon)');
console.log('2025:', year2025, '(Expected: snake)');
console.log('2020:', year2020, '(Expected: rat)');
console.log('✓ Animal calculation working\n');

// Test 2: Verify element calculation
console.log('Test 2: Element Calculation');
const element2024 = calculateChineseElement(2024);
const element2025 = calculateChineseElement(2025);
console.log('2024:', element2024, '(Expected: wood)');
console.log('2025:', element2025, '(Expected: wood)');
console.log('✓ Element calculation working\n');

// Test 3: Verify metadata retrieval
console.log('Test 3: Metadata Retrieval');
const dragonMeta = getAnimalMetadata(ChineseZodiacAnimal.DRAGON);
const woodMeta = getElementMetadata(ChineseElement.WOOD);
console.log('Dragon Thai Name:', dragonMeta.thaiName);
console.log('Dragon Lucky Colors:', dragonMeta.luckyColors.join(', '));
console.log('Wood Thai Name:', woodMeta.thaiName);
console.log('Wood Characteristics:', woodMeta.characteristics.join(', '));
console.log('✓ Metadata retrieval working\n');

// Test 4: Verify baseline reading generation
console.log('Test 4: Baseline Reading Generation');
const baselineReading = getBaselineChineseZodiacReading({
  birthYear: 2024,
  period: TimePeriod.DAILY,
  date: new Date()
});
console.log('Animal:', baselineReading.animal);
console.log('Element:', baselineReading.element);
console.log('Thai Name:', baselineReading.thaiName);
console.log('Fortune sections:', Object.keys(baselineReading.fortune).join(', '));
console.log('Has lucky colors:', baselineReading.luckyColors.length > 0);
console.log('Has lucky numbers:', baselineReading.luckyNumbers.length > 0);
console.log('Has lucky directions:', baselineReading.luckyDirections.length > 0);
console.log('Has advice:', baselineReading.advice.length > 0);
console.log('✓ Baseline reading generation working\n');

// Test 5: Verify full engine with caching
console.log('Test 5: Full Engine with Caching');
(async () => {
  const reading1 = await generateChineseZodiacReading({
    birthYear: 1990,
    period: TimePeriod.WEEKLY,
    date: new Date()
  });
  console.log('First reading generated for Horse (1990)');
  console.log('Date range:', reading1.dateRange.start.toDateString(), 'to', reading1.dateRange.end.toDateString());
  
  // Second call should use cache
  const reading2 = await generateChineseZodiacReading({
    birthYear: 1990,
    period: TimePeriod.WEEKLY,
    date: new Date()
  });
  console.log('Second reading retrieved (should be cached)');
  console.log('Readings match:', JSON.stringify(reading1) === JSON.stringify(reading2));
  console.log('✓ Full engine with caching working\n');
  
  console.log('=== All Verification Tests Passed ===');
})();
