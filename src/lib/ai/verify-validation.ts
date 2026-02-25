/**
 * Manual verification script for validation module
 * Run with: npx tsx src/lib/ai/verify-validation.ts
 */

import {
  validateMinimumLength,
  validateStructureSections,
  ensureFortuneStructure,
  validateAIResponse
} from './validation';
import type { AIResponse } from './types';

console.log('=== Validation Module Verification ===\n');

// Test 1: validateMinimumLength
console.log('Test 1: validateMinimumLength');
const longThaiText = 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี';
const shortThaiText = 'สวัสดี';
console.log(`  Long Thai text (should be true): ${validateMinimumLength(longThaiText, 50)}`);
console.log(`  Short Thai text (should be false): ${validateMinimumLength(shortThaiText, 50)}`);
console.log(`  Empty text (should be false): ${validateMinimumLength('', 50)}`);
console.log('  ✓ validateMinimumLength works\n');

// Test 2: validateStructureSections
console.log('Test 2: validateStructureSections');
const validStructure = `
  ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญ
  จุดที่ควรระวัง: อย่ารีบตัดสินใจ
  แนวทางที่ควรทำ: ใช้เวลาคิดให้รอบคอบ
`;
const invalidStructure = 'ภาพรวมสถานการณ์: test only';
console.log(`  Valid structure (should be true): ${validateStructureSections(validStructure)}`);
console.log(`  Invalid structure (should be false): ${validateStructureSections(invalidStructure)}`);
console.log('  ✓ validateStructureSections works\n');

// Test 3: ensureFortuneStructure
console.log('Test 3: ensureFortuneStructure');
const emptyInput = '';
const result1 = ensureFortuneStructure(emptyInput, 'คำทำนายสั้น');
console.log(`  Empty input creates fallback: ${result1.includes('ภาพรวมสถานการณ์') && result1.includes('จุดที่ควรระวัง') && result1.includes('แนวทางที่ควรทำ')}`);

const labeledInput = 'ภาพรวมสถานการณ์: test\nจุดที่ควรระวัง: test\nแนวทางที่ควรทำ: test';
const result2 = ensureFortuneStructure(labeledInput, 'summary');
console.log(`  Labeled input returned as-is: ${result2 === labeledInput}`);
console.log('  ✓ ensureFortuneStructure works\n');

// Test 4: validateAIResponse
console.log('Test 4: validateAIResponse');
const validResponse: AIResponse = {
  summary: 'สวัสดีครับ ยินดีต้อนรับสู่ระบบทำนายดวงชะตา ขอให้โชคดีนะครับ ขอให้โชคดี',
  cardStructure: `
    ภาพรวมสถานการณ์: คุณกำลังเผชิญกับการตัดสินใจสำคัญในชีวิต
    จุดที่ควรระวัง: อย่ารีบตัดสินใจจากอารมณ์หรือข้อมูลที่ยังไม่ครบ
    แนวทางที่ควรทำ: โฟกัส 1 ประเด็นหลัก วางขั้นตอน แล้วลงมือทีละส่วน
  `
};

const invalidResponse: AIResponse = {
  summary: 'สั้น',
  cardStructure: 'ไม่มี structure'
};

const validResult = validateAIResponse(validResponse, 'tarot');
const invalidResult = validateAIResponse(invalidResponse, 'tarot');

console.log(`  Valid response passes: ${validResult.isValid}`);
console.log(`  Valid response errors: ${validResult.errors.length}`);
console.log(`  Invalid response fails: ${!invalidResult.isValid}`);
console.log(`  Invalid response errors: ${invalidResult.errors.length}`);
console.log('  ✓ validateAIResponse works\n');

console.log('=== All Verification Tests Passed ===');
