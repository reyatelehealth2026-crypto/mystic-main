// Baseline Compatibility Interpretations for REFFORTUNE
// Feature: popular-fortune-features
// Provides deterministic compatibility interpretations based on score ranges

import { ZodiacSign } from '../horoscope/types';
import { getZodiacMetadata } from '../horoscope/zodiac';

/**
 * Score range categories for compatibility
 */
export enum CompatibilityLevel {
  EXCELLENT = 'excellent',      // 85-100
  VERY_GOOD = 'very_good',      // 70-84
  GOOD = 'good',                // 55-69
  MODERATE = 'moderate',        // 40-54
  CHALLENGING = 'challenging'   // 0-39
}

/**
 * Determine compatibility level from score
 */
export function getCompatibilityLevel(score: number): CompatibilityLevel {
  if (score >= 85) return CompatibilityLevel.EXCELLENT;
  if (score >= 70) return CompatibilityLevel.VERY_GOOD;
  if (score >= 55) return CompatibilityLevel.GOOD;
  if (score >= 40) return CompatibilityLevel.MODERATE;
  return CompatibilityLevel.CHALLENGING;
}

/**
 * Baseline strengths templates by compatibility level
 */
const STRENGTHS_BY_LEVEL: Record<CompatibilityLevel, string[]> = {
  [CompatibilityLevel.EXCELLENT]: [
    'มีความเข้าใจกันอย่างลึกซึ้งและเป็นธรรมชาติ',
    'สามารถสื่อสารกันได้อย่างราบรื่นโดยไม่ต้องอธิบายมาก',
    'มีเป้าหมายและค่านิยมที่สอดคล้องกัน',
    'สนับสนุนและส่งเสริมซึ่งกันและกันในทุกด้าน',
    'มีพลังงานที่เข้ากันได้ดีและสร้างแรงบันดาลใจให้กัน'
  ],
  [CompatibilityLevel.VERY_GOOD]: [
    'มีความเข้าใจและเคารพในความแตกต่างของกันและกัน',
    'สามารถเติมเต็มจุดอ่อนของกันและกันได้ดี',
    'มีความสนใจและงานอดิเรกที่คล้ายคลึงกัน',
    'สร้างความสมดุลที่ดีในความสัมพันธ์',
    'มีความไว้วางใจและความจริงใจต่อกัน'
  ],
  [CompatibilityLevel.GOOD]: [
    'มีพื้นฐานที่ดีสำหรับความสัมพันธ์ที่มั่นคง',
    'เรียนรู้และเติบโตไปพร้อมกันได้',
    'มีความอดทนและเข้าใจในความแตกต่าง',
    'สามารถแก้ไขปัญหาร่วมกันได้อย่างสร้างสรรค์',
    'มีความผูกพันทางอารมณ์ที่แท้จริง'
  ],
  [CompatibilityLevel.MODERATE]: [
    'มีโอกาสเรียนรู้สิ่งใหม่ๆ จากกันและกัน',
    'ความแตกต่างสามารถเป็นจุดเด่นได้หากมีความเข้าใจ',
    'ต้องใช้ความพยายามในการสร้างความเข้าใจ',
    'มีศักยภาพในการเติบโตร่วมกันหากมีความตั้งใจ',
    'ความท้าทายช่วยให้ทั้งคู่แข็งแกร่งขึ้น'
  ],
  [CompatibilityLevel.CHALLENGING]: [
    'มีโอกาสเรียนรู้บทเรียนชีวิตที่สำคัญจากกัน',
    'ความแตกต่างที่ชัดเจนสามารถนำไปสู่การเติบโต',
    'ต้องการความอดทนและความเข้าใจอย่างมาก',
    'อาจพบจุดร่วมในด้านที่ไม่คาดคิด',
    'ความท้าทายสูงแต่ไม่ใช่เรื่องที่เป็นไปไม่ได้'
  ]
};

/**
 * Baseline challenges templates by compatibility level
 */
