// Chinese Zodiac Animal and Element Definitions
// Feature: popular-fortune-features

import { ChineseZodiacAnimal, ChineseElement } from './types';

/**
 * Metadata for each Chinese zodiac animal
 */
export interface AnimalMetadata {
  animal: ChineseZodiacAnimal;
  thaiName: string;
  chineseName: string;
  element: ChineseElement; // Default element for this animal
  traits: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
}

/**
 * Metadata for each Chinese element
 */
export interface ElementMetadata {
  element: ChineseElement;
  thaiName: string;
  chineseName: string;
  colors: string[];
  characteristics: string[];
}

/**
 * All 12 Chinese zodiac animals with their metadata
 */
export const ANIMAL_METADATA: Record<ChineseZodiacAnimal, AnimalMetadata> = {
  [ChineseZodiacAnimal.RAT]: {
    animal: ChineseZodiacAnimal.RAT,
    thaiName: 'ปีชวด',
    chineseName: '鼠 (Shǔ)',
    element: ChineseElement.WATER,
    traits: ['ฉลาด', 'มีไหวพริบ', 'ปรับตัวได้ดี', 'ขยัน'],
    luckyColors: ['น้ำเงิน', 'ทอง', 'เขียว'],
    luckyNumbers: [2, 3],
    luckyDirections: ['ตะวันออกเฉียงใต้', 'ตะวันออกเฉียงเหนือ']
  },
  [ChineseZodiacAnimal.OX]: {
    animal: ChineseZodiacAnimal.OX,
    thaiName: 'ปีฉลู',
    chineseName: '牛 (Niú)',
    element: ChineseElement.EARTH,
    traits: ['อดทน', 'มั่นคง', 'ซื่อสัตย์', 'มีความรับผิดชอบ'],
    luckyColors: ['เหลือง', 'เขียว', 'ขาว'],
    luckyNumbers: [1, 4],
    luckyDirections: ['ทิศเหนือ', 'ทิศใต้']
  },
  [ChineseZodiacAnimal.TIGER]: {
    animal: ChineseZodiacAnimal.TIGER,
    thaiName: 'ปีขาล',
    chineseName: '虎 (Hǔ)',
    element: ChineseElement.WOOD,
    traits: ['กล้าหาญ', 'มั่นใจ', 'มีเสน่ห์', 'ผู้นำ'],
    luckyColors: ['ส้ม', 'เทา', 'น้ำเงิน'],
    luckyNumbers: [1, 3, 4],
    luckyDirections: ['ทิศใต้', 'ทิศตะวันออก']
  },
  [ChineseZodiacAnimal.RABBIT]: {
    animal: ChineseZodiacAnimal.RABBIT,
    thaiName: 'ปีเถาะ',
    chineseName: '兔 (Tù)',
    element: ChineseElement.WOOD,
    traits: ['อ่อนโยน', 'มีรสนิยม', 'ใจเย็น', 'เห็นอกเห็นใจ'],
    luckyColors: ['แดง', 'ชมพู', 'ม่วง', 'น้ำเงิน'],
    luckyNumbers: [3, 4, 6],
    luckyDirections: ['ทิศตะวันออก', 'ทิศใต้', 'ทิศตะวันตกเฉียงเหนือ']
  },
  [ChineseZodiacAnimal.DRAGON]: {
    animal: ChineseZodiacAnimal.DRAGON,
    thaiName: 'ปีมะโรง',
    chineseName: '龍 (Lóng)',
    element: ChineseElement.EARTH,
    traits: ['ทรงพลัง', 'มีเสน่ห์', 'โชคดี', 'มีความมุ่งมั่น'],
    luckyColors: ['ทอง', 'เงิน', 'เทา'],
    luckyNumbers: [1, 6, 7],
    luckyDirections: ['ทิศตะวันออก', 'ทิศเหนือ', 'ทิศใต้']
  },
  [ChineseZodiacAnimal.SNAKE]: {
    animal: ChineseZodiacAnimal.SNAKE,
    thaiName: 'ปีมะเส็ง',
    chineseName: '蛇 (Shé)',
    element: ChineseElement.FIRE,
    traits: ['ฉลาด', 'ลึกลับ', 'มีสัญชาตญาณ', 'มีเสน่ห์'],
    luckyColors: ['แดง', 'เหลือง', 'ดำ'],
    luckyNumbers: [2, 8, 9],
    luckyDirections: ['ทิศตะวันออกเฉียงใต้', 'ทิศใต้', 'ทิศตะวันตกเฉียงใต้']
  },
  [ChineseZodiacAnimal.HORSE]: {
    animal: ChineseZodiacAnimal.HORSE,
    thaiName: 'ปีมะเมีย',
    chineseName: '馬 (Mǎ)',
    element: ChineseElement.FIRE,
    traits: ['กระตือรือร้น', 'เป็นอิสระ', 'มีพลัง', 'เป็นมิตร'],
    luckyColors: ['เหลือง', 'เขียว', 'ม่วง'],
    luckyNumbers: [2, 3, 7],
    luckyDirections: ['ทิศตะวันออกเฉียงใต้', 'ทิศตะวันตก', 'ทิศตะวันตกเฉียงใต้']
  },
  [ChineseZodiacAnimal.GOAT]: {
    animal: ChineseZodiacAnimal.GOAT,
    thaiName: 'ปีมะแม',
    chineseName: '羊 (Yáng)',
    element: ChineseElement.EARTH,
    traits: ['สร้างสรรค์', 'อ่อนโยน', 'เห็นอกเห็นใจ', 'มีศิลปะ'],
    luckyColors: ['เขียว', 'แดง', 'ม่วง'],
    luckyNumbers: [2, 7],
    luckyDirections: ['ทิศเหนือ', 'ทิศตะวันตกเฉียงเหนือ']
  },
  [ChineseZodiacAnimal.MONKEY]: {
    animal: ChineseZodiacAnimal.MONKEY,
    thaiName: 'ปีวอก',
    chineseName: '猴 (Hóu)',
    element: ChineseElement.METAL,
    traits: ['ฉลาด', 'มีไหวพริบ', 'สนุกสนาน', 'ยืดหยุ่น'],
    luckyColors: ['ขาว', 'น้ำเงิน', 'ทอง'],
    luckyNumbers: [1, 7, 8],
    luckyDirections: ['ทิศเหนือ', 'ทิศตะวันตกเฉียงเหนือ', 'ทิศตะวันตก']
  },
  [ChineseZodiacAnimal.ROOSTER]: {
    animal: ChineseZodiacAnimal.ROOSTER,
    thaiName: 'ปีระกา',
    chineseName: '雞 (Jī)',
    element: ChineseElement.METAL,
    traits: ['มั่นใจ', 'ตรงไปตรงมา', 'ขยัน', 'มีระเบียบ'],
    luckyColors: ['ทอง', 'น้ำตาล', 'เหลือง'],
    luckyNumbers: [5, 7, 8],
    luckyDirections: ['ทิศใต้', 'ทิศตะวันออกเฉียงใต้']
  },
  [ChineseZodiacAnimal.DOG]: {
    animal: ChineseZodiacAnimal.DOG,
    thaiName: 'ปีจอ',
    chineseName: '狗 (Gǒu)',
    element: ChineseElement.EARTH,
    traits: ['ซื่อสัตย์', 'ภักดี', 'มีความรับผิดชอบ', 'เป็นมิตร'],
    luckyColors: ['แดง', 'เขียว', 'ม่วง'],
    luckyNumbers: [3, 4, 9],
    luckyDirections: ['ทิศตะวันออก', 'ทิศใต้', 'ทิศตะวันตกเฉียงเหนือ']
  },
  [ChineseZodiacAnimal.PIG]: {
    animal: ChineseZodiacAnimal.PIG,
    thaiName: 'ปีกุน',
    chineseName: '豬 (Zhū)',
    element: ChineseElement.WATER,
    traits: ['เอื้อเฟื้อ', 'เห็นอกเห็นใจ', 'ซื่อสัตย์', 'มีความสุข'],
    luckyColors: ['เหลือง', 'เทา', 'น้ำตาล', 'ทอง'],
    luckyNumbers: [2, 5, 8],
    luckyDirections: ['ทิศตะวันออกเฉียงใต้', 'ทิศตะวันออกเฉียงเหนือ']
  }
};

