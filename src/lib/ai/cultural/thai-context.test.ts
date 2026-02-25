/**
 * Unit tests for Thai cultural context module
 */

import { describe, it, expect } from '@jest/globals';
import {
  THAI_BUDDHIST_PHILOSOPHY,
  THAI_ASTROLOGY_CONCEPTS,
  THAI_NUMEROLOGY_BELIEFS,
  THAI_GUIDANCE_STYLE,
  THAI_DIVINATION_CONTEXT,
  getContextForDivinationType,
  getCulturalElement,
} from './thai-context';

describe('Thai Cultural Context Constants', () => {
  it('should export Buddhist philosophy constant', () => {
    expect(THAI_BUDDHIST_PHILOSOPHY).toBeDefined();
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('กฎแห่งกรรม');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('การทำบุญ');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('สติและสมาธิ');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('ทางสายกลาง');
  });

  it('should export astrology concepts constant', () => {
    expect(THAI_ASTROLOGY_CONCEPTS).toBeDefined();
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ดวงชะตา');
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ฤกษ์ยาม');
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ธาตุทั้งสี่');
  });

  it('should export numerology beliefs constant', () => {
    expect(THAI_NUMEROLOGY_BELIEFS).toBeDefined();
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 9');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 8');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลขรวมและเลขราก');
  });

  it('should export guidance style constant', () => {
    expect(THAI_GUIDANCE_STYLE).toBeDefined();
    expect(THAI_GUIDANCE_STYLE).toContain('อบอุ่น');
    expect(THAI_GUIDANCE_STYLE).toContain('ตรงไปตรงมา');
    expect(THAI_GUIDANCE_STYLE).toContain('ให้กำลังใจ');
  });

  it('should export complete divination context object', () => {
    expect(THAI_DIVINATION_CONTEXT).toBeDefined();
    expect(THAI_DIVINATION_CONTEXT.philosophy).toBe(THAI_BUDDHIST_PHILOSOPHY);
    expect(THAI_DIVINATION_CONTEXT.astrology).toBe(THAI_ASTROLOGY_CONCEPTS);
    expect(THAI_DIVINATION_CONTEXT.numerology).toBe(THAI_NUMEROLOGY_BELIEFS);
    expect(THAI_DIVINATION_CONTEXT.guidance).toBe(THAI_GUIDANCE_STYLE);
  });
});

describe('getContextForDivinationType', () => {
  it('should return context with astrology for tarot type', () => {
    const context = getContextForDivinationType('tarot');
    expect(context).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(context).toContain('อบอุ่น'); // Guidance style
    expect(context).toContain('ดวงชะตา'); // Astrology
    expect(context).not.toContain('เลข 9'); // Should not include numerology
  });

  it('should return context with astrology and numerology for spirit type', () => {
    const context = getContextForDivinationType('spirit');
    expect(context).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(context).toContain('อบอุ่น'); // Guidance style
    expect(context).toContain('ดวงชะตา'); // Astrology
    expect(context).toContain('เลข 9'); // Numerology
  });

  it('should return context with numerology for numerology type', () => {
    const context = getContextForDivinationType('numerology');
    expect(context).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(context).toContain('อบอุ่น'); // Guidance style
    expect(context).toContain('เลข 9'); // Numerology
    expect(context).not.toContain('ดวงชะตา'); // Should not include astrology
  });

  it('should return base context for chat type', () => {
    const context = getContextForDivinationType('chat');
    expect(context).toContain('กฎแห่งกรรม'); // Buddhist philosophy
    expect(context).toContain('อบอุ่น'); // Guidance style
    expect(context).not.toContain('ดวงชะตา'); // Should not include astrology
    expect(context).not.toContain('เลข 9'); // Should not include numerology
  });

  it('should always include Buddhist philosophy and guidance style', () => {
    const types: Array<'tarot' | 'spirit' | 'numerology' | 'chat'> = [
      'tarot',
      'spirit',
      'numerology',
      'chat',
    ];

    types.forEach((type) => {
      const context = getContextForDivinationType(type);
      expect(context).toContain('กฎแห่งกรรม');
      expect(context).toContain('อบอุ่น');
    });
  });
});

describe('getCulturalElement', () => {
  it('should return philosophy element', () => {
    const element = getCulturalElement('philosophy');
    expect(element).toBe(THAI_BUDDHIST_PHILOSOPHY);
  });

  it('should return astrology element', () => {
    const element = getCulturalElement('astrology');
    expect(element).toBe(THAI_ASTROLOGY_CONCEPTS);
  });

  it('should return numerology element', () => {
    const element = getCulturalElement('numerology');
    expect(element).toBe(THAI_NUMEROLOGY_BELIEFS);
  });

  it('should return guidance element', () => {
    const element = getCulturalElement('guidance');
    expect(element).toBe(THAI_GUIDANCE_STYLE);
  });
});

describe('Cultural Context Content Validation', () => {
  it('should contain all required Buddhist concepts', () => {
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('กฎแห่งกรรม');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('การทำบุญ');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('สติและสมาธิ');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('ทางสายกลาง');
    expect(THAI_BUDDHIST_PHILOSOPHY).toContain('อนิจจัง');
  });

  it('should contain all required astrology concepts', () => {
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ดวงชะตา');
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ฤกษ์ยาม');
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('ธาตุทั้งสี่');
    expect(THAI_ASTROLOGY_CONCEPTS).toContain('พลังงานจักรวาล');
  });

  it('should contain all required numerology beliefs', () => {
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 9');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 8');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 6');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 5');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 3');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลข 1');
    expect(THAI_NUMEROLOGY_BELIEFS).toContain('เลขรวมและเลขราก');
  });

  it('should contain all required guidance style elements', () => {
    expect(THAI_GUIDANCE_STYLE).toContain('อบอุ่น');
    expect(THAI_GUIDANCE_STYLE).toContain('ตรงไปตรงมา');
    expect(THAI_GUIDANCE_STYLE).toContain('ให้กำลังใจ');
    expect(THAI_GUIDANCE_STYLE).toContain('เน้นสิ่งที่ทำได้');
    expect(THAI_GUIDANCE_STYLE).toContain('ใช้ภาษาที่เข้าใจง่าย');
  });
});
