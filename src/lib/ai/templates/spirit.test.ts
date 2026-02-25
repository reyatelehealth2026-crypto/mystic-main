/**
 * Unit tests for Spirit Card Prompt Builder
 */

import { describe, it, expect } from '@jest/globals';
import { buildSpiritPrompt } from './spirit';
import type { SpiritPromptParams } from '../types';
import type { TarotCard } from '@/lib/tarot/types';

// Mock card data for testing
const mockEmpressCard: TarotCard = {
  id: 'the-empress',
  name: 'The Empress',
  arcana: 'major',
  number: 3,
  keywordsUpright: ['abundance', 'nurturing', 'creativity'],
  keywordsReversed: ['dependence', 'smothering', 'emptiness'],
  meaningUpright: 'ความอุดมสมบูรณ์ การเลี้ยงดู ความคิดสร้างสรรค์ ความอบอุ่น',
  meaningReversed: 'การพึ่งพา การให้มากเกินไป ความว่างเปล่า',
};

const mockEmperorCard: TarotCard = {
  id: 'the-emperor',
  name: 'The Emperor',
  arcana: 'major',
  number: 4,
  keywordsUpright: ['authority', 'structure', 'control'],
  keywordsReversed: ['domination', 'rigidity', 'lack of discipline'],
  meaningUpright: 'การควบคุม โครงสร้าง อำนาจ ความมั่นคง',
  meaningReversed: 'การควบคุมมากเกิน ความแข็งแกร่ง ขาดความยืดหยุ่น',
};