const CHALLENGES_BY_LEVEL: Record<CompatibilityLevel, string[]> = {
  [CompatibilityLevel.EXCELLENT]: [
    'อาจคล้ายกันมากจนขาดมุมมองที่หลากหลาย',
    'ต้องระวังไม่ให้ความสัมพันธ์ซ้ำซากจนเกินไป',
    'อาจมีการแข่งขันกันในบางเรื่อง',
    'ต้องรักษาพื้นที่ส่วนตัวของแต่ละคน'
  ],
  [CompatibilityLevel.VERY_GOOD]: [
    'บางครั้งอาจมีความเห็นไม่ตรงกันในเรื่องเล็กน้อย',
    'ต้องใส่ใจในการสื่อสารให้ชัดเจน',
    'อาจมีความคาดหวังที่แตกต่างกันในบางด้าน',
    'ต้องหาจุดสมดุลระหว่างความเป็นตัวของตัวเองและความเป็นคู่'
  ],
  [CompatibilityLevel.GOOD]: [
    'ต้องใช้เวลาในการทำความเข้าใจกันอย่างลึกซึ้ง',
    'อาจมีความขัดแย้งในเรื่องของค่านิยมบางอย่าง',
    'ต้องการความอดทนและความเข้าใจซึ่งกันและกัน',
    'การสื่อสารที่ดีเป็นสิ่งสำคัญมาก'
  ],
  [CompatibilityLevel.MODERATE]: [
    'มีความแตกต่างพื้นฐานที่ต้องปรับตัว',
    'อาจมีความเข้าใจผิดกันบ่อยครั้ง',
    'ต้องใช้ความพยายามมากในการรักษาความสัมพันธ์',
    'วิธีการแสดงความรักและความห่วงใยอาจแตกต่างกัน',
    'ต้องการการประนีประนอมอย่างต่อเนื่อง'
  ],
  [CompatibilityLevel.CHALLENGING]: [
    'มีความแตกต่างพื้นฐานที่สำคัญมาก',
    'วิธีคิดและมุมมองชีวิตอาจตรงกันข้าม',
    'การสื่อสารอาจเป็นเรื่องยากและต้องใช้ความพยายามสูง',
    'ความขัดแย้งอาจเกิดขึ้นบ่อยและรุนแรง',
    'ต้องการความมุ่งมั่นและความอดทนอย่างมากในการรักษาความสัมพันธ์',
    'อาจรู้สึกว่าต้องเปลี่ยนแปลงตัวเองมากเกินไป'
  ]
};

/**
 * Baseline advice templates by compatibility level
 */
const ADVICE_BY_LEVEL: Record<CompatibilityLevel, string[]> = {
  [CompatibilityLevel.EXCELLENT]: [
    'รักษาความสดใหม่ในความสัมพันธ์ด้วยการลองสิ่งใหม่ๆ ร่วมกัน',
    'อย่าลืมให้เวลากับตัวเองและเพื่อนฝูงด้วย',
    'สื่อสารอย่างเปิดเผยแม้ในเรื่องที่ดูเหมือนเล็กน้อย',
    'ใช้ความเข้าใจกันที่ดีเป็นพื้นฐานในการสร้างอนาคตร่วมกัน'
  ],
  [CompatibilityLevel.VERY_GOOD]: [
    'เปิดใจรับฟังความคิดเห็นที่แตกต่างและเรียนรู้จากกัน',
    'สร้างช่วงเวลาพิเศษร่วมกันอย่างสม่ำเสมอ',
    'แสดงความชื่นชมและขอบคุณกันบ่อยๆ',
    'ร่วมกันวางแผนอนาคตและเป้าหมายที่ชัดเจน'
  ],
  [CompatibilityLevel.GOOD]: [
    'ใช้เวลาในการทำความรู้จักกันอย่างลึกซึ้ง',
    'สื่อสารอย่างตรงไปตรงมาและอดทนรับฟัง',
    'หาจุดร่วมและสร้างความทรงจำดีๆ ร่วมกัน',
    'ยอมรับและเคารพในความแตกต่างของกันและกัน',
    'มุ่งเน้นที่จุดแข็งของความสัมพันธ์'
  ],
  [CompatibilityLevel.MODERATE]: [
    'ต้องมีความตั้งใจจริงในการทำความเข้าใจกัน',
    'หาจุดประนีประนอมที่ทั้งคู่พอใจได้',
    'ใช้ความขัดแย้งเป็นโอกาสในการเรียนรู้',
    'สร้างกฎเกณฑ์และขอบเขตที่ชัดเจนร่วมกัน',
    'อาจต้องการคำแนะนำจากบุคคลที่สาม',
    'ประเมินความสัมพันธ์อย่างสม่ำเสมอว่าคุ้มค่ากับความพยายามหรือไม่'
  ],
  [CompatibilityLevel.CHALLENGING]: [
    'พิจารณาอย่างรอบคอบว่าความสัมพันธ์นี้เหมาะสมกับคุณหรือไม่',
    'หากตัดสินใจดำเนินต่อ ต้องเตรียมพร้อมสำหรับความท้าทายที่สูง',
    'ขอคำปรึกษาจากผู้เชี่ยวชาญด้านความสัมพันธ์',
    'ตั้งขอบเขตที่ชัดเจนและเคารพซึ่งกันและกัน',
    'อย่าพยายามเปลี่ยนแปลงอีกฝ่ายให้เป็นอย่างที่คุณต้องการ',
    'รู้จักเวลาที่ควรปล่อยวางหากความสัมพันธ์ไม่เป็นสุข',
    'มุ่งเน้นการเติบโตส่วนบุคคลมากกว่าการบังคับความสัมพันธ์'
  ]
};

/**
 * Element compatibility descriptions in Thai
 */
