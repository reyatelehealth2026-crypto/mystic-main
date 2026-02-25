// Example usage of FortuneReadingBlocks component
// Feature: popular-fortune-features

import { FortuneReadingBlocks } from './FortuneReadingBlocks';
import { ZodiacSign, TimePeriod } from '@/lib/horoscope/types';
import { ChineseZodiacAnimal, ChineseElement } from '@/lib/chinese-zodiac/types';
import { ReadingDomain } from '@/lib/horoscope/specialized';

// Example 1: Horoscope Reading
export function HoroscopeExample() {
  const horoscopeReading = {
    type: 'horoscope' as const,
    data: {
      zodiacSign: ZodiacSign.ARIES,
      period: TimePeriod.DAILY,
      dateRange: { 
        start: new Date('2024-02-14'), 
        end: new Date('2024-02-14') 
      },
      aspects: {
        love: 'วันนี้ความรักของคุณเต็มไปด้วยพลังและความมั่นใจ เหมาะกับการแสดงความรู้สึกที่แท้จริง',
        career: 'โอกาสใหม่กำลังเข้ามา ความกล้าหาญจะช่วยให้คุณก้าวข้ามอุปสรรค',
        finance: 'การเงินมีเสถียรภาพ แต่ควรระวังการใช้จ่ายที่ไม่จำเป็น',
        health: 'พลังงานสูง เหมาะกับการออกกำลังกายและกิจกรรมกลางแจ้ง'
      },
      luckyNumbers: [1, 9, 18, 27],
      luckyColors: ['แดง', 'ทอง', 'ส้ม'],
      advice: 'ใช้พลังงานในทางที่สร้างสรรค์ อย่าให้ความหุนหันพลันแล่นทำให้พลาดโอกาส',
      confidence: 85
    }
  };

  return (
    <FortuneReadingBlocks 
      reading={horoscopeReading}
      onViewAnother={() => console.log('View another')}
      onShare={() => console.log('Share')}
      onReturnToMenu={() => console.log('Return to menu')}
    />
  );
}

// Example 2: Compatibility Reading
export function CompatibilityExample() {
  const compatibilityReading = {
    type: 'compatibility' as const,
    data: {
      person1: {
        birthDate: new Date('1990-03-25'),
        zodiacSign: ZodiacSign.ARIES
      },
      person2: {
        birthDate: new Date('1992-07-20'),
        zodiacSign: ZodiacSign.CANCER
      },
      overallScore: 68,
      scores: {
        overall: 68,
        communication: 65,
        emotional: 72,
        longTerm: 67
      },
      strengths: [
        'ทั้งคู่มีความมุ่งมั่นในความสัมพันธ์',
        'เข้าใจและเคารพความต่างของกันและกัน',
        'มีความรักและความห่วงใยที่จริงใจ'
      ],
      challenges: [
        'ความแตกต่างในการแสดงออกทางอารมณ์',
        'ความต้องการอิสระของเมษ vs ความต้องการความมั่นคงของกรกฎ',
        'การสื่อสารที่อาจไม่ตรงกัน'
      ],
      advice: 'เรียนรู้ที่จะเข้าใจและยอมรับความต่าง สื่อสารอย่างเปิดเผยและจริงใจ ให้เวลากับการสร้างความเข้าใจซึ่งกันและกัน',
      elementCompatibility: 'Fire + Water = ต้องการความสมดุล'
    }
  };

  return (
    <FortuneReadingBlocks 
      reading={compatibilityReading}
      onViewAnother={() => console.log('View another')}
      onReturnToMenu={() => console.log('Return to menu')}
    />
  );
}

// Example 3: Chinese Zodiac Reading
export function ChineseZodiacExample() {
  const chineseZodiacReading = {
    type: 'chinese_zodiac' as const,
    data: {
      animal: ChineseZodiacAnimal.DRAGON,
      element: ChineseElement.WOOD,
      thaiName: 'ปีมังกร',
      chineseName: '龙 (Lóng)',
      period: TimePeriod.MONTHLY,
      dateRange: { 
        start: new Date('2024-02-01'), 
        end: new Date('2024-02-29') 
      },
      fortune: {
        overall: 'เดือนนี้เป็นช่วงเวลาที่ดีสำหรับคนปีมังกร โชคลาภและโอกาสใหม่กำลังเข้ามา',
        career: 'ความก้าวหน้าในหน้าที่การงาน ได้รับการยอมรับจากผู้บังคับบัญชา',
        wealth: 'การเงินมีเสถียรภาพ มีโอกาสได้รับรายได้เพิ่มจากการลงทุน',
        health: 'สุขภาพแข็งแรง แต่ควรระวังการทำงานหนักเกินไป',
        relationships: 'ความสัมพันธ์กับคนรอบข้างดีขึ้น มีโอกาสพบเพื่อนใหม่'
      },
      luckyColors: ['เขียว', 'น้ำเงิน', 'ขาว'],
      luckyNumbers: [3, 4, 9],
      luckyDirections: ['ทิศตะวันออก', 'ทิศใต้'],
      advice: 'ใช้พลังงานและความมั่นใจในการสร้างโอกาสใหม่ อย่าลืมดูแลสุขภาพและพักผ่อนให้เพียงพอ'
    }
  };

  return (
    <FortuneReadingBlocks 
      reading={chineseZodiacReading}
      onViewAnother={() => console.log('View another')}
      onShare={() => console.log('Share')}
      onReturnToMenu={() => console.log('Return to menu')}
    />
  );
}

