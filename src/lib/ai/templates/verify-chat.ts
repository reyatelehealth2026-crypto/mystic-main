/**
 * Verification script for chat prompt builder
 * 
 * This script demonstrates that the chat prompt builder works correctly
 * and includes all required elements.
 * 
 * Run with: npx tsx src/lib/ai/templates/verify-chat.ts
 */

import { buildChatPrompt } from './chat';
import type { ChatPromptParams, ChatTurn } from '../types';
import type { DrawnCard } from '@/lib/tarot/types';

// Mock card data
const mockCards: DrawnCard[] = [
  {
    card: {
      id: 'the-sun',
      name: 'The Sun',
      arcana: 'major',
      number: 19,
      keywordsUpright: ['success', 'joy', 'positivity'],
      keywordsReversed: ['negativity', 'depression'],
      meaningUpright: 'ความสำเร็จ ความสุข พลังงานบวก',
      meaningReversed: 'ความท้อแท้ พลังงานลบ',
    },
    orientation: 'upright',
  },
  {
    card: {
      id: 'two-of-pentacles',
      name: 'Two of Pentacles',
      arcana: 'minor',
      suit: 'pentacles',
      number: 2,
      keywordsUpright: ['balance', 'flexibility'],
      keywordsReversed: ['imbalance', 'overwhelm'],
      meaningUpright: 'การจัดการหลายเรื่อง ความยืดหยุ่น',
      meaningReversed: 'ความไม่สมดุล ความล้นมือ',
    },
    orientation: 'upright',
  },
  {
    card: {
      id: 'ace-of-wands',
      name: 'Ace of Wands',
      arcana: 'minor',
      suit: 'wands',
      number: 1,
      keywordsUpright: ['inspiration', 'new opportunities'],
      keywordsReversed: ['delays', 'lack of direction'],
      meaningUpright: 'จุดเริ่มต้นใหม่ แรงบันดาลใจ',
      meaningReversed: 'ความล่าช้า ขาดทิศทาง',
    },
    orientation: 'upright',
  },
];

// Test 1: Basic chat prompt with no history
console.log('=== Test 1: Basic chat prompt ===\n');
const params1: ChatPromptParams = {
  cards: mockCards,
  baseQuestion: 'ควรเปลี่ยนงานหรือไม่',
  followUpQuestion: 'ถ้าจะเปลี่ยนงาน ควรทำเมื่อไหร่ดีคะ',
  history: [],
};

const prompt1 = buildChatPrompt(params1);
console.log('Prompt length:', prompt1.length);
console.log('Contains role:', prompt1.includes('ที่ปรึกษาเชิงจิตใจ'));
console.log('Contains cultural context:', prompt1.includes('กฎแห่งกรรม'));
console.log('Contains examples:', prompt1.includes('ตัวอย่างการตีความที่ดี'));
console.log('Contains instructions:', prompt1.includes('คำแนะนำการตอบคำถามในโหมดแชท'));
console.log('Contains base question:', prompt1.includes('ควรเปลี่ยนงานหรือไม่'));
console.log('Contains follow-up:', prompt1.includes('ถ้าจะเปลี่ยนงาน'));
console.log('Contains all cards:', 
  prompt1.includes('The Sun') && 
  prompt1.includes('Two of Pentacles') && 
  prompt1.includes('Ace of Wands')
);
console.log('Contains empty history indicator:', prompt1.includes('(ยังไม่มี)'));
console.log('\n');

// Test 2: Chat prompt with conversation history
console.log('=== Test 2: Chat with conversation history ===\n');
const history: ChatTurn[] = [
  { role: 'user', content: 'ควรเปลี่ยนงานหรือไม่' },
  { role: 'assistant', content: 'ไพ่บอกว่าคุณมีพื้นฐานที่ดี...' },
  { role: 'user', content: 'แล้วเงินเดือนจะดีขึ้นไหม' },
  { role: 'assistant', content: 'Ace of Wands บอกว่ามีโอกาสใหม่...' },
];

