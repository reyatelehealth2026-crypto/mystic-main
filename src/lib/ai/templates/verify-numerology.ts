/**
 * Verification script for numerology prompt builder
 * 
 * This script tests the buildNumerologyPrompt function with sample data
 * to ensure it generates valid prompts with all required sections.
 */

import { buildNumerologyPrompt } from './numerology';
import type { NumerologyPromptParams } from '@/lib/ai/types';

// Test case 1: High score phone number
const highScoreParams: NumerologyPromptParams = {
  normalizedPhone: '0812345678',
  score: 87,
  tier: 'ดีมาก',
  total: 45,
  root: 9,
  themes: {
    work: 'ก้าวหน้า มีโอกาสดี',
    money: 'มั่นคง เงินไหลเวียน',
    relationship: 'ราบรื่น เป็นที่รัก',
    caution: 'อย่าประมาท'
  }
};

// Test case 2: Low score phone number
const lowScoreParams: NumerologyPromptParams = {
  normalizedPhone: '0897774444',
  score: 32,
  tier: 'ปานกลาง-ต่ำ',
  total: 54,
  root: 9,
  themes: {
    work: 'ต้องใช้ความพยายามมาก มีอุปสรรค',
    money: 'ไม่มั่นคง ต้องระมัดระวังการใช้จ่าย',
    relationship: 'มีความขัดแย้ง ต้องใช้ความอดทน',
    caution: 'หลีกเลี่ยงการตัดสินใจใหญ่ ระวังคนหลอกลวง'
  }
};

// Test case 3: Medium score phone number
const mediumScoreParams: NumerologyPromptParams = {
  normalizedPhone: '0891234567',
  score: 65,
  tier: 'ดี',
  total: 44,
  root: 8,
  themes: {
    work: 'มีโอกาสพอสมควร ต้องใช้ความพยายาม',
    money: 'ค่อนข้างมั่นคง มีรายได้สม่ำเสมอ',
    relationship: 'ปานกลาง ต้องดูแลรักษา',
    caution: 'ระวังการใช้จ่ายฟุ่มเฟือย'
  }
};

console.log('=== Testing Numerology Prompt Builder ===\n');

// Test high score
console.log('Test 1: High Score (87/99)');
console.log('----------------------------');
const highScorePrompt = buildNumerologyPrompt(highScoreParams);
console.log(`Prompt length: ${highScorePrompt.length} characters`);
console.log(`Contains role: ${highScorePrompt.includes('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย')}`);
console.log(`Contains cultural context: ${highScorePrompt.includes('กฎแห่งกรรม')}`);
console.log(`Contains few-shot examples: ${highScorePrompt.includes('ตัวอย่างการตีความที่ดี')}`);
console.log(`Contains instructions: ${highScorePrompt.includes('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์')}`);
console.log(`Contains user data: ${highScorePrompt.includes('0812345678')}`);
console.log(`Contains high score framing: ${highScorePrompt.includes('คะแนนสูง')}`);
console.log(`Contains root number: ${highScorePrompt.includes('เลขราก: 9')}`);
console.log();

// Test low score
console.log('Test 2: Low Score (32/99)');
console.log('----------------------------');
const lowScorePrompt = buildNumerologyPrompt(lowScoreParams);
console.log(`Prompt length: ${lowScorePrompt.length} characters`);
console.log(`Contains role: ${lowScorePrompt.includes('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย')}`);
console.log(`Contains cultural context: ${lowScorePrompt.includes('กฎแห่งกรรม')}`);
console.log(`Contains few-shot examples: ${lowScorePrompt.includes('ตัวอย่างการตีความที่ดี')}`);
console.log(`Contains instructions: ${lowScorePrompt.includes('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์')}`);
console.log(`Contains user data: ${lowScorePrompt.includes('0897774444')}`);
console.log(`Contains low score framing: ${lowScorePrompt.includes('คะแนนต่ำ')}`);
console.log(`Contains constructive guidance: ${lowScorePrompt.includes('สร้างสรรค์')}`);
console.log();

// Test medium score
console.log('Test 3: Medium Score (65/99)');
console.log('----------------------------');
const mediumScorePrompt = buildNumerologyPrompt(mediumScoreParams);
console.log(`Prompt length: ${mediumScorePrompt.length} characters`);
console.log(`Contains role: ${mediumScorePrompt.includes('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย')}`);
console.log(`Contains cultural context: ${mediumScorePrompt.includes('กฎแห่งกรรม')}`);
console.log(`Contains few-shot examples: ${mediumScorePrompt.includes('ตัวอย่างการตีความที่ดี')}`);
console.log(`Contains instructions: ${mediumScorePrompt.includes('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์')}`);
console.log(`Contains user data: ${mediumScorePrompt.includes('0891234567')}`);
console.log(`Contains medium score framing: ${mediumScorePrompt.includes('คะแนนปานกลาง')}`);
console.log();

// Verify section ordering (role → cultural → examples → instructions → user data)
console.log('Test 4: Section Ordering');
console.log('----------------------------');
const testPrompt = highScorePrompt;
const roleIndex = testPrompt.indexOf('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย');
const culturalIndex = testPrompt.indexOf('กฎแห่งกรรม');
const examplesIndex = testPrompt.indexOf('ตัวอย่างการตีความที่ดี');
const instructionsIndex = testPrompt.indexOf('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์');
const userDataIndex = testPrompt.indexOf('ข้อมูลการวิเคราะห์เบอร์โทรศัพท์');

console.log(`Role position: ${roleIndex}`);
console.log(`Cultural context position: ${culturalIndex}`);
console.log(`Examples position: ${examplesIndex}`);
console.log(`Instructions position: ${instructionsIndex}`);
console.log(`User data position: ${userDataIndex}`);
console.log(`Correct order: ${roleIndex < culturalIndex && culturalIndex < examplesIndex && examplesIndex < instructionsIndex && instructionsIndex < userDataIndex}`);
console.log();

console.log('=== All Tests Completed ===');
