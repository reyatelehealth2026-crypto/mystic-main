/**
 * Unit tests for Tarot Prompt Builder
 * 
 * Run with: npm test (once Jest is configured)
 */

import { describe, it, expect } from '@jest/globals';
import { buildTarotPrompt } from './tarot';
import type { TarotPromptParams } from '../types';
import type { DrawnCard } from '@/lib/tarot/types';

// Mock card data for testing
const mockCard1: DrawnCard = {
  card: {
    id: 'the-fool',
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    keywordsUpright: ['new beginnings', 'innocence', 'adventure'],
    keywordsReversed: ['recklessness', 'fear', 'holding back'],
    meaningUpright: 'New beginnings and adventures',
    meaningReversed: 'Recklessness or fear of change',
  },
  orientation: 'upright',
};

const mockCard2: DrawnCard = {
  card: {
    id: 'two-of-cups',
    name: 'Two of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 2,
    keywordsUpright: ['partnership', 'love', 'harmony'],
    keywordsReversed: ['imbalance', 'broken relationship'],
    meaningUpright: 'Partnership and harmony',
    meaningReversed: 'Relationship imbalance',
  },
  orientation: 'reversed',
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

describe('buildTarotPrompt', () => {
  it('should build a complete prompt for 1-card spread', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      question: 'What should I focus on today?',
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify prompt contains all required sections
    expect(prompt).toContain('ผู้อ่านไพ่ทาโรต์'); // Role
    expect(prompt).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(prompt).toContain('ตัวอย่างการตีความที่ดี'); // Few-shot examples
    expect(prompt).toContain('คำแนะนำการตีความไพ่'); // Instructions
    expect(prompt).toContain('What should I focus on today?'); // User question
    expect(prompt).toContain('The Fool'); // Card name
    expect(prompt).toContain('ตั้งตรง'); // Orientation
  });

  it('should build a complete prompt for 3-card spread', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1, mockCard2, mockCard3],
      count: 3,
      question: 'Should I change careers?',
      spreadType: 3,
    };

    const prompt = buildTarotPrompt(params);

    // Verify 3-card specific instructions
    expect(prompt).toContain('Past-Present-Future');
    expect(prompt).toContain('อดีต');
    expect(prompt).toContain('ปัจจุบัน');
    expect(prompt).toContain('อนาคต');
    expect(prompt).toContain('narrative flow');
    
    // Verify all cards are included
    expect(prompt).toContain('The Fool');
    expect(prompt).toContain('Two of Cups');
    expect(prompt).toContain('Ace of Wands');
  });

  it('should include reversed card instructions when cards are reversed', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1, mockCard2], // mockCard2 is reversed
      count: 2,
      spreadType: 3,
    };

    const prompt = buildTarotPrompt(params);

    // Verify reversed card instructions are present
    expect(prompt).toContain('ไพ่กลับหัว');
    expect(prompt).toContain('Reversed Cards');
    expect(prompt).toContain('shadow aspect');
    expect(prompt).toContain('กลับหัว'); // Orientation marker
  });

  it('should include Major Arcana emphasis when Major Arcana cards are present', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1], // The Fool is Major Arcana
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify Major Arcana instructions are present
    expect(prompt).toContain('เมเจอร์อาร์คานา');
    expect(prompt).toContain('Major Arcana');
    expect(prompt).toContain('ธีมชีวิตใหญ่');
  });

  it('should handle missing question gracefully', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Should include default text for missing question
    expect(prompt).toContain('(ไม่ได้ระบุคำถาม)');
  });

  it('should include actionable guidance instructions', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify actionable guidance instructions
    expect(prompt).toContain('คำแนะนำที่นำไปปฏิบัติได้');
    expect(prompt).toContain('ขั้นตอนที่ชัดเจน');
    expect(prompt).toContain('กรอบเวลา');
  });

  it('should include card relationship analysis instructions', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1, mockCard2, mockCard3],
      count: 3,
      spreadType: 3,
    };

    const prompt = buildTarotPrompt(params);

    // Verify card relationship instructions
    expect(prompt).toContain('ความสัมพันธ์ระหว่างไพ่');
    expect(prompt).toContain('ไพ่แต่ละใบเชื่อมโยงกัน');
  });

  it('should include symbolism and archetypal meaning instructions', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify symbolism instructions
    expect(prompt).toContain('สัญลักษณ์และความหมายเชิงลึก');
    expect(prompt).toContain('archetypal meanings');
  });

  it('should avoid absolute predictions in instructions', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify balanced guidance instructions
    expect(prompt).toContain('สมดุลระหว่างความหวังและความจริง');
    expect(prompt).toContain('หลีกเลี่ยงการทำนายแบบเด็ดขาด');
  });

  it('should include specific warnings section instructions', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify structure includes warnings section
    expect(prompt).toContain('จุดที่ควรระวัง');
    expect(prompt).toContain('ความเสี่ยงหรืออุปสรรคที่เฉพาะเจาะจง');
  });

  it('should include 10-card Celtic Cross specific instructions', () => {
    // Create 10 mock cards
    const tenCards: DrawnCard[] = Array(10).fill(null).map((_, i) => ({
      card: {
        id: `card-${i}`,
        name: `Card ${i}`,
        arcana: i < 3 ? 'major' : 'minor',
        suit: 'wands',
        number: i,
        keywordsUpright: ['keyword'],
        keywordsReversed: ['reversed'],
        meaningUpright: 'meaning',
        meaningReversed: 'reversed meaning',
      },
      orientation: 'upright' as const,
    }));

    const params: TarotPromptParams = {
      cards: tenCards,
      count: 10,
      spreadType: 10,
    };

    const prompt = buildTarotPrompt(params);

    // Verify Celtic Cross specific instructions
    expect(prompt).toContain('Celtic Cross');
    expect(prompt).toContain('ตำแหน่งที่ 1-2');
    expect(prompt).toContain('ธีมหลักที่ปรากฏซ้ำ');
    expect(prompt).toContain('แผนระยะยาว');
  });

  it('should include Thai cultural context', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1],
      count: 1,
      spreadType: 1,
    };

    const prompt = buildTarotPrompt(params);

    // Verify Thai cultural elements
    expect(prompt).toContain('กฎแห่งกรรม'); // Karma
    expect(prompt).toContain('บุญ'); // Merit
    expect(prompt).toContain('สติ'); // Mindfulness
    expect(prompt).toContain('ดวงชะตา'); // Destiny
  });

  it('should format card data correctly', () => {
    const params: TarotPromptParams = {
      cards: [mockCard1, mockCard2],
      count: 2,
      spreadType: 3,
    };

    const prompt = buildTarotPrompt(params);

    // Verify card formatting
    expect(prompt).toContain('1. The Fool (ตั้งตรง)');
    expect(prompt).toContain('2. Two of Cups (กลับหัว)');
    expect(prompt).toContain('จำนวนไพ่: 2');
  });
});