const ELEMENT_COMPATIBILITY_DESCRIPTIONS: Record<string, Record<string, string>> = {
  fire: {
    fire: 'ไฟ + ไฟ = พลังงานที่เข้มข้นและความหลงใหล แต่ต้องระวังการแข่งขันและความร้อนแรงเกินไป',
    air: 'ไฟ + ลม = ความกลมกลืนที่ดี ลมหล่อเลี้ยงไฟให้ลุกโชน สร้างความตื่นเต้นและแรงบันดาลใจ',
    earth: 'ไฟ + ดิน = ความท้าทาย ไฟต้องการเสรีภาพ ขณะที่ดินต้องการความมั่นคง ต้องหาจุดสมดุล',
    water: 'ไฟ + น้ำ = ความขัดแย้ง น้ำดับไฟ ไฟทำให้น้ำระเหย ต้องใช้ความเข้าใจและการประนีประนอมสูง'
  },
  earth: {
    earth: 'ดิน + ดิน = ความมั่นคงและความไว้วางใจ สร้างรากฐานที่แข็งแกร่งสำหรับอนาคต',
    water: 'ดิน + น้ำ = ความกลมกลืนที่ดี น้ำหล่อเลี้ยงดิน ดินกักเก็บน้ำ สร้างความอุดมสมบูรณ์',
    fire: 'ดิน + ไฟ = ความท้าทาย ดินดับไฟ ไฟเผาดิน แต่สามารถสร้างสิ่งใหม่ได้หากมีความเข้าใจ',
    air: 'ดิน + ลม = ความแตกต่าง ดินต้องการความมั่นคง ลมต้องการเสรีภาพ ต้องหาจุดประนีประนอม'
  },
  air: {
    air: 'ลม + ลม = ความเข้าใจและการสื่อสารที่ดีเยี่ยม เต็มไปด้วยความคิดสร้างสรรค์และความสนุกสนาน',
    fire: 'ลม + ไฟ = ความกลมกลืนที่ดี ลมหล่อเลี้ยงไฟ สร้างพลังงานและความตื่นเต้นร่วมกัน',
    water: 'ลม + น้ำ = ความท้าทาย ลมสร้างคลื่นในน้ำ น้ำทำให้ลมหนักขึ้น ต้องหาความสมดุล',
    earth: 'ลม + ดิน = ความแตกต่าง ลมต้องการเปลี่ยนแปลง ดินต้องการความคงที่ ต้องเรียนรู้ซึ่งกันและกัน'
  },
  water: {
    water: 'น้ำ + น้ำ = ความเข้าใจทางอารมณ์ที่ลึกซึ้ง เต็มไปด้วยความเห็นอกเห็นใจและความอ่อนโยน',
    earth: 'น้ำ + ดิน = ความกลมกลืนที่ดี น้ำหล่อเลี้ยงดิน ดินกักเก็บน้ำ สร้างความมั่นคงร่วมกัน',
    air: 'น้ำ + ลม = ความท้าทาย น้ำต้องการความลึก ลมต้องการความเบา ต้องหาจุดเชื่อมโยง',
    fire: 'น้ำ + ไฟ = ความขัดแย้ง น้ำดับไฟ ไฟทำให้น้ำระเหย แต่สามารถสร้างสมดุลได้หากมีความพยายาม'
  }
};

/**
 * Get element compatibility description
 */
export function getElementCompatibilityDescription(
  sign1: ZodiacSign,
  sign2: ZodiacSign
): string {
  const metadata1 = getZodiacMetadata(sign1);
  const metadata2 = getZodiacMetadata(sign2);
  
  return ELEMENT_COMPATIBILITY_DESCRIPTIONS[metadata1.element][metadata2.element];
}

/**
 * Get baseline strengths for a compatibility level
 */
export function getBaselineStrengths(level: CompatibilityLevel): string[] {
  const strengths = STRENGTHS_BY_LEVEL[level];
  // Return 3-4 strengths randomly selected but deterministically based on level
  const count = level === CompatibilityLevel.EXCELLENT || level === CompatibilityLevel.VERY_GOOD ? 4 : 3;
  return strengths.slice(0, count);
}

/**
 * Get baseline challenges for a compatibility level
 */
export function getBaselineChallenges(level: CompatibilityLevel): string[] {
  const challenges = CHALLENGES_BY_LEVEL[level];
  // Return 3-4 challenges
  const count = level === CompatibilityLevel.CHALLENGING || level === CompatibilityLevel.MODERATE ? 4 : 3;
  return challenges.slice(0, count);
}

/**
 * Get baseline advice for a compatibility level
 */
export function getBaselineAdvice(level: CompatibilityLevel): string {
  const adviceList = ADVICE_BY_LEVEL[level];
  // Return first 2-3 pieces of advice as a combined string
  const count = level === CompatibilityLevel.CHALLENGING || level === CompatibilityLevel.MODERATE ? 3 : 2;
  return adviceList.slice(0, count).join(' ');
}

/**
 * Generate complete baseline compatibility interpretation
 */
export function generateBaselineCompatibilityInterpretation(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  overallScore: number
): {
  strengths: string[];
  challenges: string[];
  advice: string;
  elementCompatibility: string;
} {
  const level = getCompatibilityLevel(overallScore);
  
  return {
    strengths: getBaselineStrengths(level),
    challenges: getBaselineChallenges(level),
    advice: getBaselineAdvice(level),
    elementCompatibility: getElementCompatibilityDescription(sign1, sign2)
  };
}