// Example 4: Name Numerology Reading
export function NameNumerologyExample() {
  const nameNumerologyReading = {
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
        personality: 'คุณเป็นคนที่มีความคิดสร้างสรรค์ ชอบการสื่อสาร และมีความยืดหยุ่นสูง',
        strengths: [
          'มีความสามารถในการปรับตัว',
          'สื่อสารได้ดี',
          'มีความคิดสร้างสรรค์',
          'เป็นมิตรและเข้ากับคนง่าย'
        ],
        weaknesses: [
          'ขาดความมุ่งมั่นในบางครั้ง',
          'กระจายความสนใจมากเกินไป',
          'ตัดสินใจยาก'
        ],
        lifePath: 'เส้นทางชีวิตของคุณเต็มไปด้วยการเรียนรู้และการสื่อสาร คุณมีพรสวรรค์ในการเชื่อมโยงผู้คนและแนวคิด',
        career: 'เหมาะกับงานที่ต้องใช้ความคิดสร้างสรรค์ การสื่อสาร หรือการทำงานกับผู้คน เช่น การตลาด การขาย การสอน หรือสื่อมวลชน',
        relationships: 'คุณเป็นคนที่เข้ากับคนอื่นได้ง่าย แต่ควรเรียนรู้ที่จะมุ่งมั่นและสร้างความสัมพันธ์ที่ลึกซึ้ง'
      },
      luckyNumbers: [3, 6, 9, 12, 15],
      advice: 'ใช้ความสามารถในการสื่อสารและความคิดสร้างสรรค์เพื่อสร้างโอกาส แต่อย่าลืมมุ่งมั่นกับเป้าหมายที่สำคัญ'
    }
  };

  return (
    <FortuneReadingBlocks 
      reading={nameNumerologyReading}
      onViewAnother={() => console.log('View another')}
      onReturnToMenu={() => console.log('Return to menu')}
    />
  );
}

// Example 5: Specialized Reading (Finance/Career)
export function SpecializedExample() {
  const specializedReading = {
    type: 'specialized' as const,
    data: {
      zodiacSign: ZodiacSign.LEO,
      domain: ReadingDomain.FINANCE_CAREER,
      period: TimePeriod.WEEKLY,
      dateRange: { 
        start: new Date('2024-02-12'), 
        end: new Date('2024-02-18') 
      },
      prediction: 'สัปดาห์นี้เป็นช่วงเวลาที่ดีสำหรับการแสดงความสามารถและความเป็นผู้นำ โอกาสในการเติบโตทางอาชีพกำลังเข้ามา',
      opportunities: [
        'โอกาสในการเป็นหัวหน้าโปรเจกต์สำคัญ',
        'การเจรจาเงินเดือนหรือโบนัส',
        'การสร้างเครือข่ายกับผู้มีอิทธิพล',
        'รายได้เพิ่มจากความสามารถพิเศษ'
      ],
      challenges: [
        'ความกดดันจากความคาดหวังที่สูง',
        'การแข่งขันที่รุนแรง',
        'ความขัดแย้งกับเพื่อนร่วมงาน',
        'การใช้จ่ายที่เพิ่มขึ้น'
      ],
      actionItems: [
        'เตรียมพรีเซนต์เทชันหรือข้อเสนอที่สำคัญ',
        'สร้างความสัมพันธ์ที่ดีกับผู้บังคับบัญชา',
        'พัฒนาทักษะผู้นำและการจัดการทีม',
        'วางแผนการเงินระยะยาว',
        'ลงทุนในการพัฒนาตัวเอง'
      ],
      advice: 'ใช้ความมั่นใจและความสามารถในการเป็นผู้นำเพื่อสร้างโอกาส แต่อย่าลืมทำงานเป็นทีมและรับฟังความคิดเห็นของผู้อื่น ความถ่อมตนจะช่วยให้คุณได้รับความเคารพมากขึ้น'
    }
  };

  return (
    <FortuneReadingBlocks 
      reading={specializedReading}
      onViewAnother={() => console.log('View another')}
      onShare={() => console.log('Share')}
      onReturnToMenu={() => console.log('Return to menu')}
    />
  );
}
