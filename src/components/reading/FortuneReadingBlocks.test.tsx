// Tests for FortuneReadingBlocks component
// Feature: popular-fortune-features

import { describe, it, expect } from 'vitest';
import { FortuneReadingBlocks } from './FortuneReadingBlocks';
import { ZodiacSign, TimePeriod } from '@/lib/horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '@/lib/chinese-zodiac/types';
import { ReadingDomain } from '@/lib/horoscope/specialized';

describe('FortuneReadingBlocks', () => {
  it('should render horoscope reading with all aspects', () => {
    const reading = {
      type: 'horoscope' as const,
      data: {
        zodiacSign: ZodiacSign.ARIES,
        period: TimePeriod.DAILY,
        dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-01') },
        aspects: {
          love: 'ความรักดี',
          career: 'การงานดี',
          finance: 'การเงินดี',
          health: 'สุขภาพดี'
        },
        luckyNumbers: [1, 2, 3],
        luckyColors: ['แดง', 'ทอง'],
        advice: 'คำแนะนำ',
        confidence: 80
      }
    };

    // Component should accept the reading prop without errors
    expect(() => FortuneReadingBlocks({ reading })).not.toThrow();
  });

  it('should render compatibility reading with scores', () => {
    const reading = {
      type: 'compatibility' as const,
      data: {
        person1: {
          birthDate: new Date('1990-01-01'),
          zodiacSign: ZodiacSign.ARIES
        },
        person2: {
          birthDate: new Date('1992-05-15'),
          zodiacSign: ZodiacSign.TAURUS
        },
        overallScore: 75,
        scores: {
          overall: 75,
          communication: 80,
          emotional: 70,
          longTerm: 75
        },
        strengths: ['จุดแข็ง 1', 'จุดแข็ง 2'],
        challenges: ['ความท้าทาย 1'],
        advice: 'คำแนะนำ',
        elementCompatibility: 'Fire + Earth'
      }
    };

    expect(() => FortuneReadingBlocks({ reading })).not.toThrow();
  });

  it('should render Chinese zodiac reading with fortune sections', () => {
    const reading = {
      type: 'chinese_zodiac' as const,
      data: {
        animal: ChineseZodiacAnimal.DRAGON,
        element: ChineseElement.WOOD,
        thaiName: 'ปีมังกร',
        chineseName: '龙',
        period: TimePeriod.DAILY,
        dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-01') },
        fortune: {
          overall: 'โชคลาภดี',
          career: 'การงานดี',
          wealth: 'ความมั่งคั่งดี',
          health: 'สุขภาพดี',
          relationships: 'ความสัมพันธ์ดี'
        },
        luckyColors: ['เขียว', 'น้ำเงิน'],
        luckyNumbers: [3, 8],
        luckyDirections: ['ทิศตะวันออก'],
        advice: 'คำแนะนำ'
      }
    };

    expect(() => FortuneReadingBlocks({ reading })).not.toThrow();
  });

  it('should render name numerology reading with interpretation', () => {
    const reading = {
      type: 'name_numerology' as const,
      data: {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        scores: {
          firstName: 5,
          lastName: 7,
          fullName: 3,
          destiny: 3
        },
        interpretation: {
          personality: 'บุคลิกภาพดี',
          strengths: ['จุดแข็ง 1', 'จุดแข็ง 2'],
          weaknesses: ['จุดอ่อน 1'],
          lifePath: 'เส้นทางชีวิต',
          career: 'การงาน',
          relationships: 'ความสัมพันธ์'
        },
        luckyNumbers: [3, 6, 9],
        advice: 'คำแนะนำ'
      }
    };

    expect(() => FortuneReadingBlocks({ reading })).not.toThrow();
  });

  it('should render specialized reading with action items', () => {
    const reading = {
      type: 'specialized' as const,
      data: {
        zodiacSign: ZodiacSign.LEO,
        domain: ReadingDomain.FINANCE_CAREER,
        period: TimePeriod.WEEKLY,
        dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-07') },
        prediction: 'คำทำนาย',
        opportunities: ['โอกาส 1', 'โอกาส 2'],
        challenges: ['ความท้าทาย 1'],
        actionItems: ['สิ่งที่ควรทำ 1', 'สิ่งที่ควรทำ 2'],
        advice: 'คำแนะนำ'
      }
    };

    expect(() => FortuneReadingBlocks({ reading })).not.toThrow();
  });
});
