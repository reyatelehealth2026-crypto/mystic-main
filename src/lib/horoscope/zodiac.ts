// Zodiac Sign Utilities for REFFORTUNE
// Feature: popular-fortune-features
// Handles Western zodiac sign calculations and metadata

import { ZodiacSign } from './types';

/**
 * Zodiac sign metadata including Thai names, elements, and traits
 */
export interface ZodiacMetadata {
  sign: ZodiacSign;
  thaiName: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  rulingPlanet: string;
  dateRange: { 
    start: { month: number; day: number }; 
    end: { month: number; day: number } 
  };
  symbol: string;
  traits: string[];
}

/**
 * Complete zodiac sign metadata for all 12 signs
 * Date ranges follow standard Western astrology
 */
const ZODIAC_METADATA: Record<ZodiacSign, ZodiacMetadata> = {
  [ZodiacSign.ARIES]: {
    sign: ZodiacSign.ARIES,
    thaiName: 'เมษ',
    element: 'fire',
    quality: 'cardinal',
    rulingPlanet: 'Mars',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    symbol: '♈',
    traits: ['กล้าหาญ', 'มีพลัง', 'มั่นใจ', 'ตรงไปตรงมา', 'เป็นผู้นำ']
  },
  [ZodiacSign.TAURUS]: {
    sign: ZodiacSign.TAURUS,
    thaiName: 'พฤษภ',
    element: 'earth',
    quality: 'fixed',
    rulingPlanet: 'Venus',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    symbol: '♉',
    traits: ['มั่นคง', 'อดทน', 'ซื่อสัตย์', 'รักความสุขสบาย', 'มีความรับผิดชอบ']
  },
  [ZodiacSign.GEMINI]: {
    sign: ZodiacSign.GEMINI,
    thaiName: 'มิถุน',
    element: 'air',
    quality: 'mutable',
    rulingPlanet: 'Mercury',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    symbol: '♊',
    traits: ['ฉลาด', 'สื่อสารเก่ง', 'ปรับตัวได้ดี', 'อยากรู้อยากเห็น', 'มีไหวพริบ']
  },
  [ZodiacSign.CANCER]: {
    sign: ZodiacSign.CANCER,
    thaiName: 'กรกฎ',
    element: 'water',
    quality: 'cardinal',
    rulingPlanet: 'Moon',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    symbol: '♋',
    traits: ['อ่อนไหว', 'เห็นอกเห็นใจ', 'ดูแลคนอื่น', 'มีสัญชาตญาณ', 'รักครอบครัว']
  },
  [ZodiacSign.LEO]: {
    sign: ZodiacSign.LEO,
    thaiName: 'สิงห์',
    element: 'fire',
    quality: 'fixed',
    rulingPlanet: 'Sun',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    symbol: '♌',
    traits: ['มั่นใจ', 'มีเสน่ห์', 'ใจกว้าง', 'สร้างสรรค์', 'เป็นผู้นำ']
  },
  [ZodiacSign.VIRGO]: {
    sign: ZodiacSign.VIRGO,
    thaiName: 'กันย์',
    element: 'earth',
    quality: 'mutable',
    rulingPlanet: 'Mercury',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    symbol: '♍',
    traits: ['ละเอียดรอบคอบ', 'วิเคราะห์เก่ง', 'ช่วยเหลือผู้อื่น', 'มีระเบียบ', 'ปฏิบัติจริง']
  },
  [ZodiacSign.LIBRA]: {
    sign: ZodiacSign.LIBRA,
    thaiName: 'ตุล',
    element: 'air',
    quality: 'cardinal',
    rulingPlanet: 'Venus',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    symbol: '♎',
    traits: ['ยุติธรรม', 'ชอบความสมดุล', 'เข้ากับคนง่าย', 'มีรสนิยม', 'ทูต']
  },
  [ZodiacSign.SCORPIO]: {
    sign: ZodiacSign.SCORPIO,
    thaiName: 'พิจิก',
    element: 'water',
    quality: 'fixed',
    rulingPlanet: 'Pluto',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    symbol: '♏',
    traits: ['เข้มแข็ง', 'มุ่งมั่น', 'ลึกลับ', 'หลงใหล', 'มีพลังจิต']
  },
  [ZodiacSign.SAGITTARIUS]: {
    sign: ZodiacSign.SAGITTARIUS,
    thaiName: 'ธนู',
    element: 'fire',
    quality: 'mutable',
    rulingPlanet: 'Jupiter',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    symbol: '♐',
    traits: ['มองโลกในแง่ดี', 'รักอิสระ', 'ผจญภัย', 'ตรงไปตรงมา', 'ปรัชญา']
  },
  [ZodiacSign.CAPRICORN]: {
    sign: ZodiacSign.CAPRICORN,
    thaiName: 'มังกร',
    element: 'earth',
    quality: 'cardinal',
    rulingPlanet: 'Saturn',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    symbol: '♑',
    traits: ['มีวินัย', 'ทะเยอทะยาน', 'รับผิดชอบ', 'อดทน', 'ปฏิบัติจริง']
  },
  [ZodiacSign.AQUARIUS]: {
    sign: ZodiacSign.AQUARIUS,
    thaiName: 'กุมภ์',
    element: 'air',
    quality: 'fixed',
    rulingPlanet: 'Uranus',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    symbol: '♒',
    traits: ['เป็นตัวของตัวเอง', 'มีวิสัยทัศน์', 'มนุษยธรรม', 'เป็นนวัตกร', 'เป็นอิสระ']
  },
  [ZodiacSign.PISCES]: {
    sign: ZodiacSign.PISCES,
    thaiName: 'มีน',
    element: 'water',
    quality: 'mutable',
    rulingPlanet: 'Neptune',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    symbol: '♓',
    traits: ['เห็นอกเห็นใจ', 'จินตนาการสูง', 'ศิลปิน', 'ใจดี', 'มีสัญชาตญาณ']
  }
};