describe('buildSpiritPrompt', () => {
  it('should build a complete prompt for upright spirit card', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify prompt contains all required sections
    expect(prompt).toContain('ผู้เชี่ยวชาญด้านไพ่ทาโรต์และเลขศาสตร์'); // Role
    expect(prompt).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(prompt).toContain('เลขมงคล'); // Numerology beliefs
    expect(prompt).toContain('ตัวอย่างการตีความที่ดี'); // Few-shot examples
    expect(prompt).toContain('คำแนะนำการตีความไพ่ประจำตัว'); // Instructions
    expect(prompt).toContain('15/03/1990'); // DOB
    expect(prompt).toContain('The Empress'); // Card name
    expect(prompt).toContain('ตั้งตรง'); // Orientation
  });

  it('should build a complete prompt for reversed spirit card', () => {
    const params: SpiritPromptParams = {
      card: mockEmperorCard,
      orientation: 'reversed',
      lifePathNumber: 4,
      dob: '22/11/1988',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify reversed orientation is included
    expect(prompt).toContain('กลับหัว');
    expect(prompt).toContain('The Emperor');
    expect(prompt).toContain('22/11/1988');
    expect(prompt).toContain('เลขเส้นทางชีวิต: 4');
  });

  it('should include upright-specific instructions for upright cards', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify upright-specific instructions
    expect(prompt).toContain('ไพ่ตั้งตรง');
    expect(prompt).toContain('จุดแข็งและพรสวรรค์ตามธรรมชาติ');
    expect(prompt).toContain('ความสามารถพิเศษ');
    expect(prompt).toContain('ทำอะไรได้ดีโดยธรรมชาติ');
  });

  it('should include reversed-specific instructions for reversed cards', () => {
    const params: SpiritPromptParams = {
      card: mockEmperorCard,
      orientation: 'reversed',
      lifePathNumber: 4,
      dob: '22/11/1988',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify reversed-specific instructions
    expect(prompt).toContain('ไพ่กลับหัว');
    expect(prompt).toContain('จุดที่ต้องพัฒนา');
    expect(prompt).toContain('ด้านเงา');
    expect(prompt).toContain('shadow aspect');
    expect(prompt).toContain('ปลดล็อกหรือพัฒนาพลังงาน');
  });

  it('should include life path number connection guidance', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify life path connection instructions
    expect(prompt).toContain('การเชื่อมโยงเลขเส้นทางชีวิตกับไพ่');
    expect(prompt).toContain('เลขเส้นทางชีวิตเสริมหรือสะท้อนพลังงานของไพ่');
    expect(prompt).toContain('เลขศาสตร์ไทย');
  });

  it('should include long-term perspective guidance', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify long-term guidance instructions
    expect(prompt).toContain('มุมมองระยะยาว');
    expect(prompt).toContain('การพัฒนาตัวเองตลอดชีวิต');
    expect(prompt).toContain('ไม่ใช่การทำนายระยะสั้น');
    expect(prompt).toContain('ตลอดชีวิต');
  });

  it('should include personal development theme connection', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify personal development instructions
    expect(prompt).toContain('การเชื่อมโยงกับธีมการพัฒนาตัวเอง');
    expect(prompt).toContain('บทเรียนชีวิต');
    expect(prompt).toContain('เป้าหมายชีวิต');
  });

  it('should include actionable guidance instructions', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify actionable guidance
    expect(prompt).toContain('คำแนะนำที่นำไปปฏิบัติได้');
    expect(prompt).toContain('อาชีพหรือสายงานที่เหมาะสม');
    expect(prompt).toContain('การพัฒนาทักษะ');
  });

  it('should include encouraging tone instructions', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify encouraging tone instructions
    expect(prompt).toContain('น้ำเสียงที่ให้กำลังใจ');
    expect(prompt).toContain('อบอุ่น');
    expect(prompt).toContain('ให้กำลังใจ');
    expect(prompt).toContain('แรงบันดาลใจ');
  });

  it('should include Thai cultural context for spirit cards', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify Thai cultural elements
    expect(prompt).toContain('กฎแห่งกรรม'); // Karma
    expect(prompt).toContain('บุญ'); // Merit
    expect(prompt).toContain('สติ'); // Mindfulness
    expect(prompt).toContain('ดวงชะตา'); // Destiny
    expect(prompt).toContain('เลข 9 เป็นเลขมงคลสูงสุด'); // Numerology
  });

  it('should format user data correctly', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify data formatting
    expect(prompt).toContain('วันเกิด: 15/03/1990');
    expect(prompt).toContain('เลขเส้นทางชีวิต: 9');
    expect(prompt).toContain('ไพ่ประจำตัว: The Empress (ตั้งตรง)');
    expect(prompt).toContain('ความหมายไพ่:');
  });

  it('should include card keywords in user data', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify card meaning is included
    expect(prompt).toContain('ความอุดมสมบูรณ์');
    expect(prompt).toContain('การเลี้ยงดู');
  });

  it('should add reversed context to card keywords for reversed cards', () => {
    const params: SpiritPromptParams = {
      card: mockEmperorCard,
      orientation: 'reversed',
      lifePathNumber: 4,
      dob: '22/11/1988',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify reversed context is added
    expect(prompt).toContain('กลับหัว: พลังงานที่ถูกกดไว้');
    expect(prompt).toContain('จุดที่ต้องพัฒนา');
  });

  it('should include required JSON structure in instructions', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify JSON structure requirements
    expect(prompt).toContain('ตอบเป็น JSON เท่านั้น');
    expect(prompt).toContain('summary');
    expect(prompt).toContain('cardStructure');
    expect(prompt).toContain('ภาพรวมสถานการณ์');
    expect(prompt).toContain('จุดที่ควรระวัง');
    expect(prompt).toContain('แนวทางที่ควรทำ');
  });

  it('should select upright examples for upright orientation', () => {
    const params: SpiritPromptParams = {
      card: mockEmpressCard,
      orientation: 'upright',
      lifePathNumber: 9,
      dob: '15/03/1990',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify upright example is included (The Empress example)
    expect(prompt).toContain('The Empress');
    expect(prompt).toContain('ตัวอย่างที่ 1');
  });

  it('should select reversed examples for reversed orientation', () => {
    const params: SpiritPromptParams = {
      card: mockEmperorCard,
      orientation: 'reversed',
      lifePathNumber: 4,
      dob: '22/11/1988',
    };

    const prompt = buildSpiritPrompt(params);

    // Verify reversed example is included (The Emperor reversed example)
    expect(prompt).toContain('The Emperor');
    expect(prompt).toContain('ตัวอย่างที่ 1');
  });
});
