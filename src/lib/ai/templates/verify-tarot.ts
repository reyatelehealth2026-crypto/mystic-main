/**
 * Quick verification script for tarot prompt builder
 * Run with: npx tsx src/lib/ai/templates/verify-tarot.ts
 */

import { buildTarotPrompt } from './tarot';
import type { TarotPromptParams } from '../types';

// Simple test case
const testParams: TarotPromptParams = {
  cards: [
    {
      card: {
        id: 'the-fool',
        name: 'The Fool',
        arcana: 'major',
        number: 0,
        keywordsUpright: ['new beginnings', 'innocence'],
        keywordsReversed: ['recklessness', 'fear'],
        meaningUpright: 'New beginnings and adventures',
        meaningReversed: 'Recklessness or fear of change',
      },
      orientation: 'upright',
    },
  ],
  count: 1,
  question: 'What should I focus on today?',
  spreadType: 1,
};

console.log('Building tarot prompt...\n');
const prompt = buildTarotPrompt(testParams);

// Verify key sections are present
const checks = [
  { name: 'Role definition', pattern: 'ผู้อ่านไพ่ทาโรต์' },
  { name: 'Buddhist philosophy', pattern: 'กฎแห่งกรรม' },
  { name: 'Few-shot examples', pattern: 'ตัวอย่างการตีความที่ดี' },
  { name: 'Instructions', pattern: 'คำแนะนำการตีความไพ่' },
  { name: 'User question', pattern: 'What should I focus on today?' },
  { name: 'Card name', pattern: 'The Fool' },
  { name: 'Orientation', pattern: 'ตั้งตรง' },
  { name: 'JSON structure', pattern: 'summary' },
  { name: 'Card structure', pattern: 'cardStructure' },
  { name: 'Three sections', pattern: 'ภาพรวมสถานการณ์' },
  { name: 'Warnings section', pattern: 'จุดที่ควรระวัง' },
  { name: 'Actions section', pattern: 'แนวทางที่ควรทำ' },
  { name: 'Major Arcana emphasis', pattern: 'เมเจอร์อาร์คานา' },
  { name: 'Actionable guidance', pattern: 'คำแนะนำที่นำไปปฏิบัติได้' },
  { name: 'Card relationships', pattern: 'ความสัมพันธ์ระหว่างไพ่' },
];

console.log('Verification Results:');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const found = prompt.includes(check.pattern);
  const status = found ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} - ${check.name}`);
  if (found) passed++;
  else failed++;
});

console.log('='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n✓ All checks passed! The tarot prompt builder is working correctly.');
} else {
  console.log('\n✗ Some checks failed. Review the implementation.');
}

// Optionally print the full prompt
if (process.argv.includes('--verbose')) {
  console.log('\n\nFull Prompt:');
  console.log('='.repeat(50));
  console.log(prompt);
}