/**
 * Calculate zodiac sign from birth date
 * 
 * @param birthDate - Date of birth
 * @returns The corresponding zodiac sign
 * 
 * @example
 * calculateZodiacSign(new Date('1990-04-15')) // Returns ZodiacSign.ARIES
 * calculateZodiacSign(new Date('1990-04-20')) // Returns ZodiacSign.TAURUS
 */
export function calculateZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const day = birthDate.getDate();

  // Check each zodiac sign's date range
  for (const metadata of Object.values(ZODIAC_METADATA)) {
    const { start, end } = metadata.dateRange;
    
    // Handle zodiac signs that span across year boundary (Capricorn)
    if (start.month > end.month) {
      // Capricorn: Dec 22 - Jan 19
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day)
      ) {
        return metadata.sign;
      }
    } else {
      // Normal case: sign within same year
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month)
      ) {
        return metadata.sign;
      }
    }
  }

  // Fallback (should never reach here with valid date)
  return ZodiacSign.ARIES;
}

/**
 * Get complete metadata for a zodiac sign
 * 
 * @param sign - The zodiac sign
 * @returns Complete metadata including Thai name, element, traits, etc.
 * 
 * @example
 * const metadata = getZodiacMetadata(ZodiacSign.ARIES);
 * console.log(metadata.thaiName); // 'เมษ'
 * console.log(metadata.element); // 'fire'
 */
export function getZodiacMetadata(sign: ZodiacSign): ZodiacMetadata {
  return ZODIAC_METADATA[sign];
}

/**
 * Get Thai name for a zodiac sign
 * 
 * @param sign - The zodiac sign
 * @returns Thai name of the zodiac sign
 * 
 * @example
 * getZodiacThaiName(ZodiacSign.ARIES) // Returns 'เมษ'
 * getZodiacThaiName(ZodiacSign.LEO) // Returns 'สิงห์'
 */
export function getZodiacThaiName(sign: ZodiacSign): string {
  return ZODIAC_METADATA[sign].thaiName;
}

/**
 * Get all zodiac signs with their complete metadata
 * 
 * @returns Array of all 12 zodiac signs with metadata
 * 
 * @example
 * const allSigns = getAllZodiacSigns();
 * allSigns.forEach(sign => {
 *   console.log(`${sign.thaiName} (${sign.element})`);
 * });
 */
export function getAllZodiacSigns(): ZodiacMetadata[] {
  return Object.values(ZODIAC_METADATA);
}