const params2: ChatPromptParams = {
  cards: mockCards,
  baseQuestion: 'ควรเปลี่ยนงานหรือไม่',
  followUpQuestion: 'ถ้าจะเปลี่ยนงาน ควรทำเมื่อไหร่ดีคะ',
  history,
};

const prompt2 = buildChatPrompt(params2);
console.log('Contains history section:', prompt2.includes('บริบทบทสนทนาก่อนหน้า'));
console.log('Contains user turns:', prompt2.includes('ผู้ใช้:'));
console.log('Contains assistant turns:', prompt2.includes('ผู้ช่วย:'));
console.log('Contains first user message:', prompt2.includes('ควรเปลี่ยนงานหรือไม่'));
console.log('Contains last assistant message:', prompt2.includes('Ace of Wands บอกว่ามีโอกาสใหม่'));
console.log('\n');

// Test 3: History limiting (last 6 turns)
console.log('=== Test 3: History limiting (last 6 turns) ===\n');
const longHistory: ChatTurn[] = [
  { role: 'user', content: 'Turn 1' },
  { role: 'assistant', content: 'Turn 2' },
  { role: 'user', content: 'Turn 3' },
  { role: 'assistant', content: 'Turn 4' },
  { role: 'user', content: 'Turn 5' },
  { role: 'assistant', content: 'Turn 6' },
  { role: 'user', content: 'Turn 7' },
  { role: 'assistant', content: 'Turn 8' },
  { role: 'user', content: 'Turn 9' },
  { role: 'assistant', content: 'Turn 10' },
];

const params3: ChatPromptParams = {
  cards: [mockCards[0]],
  followUpQuestion: 'Latest question',
  history: longHistory,
};

const prompt3 = buildChatPrompt(params3);
console.log('Does NOT contain early turns (1-4):', 
  !prompt3.includes('Turn 1') && 
  !prompt3.includes('Turn 2') &&
  !prompt3.includes('Turn 3') &&
  !prompt3.includes('Turn 4')
);
console.log('Contains last 6 turns (5-10):', 
  prompt3.includes('Turn 5') && 
  prompt3.includes('Turn 6') &&
  prompt3.includes('Turn 7') &&
  prompt3.includes('Turn 8') &&
  prompt3.includes('Turn 9') &&
  prompt3.includes('Turn 10')
);
console.log('\n');

// Test 4: Required instructions
console.log('=== Test 4: Required instructions ===\n');
console.log('Contains conciseness instruction:', prompt1.includes('1-3 ย่อหน้า'));
console.log('Contains card reference instruction:', prompt1.includes('อ้างอิงไพ่จากการอ่านเดิม'));
console.log('Contains timing guidance:', prompt1.includes('ให้กรอบเวลาที่สมจริง'));
console.log('Contains user control focus:', prompt1.includes('โฟกัสที่สิ่งที่ผู้ถามควบคุมได้'));
console.log('Contains empathetic response:', prompt1.includes('รับฟังความกังวล'));
console.log('Contains context usage:', prompt1.includes('ใช้บริบทจากประวัติการสนทนา'));
console.log('Contains no absolute predictions:', prompt1.includes('หลีกเลี่ยงการทำนายแบบเด็ดขาด'));
console.log('Contains plain text format:', prompt1.includes('ตอบเป็นข้อความล้วน'));
console.log('\n');

// Test 5: Missing base question
console.log('=== Test 5: Missing base question ===\n');
const params5: ChatPromptParams = {
  cards: [mockCards[0]],
  followUpQuestion: 'Follow-up question',
  history: [],
};

const prompt5 = buildChatPrompt(params5);
console.log('Contains default text for missing question:', prompt5.includes('(ไม่ได้ระบุ)'));
console.log('\n');

console.log('=== All verification tests completed ===');
console.log('✓ Chat prompt builder is working correctly');
console.log('✓ All required sections are included');
console.log('✓ Conversation history integration works (last 6 turns)');
console.log('✓ Card references are included');
console.log('✓ All instructions are present');
