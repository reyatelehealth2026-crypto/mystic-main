/**
 * Unit tests for Chat Prompt Builder
 * 
 * Tests verify that chat prompts include:
 * - Conversation history integration (last 6 turns)
 * - Card reference from original reading
 * - Concise response instructions (1-3 paragraphs)
 * - Empathetic and grounded guidance
 * - Focus on user's control and agency
 */

import { describe, it, expect } from '@jest/globals';
import { buildChatPrompt } from './chat';
import type { ChatPromptParams, ChatTurn } from '../types';
import type { DrawnCard } from '@/lib/tarot/types';

// Mock card data for testing
const mockCard1: DrawnCard = {
  card: {
    id: 'the-sun',
    name: 'The Sun',
    arcana: 'major',
    number: 19,
    keywordsUpright: ['success', 'joy', 'positivity'],
    keywordsReversed: ['negativity', 'depression'],
    meaningUpright: 'Success and happiness',
    meaningReversed: 'Negativity and sadness',
  },
  orientation: 'upright',
};

const mockCard2: DrawnCard = {
  card: {
    id: 'two-of-pentacles',
    name: 'Two of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 2,
    keywordsUpright: ['balance', 'flexibility', 'juggling'],
    keywordsReversed: ['imbalance', 'overwhelm'],
    meaningUpright: 'Managing multiple priorities',
    meaningReversed: 'Feeling overwhelmed',
  },
  orientation: 'upright',
};

const mockCard3: DrawnCard = {
  card: {
    id: 'ace-of-wands',
    name: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 1,
    keywordsUpright: ['inspiration', 'new opportunities'],
    keywordsReversed: ['delays', 'lack of direction'],
    meaningUpright: 'New creative opportunities',
    meaningReversed: 'Delays in new projects',
  },
  orientation: 'upright',
};

