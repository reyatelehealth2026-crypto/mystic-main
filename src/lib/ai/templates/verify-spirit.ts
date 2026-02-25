/**
 * Manual verification script for spirit card prompt builder
 * Run with: npx tsx src/lib/ai/templates/verify-spirit.ts
 */

import { buildSpiritPrompt } from './spirit';
import type { SpiritPromptParams } from '../types';

// Test data
const testCard: SpiritPromptParams['card'] = {
  id: 'the-empress',
  name: 'The Empress',
  arcana: 'major',
  number: 3,
  keywordsUpright: ['abundance', 'nurturing', 'creativity'],
  keywordsReversed: ['dependence', 'smothering', 'emptiness'],
  meaningUpright: 'ความอุดมสมบูรณ์ การเลี้ยงดู ความคิดสร้างสรรค์ ความอบอุ่น',
  meaningReversed: 'การพึ่งพา การให้มากเกินไป ความว่างเปล่า',
};

console.log('=== Testing Spirit Card Prompt Builder ===\n');

// Test 1: Upright orientation
console.log('Test 1: Upright Spirit Card');
console.log('----------------------------');
const uprightParams: SpiritPromptParams = {
  card: testCard,
  orientation: 'upright',
  lifePathNumber: 9,
  dob: '15/03/1990',
};

try {
  const uprightPrompt = buildSpiritPrompt(uprightParams);
  console.log('✓ Upright prompt generated successfully');
  console.log(`  Length: ${uprightPrompt.length} characters`);
  
  // Check for required sections
  const checks = [
    { name: 'Role section', text: 'ผู้เชี่ยวชาญด้านไพ่ทาโรต์' },
    { name: 'Buddhist philosophy', text: 'กฎแห่งกรรม' },
    { name: 'Numerology beliefs', text: 'เลขมงคล' },
    { name: 'Few-shot examples', text: 'ตัวอย่างการตีความที่ดี' },
    { name: 'Instructions', text: 'คำแนะนำการตีความไพ่ประจำตัว' },
    { name: 'Life path connection', text: 'การเชื่อมโยงเลขเส้นทางชีวิตกับไพ่' },
    { name: 'Upright instructions', text: 'ไพ่ตั้งตรง' },
    { name: 'User data', text: '15/03/1990' },
    { name: 'Card name', text: 'The Empress' },
    { name: 'Orientation', text: 'ตั้งตรง' },
  ];
  
  checks.forEach(check => {
    if (uprightPrompt.includes(check.text)) {
      console.log(`  ✓ Contains ${check.name}`);
    } else {
      console.log(`  ✗ Missing ${check.name}`);
    }
  });
  
  console.log('\n');
} catch (error) {
  console.error('✗ Error generating upright prompt:', error);
}

// Test 2: Reversed orientation
console.log('Test 2: Reversed Spirit Card');
console.log('-----------------------------');
const reversedParams: SpiritPromptParams = {
  card: testCard,
  orientation: 'reversed',
  lifePathNumber: 4,
  dob: '22/11/1988',
};

try {
  const reversedPrompt = buildSpiritPrompt(reversedParams);
  console.log('✓ Reversed prompt generated successfully');
  console.log(`  Length: ${reversedPrompt.length} characters`);
  
  // Check for reversed-specific sections
  const checks = [
    { name: 'Reversed instructions', text: 'ไพ่กลับหัว' },
    { name: 'Shadow aspect', text: 'ด้านเงา' },
    { name: 'Growth areas', text: 'จุดที่ต้องพัฒนา' },
    { name: 'User data', text: '22/11/1988' },
    { name: 'Reversed orientation', text: 'กลับหัว' },
  ];
  
  checks.forEach(check => {
    if (reversedPrompt.includes(check.text)) {
      console.log(`  ✓ Contains ${check.name}`);
    } else {
      console.log(`  ✗ Missing ${check.name}`);
    }
  });
  
  console.log('\n');
} catch (error) {
  console.error('✗ Error generating reversed prompt:', error);
}

console.log('=== Verification Complete ===');