/**
 * All 5 Chinese elements with their metadata
 */
export const ELEMENT_METADATA: Record<ChineseElement, ElementMetadata> = {
  [ChineseElement.WOOD]: {
    element: ChineseElement.WOOD,
    thaiName: 'ไม้',
    chineseName: '木 (Mù)',
    colors: ['เขียว', 'เขียวอ่อน'],
    characteristics: ['เติบโต', 'ขยายตัว', 'สร้างสรรค์', 'ยืดหยุ่น']
  },
  [ChineseElement.FIRE]: {
    element: ChineseElement.FIRE,
    thaiName: 'ไฟ',
    chineseName: '火 (Huǒ)',
    colors: ['แดง', 'ส้ม', 'ชมพู'],
    characteristics: ['กระตือรือร้น', 'มีพลัง', 'หลงใหล', 'เปลี่ยนแปลง']
  },
  [ChineseElement.EARTH]: {
    element: ChineseElement.EARTH,
    thaiName: 'ดิน',
    chineseName: '土 (Tǔ)',
    colors: ['เหลือง', 'น้ำตาล', 'ส้มอ่อน'],
    characteristics: ['มั่นคง', 'เชื่อถือได้', 'ปฏิบัติจริง', 'อดทน']
  },
  [ChineseElement.METAL]: {
    element: ChineseElement.METAL,
    thaiName: 'โลหะ',
    chineseName: '金 (Jīn)',
    colors: ['ขาว', 'ทอง', 'เงิน'],
    characteristics: ['แข็งแกร่ง', 'มีระเบียบ', 'มุ่งมั่น', 'ยุติธรรม']
  },
  [ChineseElement.WATER]: {
    element: ChineseElement.WATER,
    thaiName: 'น้ำ',
    chineseName: '水 (Shuǐ)',
    colors: ['น้ำเงิน', 'ดำ', 'น้ำเงินเข้ม'],
    characteristics: ['ปรับตัวได้', 'ไหลลื่น', 'ลึกซึ้ง', 'สงบ']
  }
};