describe('buildChatPrompt', () => {
  it('should build a complete chat prompt with all required sections', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1, mockCard2, mockCard3],
      baseQuestion: 'Should I change careers?',
      followUpQuestion: 'When should I make the change?',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify prompt contains all required sections
    expect(prompt).toContain('ที่ปรึกษาเชิงจิตใจ'); // Role
    expect(prompt).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(prompt).toContain('ตัวอย่างการตีความที่ดี'); // Few-shot examples
    expect(prompt).toContain('คำแนะนำการตอบคำถามในโหมดแชท'); // Instructions
    expect(prompt).toContain('Should I change careers?'); // Base question
    expect(prompt).toContain('When should I make the change?'); // Follow-up question
  });

  it('should include all cards from original reading', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1, mockCard2, mockCard3],
      baseQuestion: 'Career question',
      followUpQuestion: 'Follow-up',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify all cards are included
    expect(prompt).toContain('The Sun');
    expect(prompt).toContain('Two of Pentacles');
    expect(prompt).toContain('Ace of Wands');
    expect(prompt).toContain('ตั้งตรง'); // Orientation
  });

  it('should include conversation history (last 6 turns)', () => {
    const history: ChatTurn[] = [
      { role: 'user', content: 'First question' },
      { role: 'assistant', content: 'First answer' },
      { role: 'user', content: 'Second question' },
      { role: 'assistant', content: 'Second answer' },
      { role: 'user', content: 'Third question' },
      { role: 'assistant', content: 'Third answer' },
    ];

    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Latest question',
      history,
    };

    const prompt = buildChatPrompt(params);

    // Verify history is included
    expect(prompt).toContain('บริบทบทสนทนาก่อนหน้า');
    expect(prompt).toContain('ผู้ใช้: First question');
    expect(prompt).toContain('ผู้ช่วย: First answer');
    expect(prompt).toContain('ผู้ใช้: Third question');
    expect(prompt).toContain('ผู้ช่วย: Third answer');
  });

  it('should limit conversation history to last 6 turns', () => {
    const history: ChatTurn[] = [
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

    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Latest question',
      history,
    };

    const prompt = buildChatPrompt(params);

    // Should NOT include early turns
    expect(prompt).not.toContain('Turn 1');
    expect(prompt).not.toContain('Turn 2');
    expect(prompt).not.toContain('Turn 3');
    expect(prompt).not.toContain('Turn 4');

    // Should include last 6 turns
    expect(prompt).toContain('Turn 5');
    expect(prompt).toContain('Turn 6');
    expect(prompt).toContain('Turn 7');
    expect(prompt).toContain('Turn 8');
    expect(prompt).toContain('Turn 9');
    expect(prompt).toContain('Turn 10');
  });

  it('should handle empty conversation history', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'First question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Should show empty history indicator
    expect(prompt).toContain('(ยังไม่มี)');
  });

  it('should include concise response instructions (1-3 paragraphs)', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify conciseness instructions
    expect(prompt).toContain('1-3 ย่อหน้า');
    expect(prompt).toContain('สั้นกระชับ');
    expect(prompt).toContain('เหมาะกับการสนทนา');
  });

  it('should include card reference instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify card reference instructions
    expect(prompt).toContain('อ้างอิงไพ่จากการอ่านเดิม');
    expect(prompt).toContain('ระบุชื่อไพ่');
    expect(prompt).toContain('เชื่อมโยงกลับไปยังการตีความเดิม');
  });

  it('should include timing guidance instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'When will this happen?',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify timing instructions
    expect(prompt).toContain('ให้กรอบเวลาที่สมจริง');
    expect(prompt).toContain('พลังงานของไพ่เป็นตัวบอกกรอบเวลา');
    expect(prompt).toContain('วัน สัปดาห์ เดือน');
  });

  it('should include focus on user control instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'What does he think?',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify user control focus
    expect(prompt).toContain('โฟกัสที่สิ่งที่ผู้ถามควบคุมได้');
    expect(prompt).toContain('นำกลับมาที่สิ่งที่ผู้ถามสามารถทำได้');
    expect(prompt).toContain('หลีกเลี่ยงการคาดเดาความรู้สึกของคนอื่น');
  });

  it('should include empathetic response instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: "I'm worried about this",
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify empathetic instructions
    expect(prompt).toContain('รับฟังความกังวล');
    expect(prompt).toContain('เข้าใจว่า');
    expect(prompt).toContain('ให้กำลังใจ');
  });

  it('should include conversation context usage instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [
        { role: 'user', content: 'Previous question' },
        { role: 'assistant', content: 'Previous answer' },
      ],
    };

    const prompt = buildChatPrompt(params);

    // Verify context usage instructions
    expect(prompt).toContain('ใช้บริบทจากประวัติการสนทนา');
    expect(prompt).toContain('ตอบให้สอดคล้องกับที่เคยพูดไปแล้ว');
    expect(prompt).toContain('จำบริบทการสนทนาได้');
  });

  it('should avoid absolute predictions in instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Will this definitely happen?',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify balanced guidance
    expect(prompt).toContain('หลีกเลี่ยงการทำนายแบบเด็ดขาด');
    expect(prompt).toContain('แนวโน้มและโอกาส');
    expect(prompt).toContain('อนาคตขึ้นกับการกระทำของผู้ถาม');
  });

  it('should handle missing base question gracefully', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Follow-up question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Should include default text for missing base question
    expect(prompt).toContain('(ไม่ได้ระบุ)');
    expect(prompt).toContain('Follow-up question');
  });

  it('should format card data correctly', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1, mockCard2],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify card formatting
    expect(prompt).toContain('1. The Sun (ตั้งตรง)');
    expect(prompt).toContain('2. Two of Pentacles (ตั้งตรง)');
    expect(prompt).toContain('จำนวนไพ่: 2');
  });

  it('should include Thai cultural context', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify Thai cultural elements
    expect(prompt).toContain('กฎแห่งกรรม'); // Karma
    expect(prompt).toContain('บุญ'); // Merit
    expect(prompt).toContain('สติ'); // Mindfulness
  });

  it('should specify plain text response format', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify response format instructions
    expect(prompt).toContain('ตอบเป็นข้อความล้วน');
    expect(prompt).toContain('plain text');
    expect(prompt).toContain('ไม่ใช่ JSON');
  });

  it('should include conversational tone instructions', () => {
    const params: ChatPromptParams = {
      cards: [mockCard1],
      followUpQuestion: 'Question',
      history: [],
    };

    const prompt = buildChatPrompt(params);

    // Verify conversational tone
    expect(prompt).toContain('เป็นกันเอง');
    expect(prompt).toContain('ไม่เป็นทางการเกินไป');
    expect(prompt).toContain('อบอุ่น');
  });
});
