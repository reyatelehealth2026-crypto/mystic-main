/**
 * Unit tests for numerology prompt builder
 */

import { describe, it, expect } from '@jest/globals';
import { buildNumerologyPrompt } from './numerology';
import type { NumerologyPromptParams } from '@/lib/ai/types';

describe('buildNumerologyPrompt', () => {
  const baseParams: NumerologyPromptParams = {
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

  it('should generate a valid prompt with all required sections', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(0);
    
    // Check for role section
    expect(prompt).toContain('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย');
    
    // Check for cultural context
    expect(prompt).toContain('กฎแห่งกรรม');
    
    // Check for few-shot examples
    expect(prompt).toContain('ตัวอย่างการตีความที่ดี');
    
    // Check for instructions
    expect(prompt).toContain('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์');
    
    // Check for user data
    expect(prompt).toContain('0812345678');
    expect(prompt).toContain('เลขราก: 9');
  });

  it('should include high score framing for scores >= 80', () => {
    const highScoreParams = { ...baseParams, score: 87 };
    const prompt = buildNumerologyPrompt(highScoreParams);
    
    expect(prompt).toContain('คะแนนสูง');
  });

  it('should include low score framing for scores < 40', () => {
    const lowScoreParams = { ...baseParams, score: 32 };
    const prompt = buildNumerologyPrompt(lowScoreParams);
    
    expect(prompt).toContain('คะแนนต่ำ');
    expect(prompt).toContain('สร้างสรรค์');
  });

  it('should include medium score framing for scores 40-79', () => {
    const mediumScoreParams = { ...baseParams, score: 65 };
    const prompt = buildNumerologyPrompt(mediumScoreParams);
    
    expect(prompt).toContain('คะแนนปานกลาง');
  });

  it('should include root number explanation instructions', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toContain('เลขราก');
    expect(prompt).toContain('Root Number');
  });

  it('should include theme analysis instructions', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toContain('ด้านการงาน');
    expect(prompt).toContain('ด้านการเงิน');
    expect(prompt).toContain('ด้านความสัมพันธ์');
    expect(prompt).toContain('คำเตือน');
  });

  it('should include Thai cultural number beliefs', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toContain('เลข 9');
    expect(prompt).toContain('เลขมงคล');
  });

  it('should format phone number with dashes in user data', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toContain('081-234-5678');
  });

  it('should include all theme data in user data section', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    expect(prompt).toContain('งาน: ก้าวหน้า มีโอกาสดี');
    expect(prompt).toContain('เงิน: มั่นคง เงินไหลเวียน');
    expect(prompt).toContain('ความสัมพันธ์: ราบรื่น เป็นที่รัก');
    expect(prompt).toContain('คำเตือน: อย่าประมาท');
  });

  it('should maintain correct section ordering', () => {
    const prompt = buildNumerologyPrompt(baseParams);
    
    const roleIndex = prompt.indexOf('ผู้เชี่ยวชาญด้านเลขศาสตร์ไทย');
    const culturalIndex = prompt.indexOf('กฎแห่งกรรม');
    const examplesIndex = prompt.indexOf('ตัวอย่างการตีความที่ดี');
    const instructionsIndex = prompt.indexOf('คำแนะนำการวิเคราะห์เบอร์โทรศัพท์');
    const userDataIndex = prompt.indexOf('ข้อมูลการวิเคราะห์เบอร์โทรศัพท์');
    
    expect(roleIndex).toBeLessThan(culturalIndex);
    expect(culturalIndex).toBeLessThan(examplesIndex);
    expect(examplesIndex).toBeLessThan(instructionsIndex);
    expect(instructionsIndex).toBeLessThan(userDataIndex);
  });
});
