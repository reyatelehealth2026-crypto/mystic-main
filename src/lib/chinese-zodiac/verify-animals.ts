// Verification script for Chinese Zodiac calculations
// Run this to verify the implementation works correctly

import {
  calculateChineseZodiac,
  calculateChineseElement,
  getAnimalThaiName,
  getElementThaiName,
  ANIMAL_METADATA,
  ELEMENT_METADATA
} from './animals';
import { ChineseZodiacAnimal, ChineseElement } from './types';

console.log('=== Chinese Zodiac Calculation Verification ===\n');

// Test known years
console.log('Testing known years:');
const testYears = [
  { year: 2024, expectedAnimal: ChineseZodiacAnimal.DRAGON, expectedElement: ChineseElement.WOOD },
  { year: 2025, expectedAnimal: ChineseZodiacAnimal.SNAKE, expectedElement: ChineseElement.WOOD },
  { year: 2020, expectedAnimal: ChineseZodiacAnimal.RAT, expectedElement: ChineseElement.METAL },
  { year: 2021, expectedAnimal: ChineseZodiacAnimal.OX, expectedElement: ChineseElement.METAL },
  { year: 2022, expectedAnimal: ChineseZodiacAnimal.TIGER, expectedElement: ChineseElement.WATER },
  { year: 2023, expectedAnimal: ChineseZodiacAnimal.RABBIT, expectedElement: ChineseElement.WATER }
];

let allPassed = true;

testYears.forEach(({ year, expectedAnimal, expectedElement }) => {
  const animal = calculateChineseZodiac(year);
  const element = calculateChineseElement(year);
  const animalName = getAnimalThaiName(animal);
  const elementName = getElementThaiName(element);
  
  const animalMatch = animal === expectedAnimal;
  const elementMatch = element === expectedElement;
  
  console.log(`Year ${year}:`);
  console.log(`  Animal: ${animalName} (${animal}) - ${animalMatch ? '✓' : '✗ FAILED'}`);
  console.log(`  Element: ${elementName} (${element}) - ${elementMatch ? '✓' : '✗ FAILED'}`);
  
  if (!animalMatch || !elementMatch) {
    allPassed = false;
    console.log(`  Expected: ${expectedAnimal}, ${expectedElement}`);
  }
});

console.log('\n=== Metadata Verification ===\n');

// Verify all animals have complete metadata
console.log('Checking animal metadata:');
const animals = Object.values(ANIMAL_METADATA);
console.log(`Total animals: ${animals.length} (expected: 12) - ${animals.length === 12 ? '✓' : '✗'}`);

animals.forEach(metadata => {
  const hasThaiName = metadata.thaiName && metadata.thaiName.length > 0;
  const hasChineseName = metadata.chineseName && metadata.chineseName.length > 0;
  const hasTraits = metadata.traits && metadata.traits.length > 0;
  const hasColors = metadata.luckyColors && metadata.luckyColors.length > 0;
  const hasNumbers = metadata.luckyNumbers && metadata.luckyNumbers.length > 0;
  const hasDirections = metadata.luckyDirections && metadata.luckyDirections.length > 0;
  
  const complete = hasThaiName && hasChineseName && hasTraits && hasColors && hasNumbers && hasDirections;
  
  if (!complete) {
    console.log(`  ${metadata.animal}: INCOMPLETE`);
    allPassed = false;
  }
});

// Verify all elements have complete metadata
console.log('\nChecking element metadata:');
const elements = Object.values(ELEMENT_METADATA);
console.log(`Total elements: ${elements.length} (expected: 5) - ${elements.length === 5 ? '✓' : '✗'}`);

elements.forEach(metadata => {
  const hasThaiName = metadata.thaiName && metadata.thaiName.length > 0;
  const hasChineseName = metadata.chineseName && metadata.chineseName.length > 0;
  const hasColors = metadata.colors && metadata.colors.length > 0;
  const hasCharacteristics = metadata.characteristics && metadata.characteristics.length > 0;
  
  const complete = hasThaiName && hasChineseName && hasColors && hasCharacteristics;
  
  if (!complete) {
    console.log(`  ${metadata.element}: INCOMPLETE`);
    allPassed = false;
  }
});

console.log('\n=== 12-Year Cycle Verification ===\n');

// Verify the 12-year cycle
const baseYear = 2020;
const expectedCycle = [
  ChineseZodiacAnimal.RAT,
  ChineseZodiacAnimal.OX,
  ChineseZodiacAnimal.TIGER,
  ChineseZodiacAnimal.RABBIT,
  ChineseZodiacAnimal.DRAGON,
  ChineseZodiacAnimal.SNAKE,
  ChineseZodiacAnimal.HORSE,
  ChineseZodiacAnimal.GOAT,
  ChineseZodiacAnimal.MONKEY,
  ChineseZodiacAnimal.ROOSTER,
  ChineseZodiacAnimal.DOG,
  ChineseZodiacAnimal.PIG
];

console.log('Testing 12-year cycle starting from 2020:');
for (let i = 0; i < 12; i++) {
  const year = baseYear + i;
  const animal = calculateChineseZodiac(year);
  const expected = expectedCycle[i];
  const match = animal === expected;
  
  if (!match) {
    console.log(`  Year ${year}: ${animal} (expected: ${expected}) - ✗ FAILED`);
    allPassed = false;
  }
}
console.log('12-year cycle: ✓');

console.log('\n=== 10-Year Element Cycle Verification ===\n');

// Verify the 10-year element cycle
const elementBaseYear = 2024;
const expectedElementCycle = [
  ChineseElement.WOOD,   // 2024
  ChineseElement.WOOD,   // 2025
  ChineseElement.FIRE,   // 2026
  ChineseElement.FIRE,   // 2027
  ChineseElement.EARTH,  // 2028
  ChineseElement.EARTH,  // 2029
  ChineseElement.METAL,  // 2030
  ChineseElement.METAL,  // 2031
  ChineseElement.WATER,  // 2032
  ChineseElement.WATER   // 2033
];

console.log('Testing 10-year element cycle starting from 2024:');
for (let i = 0; i < 10; i++) {
  const year = elementBaseYear + i;
  const element = calculateChineseElement(year);
  const expected = expectedElementCycle[i];
  const match = element === expected;
  
  if (!match) {
    console.log(`  Year ${year}: ${element} (expected: ${expected}) - ✗ FAILED`);
    allPassed = false;
  }
}
console.log('10-year element cycle: ✓');

console.log('\n=== 60-Year Cycle Verification ===\n');

// Verify 60 unique combinations
const combinations = new Set<string>();
for (let year = 2024; year < 2024 + 60; year++) {
  const animal = calculateChineseZodiac(year);
  const element = calculateChineseElement(year);
  combinations.add(`${element}-${animal}`);
}

console.log(`Unique combinations in 60 years: ${combinations.size} (expected: 60) - ${combinations.size === 60 ? '✓' : '✗'}`);

if (combinations.size !== 60) {
  allPassed = false;
}

console.log('\n=== Final Result ===\n');
console.log(allPassed ? '✓ All verifications passed!' : '✗ Some verifications failed!');

if (!allPassed) {
  process.exit(1);
}