/**
 * Calculate Chinese zodiac animal from birth year
 * Formula: (year - 4) % 12
 * 
 * @param birthYear - The birth year (e.g., 2024)
 * @returns The Chinese zodiac animal
 * 
 * @example
 * calculateChineseZodiac(2024) // Returns ChineseZodiacAnimal.DRAGON
 * calculateChineseZodiac(2025) // Returns ChineseZodiacAnimal.SNAKE
 */
export function calculateChineseZodiac(birthYear: number): ChineseZodiacAnimal {
  // The formula (year - 4) % 12 maps years to animals
  // Year 4 AD was the year of the Rat (index 0)
  const animalIndex = (birthYear - 4) % 12;
  
  // Map index to animal
  const animals = [
    ChineseZodiacAnimal.RAT,      // 0
    ChineseZodiacAnimal.OX,       // 1
    ChineseZodiacAnimal.TIGER,    // 2
    ChineseZodiacAnimal.RABBIT,   // 3
    ChineseZodiacAnimal.DRAGON,   // 4
    ChineseZodiacAnimal.SNAKE,    // 5
    ChineseZodiacAnimal.HORSE,    // 6
    ChineseZodiacAnimal.GOAT,     // 7
    ChineseZodiacAnimal.MONKEY,   // 8
    ChineseZodiacAnimal.ROOSTER,  // 9
    ChineseZodiacAnimal.DOG,      // 10
    ChineseZodiacAnimal.PIG       // 11
  ];
  
  return animals[animalIndex];
}

/**
 * Calculate Chinese element from birth year
 * Formula: floor((year - 4) % 10 / 2)
 * 
 * @param birthYear - The birth year (e.g., 2024)
 * @returns The Chinese element
 * 
 * @example
 * calculateChineseElement(2024) // Returns ChineseElement.WOOD
 * calculateChineseElement(2025) // Returns ChineseElement.WOOD
 */
export function calculateChineseElement(birthYear: number): ChineseElement {
  // The formula floor((year - 4) % 10 / 2) maps years to elements
  // Each element spans 2 years in the 10-year cycle
  const elementIndex = Math.floor(((birthYear - 4) % 10) / 2);
  
  // Map index to element
  const elements = [
    ChineseElement.WOOD,   // 0: years ending in 4, 5
    ChineseElement.FIRE,   // 1: years ending in 6, 7
    ChineseElement.EARTH,  // 2: years ending in 8, 9
    ChineseElement.METAL,  // 3: years ending in 0, 1
    ChineseElement.WATER   // 4: years ending in 2, 3
  ];
  
  return elements[elementIndex];
}

/**
 * Get metadata for a specific animal
 */
export function getAnimalMetadata(animal: ChineseZodiacAnimal): AnimalMetadata {
  return ANIMAL_METADATA[animal];
}

/**
 * Get metadata for a specific element
 */
export function getElementMetadata(element: ChineseElement): ElementMetadata {
  return ELEMENT_METADATA[element];
}

/**
 * Get Thai name for an animal
 */
export function getAnimalThaiName(animal: ChineseZodiacAnimal): string {
  return ANIMAL_METADATA[animal].thaiName;
}

/**
 * Get Chinese name for an animal
 */
export function getAnimalChineseName(animal: ChineseZodiacAnimal): string {
  return ANIMAL_METADATA[animal].chineseName;
}

/**
 * Get Thai name for an element
 */
export function getElementThaiName(element: ChineseElement): string {
  return ELEMENT_METADATA[element].thaiName;
}

/**
 * Get Chinese name for an element
 */
export function getElementChineseName(element: ChineseElement): string {
  return ELEMENT_METADATA[element].chineseName;
}

/**
 * Get all animals with their metadata
 */
export function getAllAnimals(): AnimalMetadata[] {
  return Object.values(ANIMAL_METADATA);
}

/**
 * Get all elements with their metadata
 */
export function getAllElements(): ElementMetadata[] {
  return Object.values(ELEMENT_METADATA);
}
