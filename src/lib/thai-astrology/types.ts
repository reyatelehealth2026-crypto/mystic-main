// Thai Astrology (โหราศาสตร์ไทย) Types
// สำหรับระบบดูดวงความรักแบบไทย

export enum ThaiZodiacSign {
  // ลัคนา 12 ราศี (ตามโหราศาสตร์ไทย)
  MES = 'mes',      // เมษ - ราศีเมษ
  PHRUET = 'phruet', // พฤษภ - ราศีพฤษภ  
  MITHUN = 'mithun', // มิถุน - ราศีมิถุน
  KRAKAT = 'krakat', // กรกฎ - ราศีกรกฎ
  SING = 'sing',     // สิงห์ - ราศีสิงห์
  KUN = 'kun',       // กันย์ - ราศีกันย์
  TUN = 'tun',       // ตุลย์ - ราศีตุลย์
  PHIK = 'phik',     // พิจิก - ราศีพิจิก
  THANU = 'thanu',   // ธนู - ราศีธนู
  MAKOK = 'makok',   // มังกร - ราศีมังกร
  KUM = 'kum',       // กุมภ์ - ราศีกุมภ์
  MIN = 'min',       // มีน - ราศีมีน
}

export enum ThaiDay {
  // วันเกิดตามจันทรคติ
  ARWAN = 'arwan',     // วันอาทิตย์
  JAN = 'jan',         // วันจันทร์
  ANGKAN = 'angkan',   // วันอังคาร
  PHUT = 'phut',       // วันพุธ
  PHAHAT = 'phahat',   // วันพฤหัสบดี
  SUK = 'suk',         // วันศุกร์
  SAO = 'sao',         // วันเสาร์
}

export enum ThaiYearAnimal {
  // นักษัตร 12 ปี
  CHUAT = 'chuat',     // ชวด - หนู
  CHAL = 'chal',       // ฉลู - วัว
  KHAN = 'khan',       // ขาล - เสือ
  THO = 'tho',         // เถาะ - กระต่าย
  MARONG = 'marong',   // มะโรง - มังกร
  MASENG = 'maseng',   // มะเส็ง - งู
  MAMIA = 'mamia',     // มะเมีย - ม้า
  MAMAENG = 'mamaeng', // มะแม - แพะ
  WOK = 'wok',         // วอก - ลิง
  RAKA = 'raka',       // ระกา - ไก่
  CHO = 'cho',         // จอ - สุนัข
  KUNN = 'kunn',       // กุน - หมู
}

export enum ThaiElement {
  // ธาตุ 5 ธาตุ (ไทย)
  WOOD = 'wood',    // ธาตุไม้
  FIRE = 'fire',    // ธาตุไฟ
  EARTH = 'earth',  // ธาตุดิน
  METAL = 'metal',  // ธาตุทอง
  WATER = 'water',  // ธาตุน้ำ
}

export interface ThaiCompatibilityInput {
  person1: {
    birthDate: Date;
    birthTime?: string;      // เวลาเกิด (HH:MM)
    birthLocation?: string;  // สถานที่เกิด
  };
  person2: {
    birthDate: Date;
    birthTime?: string;
    birthLocation?: string;
  };
}

export interface ThaiCompatibilityReading {
  person1: {
    birthDate: Date;
    day: ThaiDay;                    // วันเกิด
    yearAnimal: ThaiYearAnimal;      // นักษัตรปีเกิด
    ascendant?: ThaiZodiacSign;      // ลัคนา (ถ้ามีเวลาเกิด)
    element: ThaiElement;            // ธาตุประจำตัว
  };
  person2: {
    birthDate: Date;
    day: ThaiDay;
    yearAnimal: ThaiYearAnimal;
    ascendant?: ThaiZodiacSign;
    element: ThaiElement;
  };
  overallScore: number;              // คะแนนความเข้ากัน 0-100
  scores: {
    dayCompatibility: number;        // เข้ากันของวัน
    animalCompatibility: number;     // เข้ากันของนักษัตร
    elementCompatibility: number;    // เข้ากันของธาตุ
    ascendantCompatibility?: number; // เข้ากันของลัคนา (ถ้ามี)
  };
  interpretation: {
    summary: string;                 // สรุปภาพรวม
    strengths: string[];             // จุดแข็ง
    challenges: string[];            // ความท้าทาย
    advice: string;                  // คำแนะนำ
    auspicious: string[];            // เคล็ดลับเสริมดวง
  };
}

// ความหมายวันเกิด
export const THAI_DAY_MEANINGS: Record<ThaiDay, {
  name: string;
  color: string;
  direction: string;
  traits: string[];
}> = {
  [ThaiDay.ARWAN]: {
    name: 'วันอาทิตย์',
    color: 'แดง',
    direction: 'ทิศตะวันออก',
    traits: ['มั่นใจ', 'เป็นผู้นำ', 'มีพลัง', 'ตรงไปตรงมา'],
  },
  [ThaiDay.JAN]: {
    name: 'วันจันทร์',
    color: 'เหลือง',
    direction: 'ทิศตะวันออกเฉียงเหนือ',
    traits: ['อ่อนโยน', 'รักความสงบ', 'มีเมตตา', 'ปรับตัวเก่ง'],
  },
  [ThaiDay.ANGKAN]: {
    name: 'วันอังคาร',
    color: 'ชมพู',
    direction: 'ทิศตะวันตกเฉียงใต้',
    traits: ['กล้าหาญ', 'มุ่งมั่น', 'ใจร้อน', 'ตัดสินใจไว'],
  },
  [ThaiDay.PHUT]: {
    name: 'วันพุธ',
    color: 'เขียว',
    direction: 'ทิศตะวันตกเฉียงเหนือ',
    traits: ['ฉลาด', 'สื่อสารเก่ง', 'ช่างพูด', 'ปรับตัวเร็ว'],
  },
  [ThaiDay.PHAHAT]: {
    name: 'วันพฤหัสบดี',
    color: 'ส้ม',
    direction: 'ทิศตะวันออกเฉียงใต้',
    traits: ['มีปัญญา', 'รักความยุติธรรม', 'กว้างขวาง', 'ใจดี'],
  },
  [ThaiDay.SUK]: {
    name: 'วันศุกร์',
    color: 'ฟ้า',
    direction: 'ทิศตะวันตกเฉียงเหนือ',
    traits: ['มีเสน่ห์', 'รักความสวยงาม', 'อ่อนโยน', 'เข้ากับคนง่าย'],
  },
  [ThaiDay.SAO]: {
    name: 'วันเสาร์',
    color: 'ดำ',
    direction: 'ทิศตะวันตก',
    traits: ['ขยัน', 'อดทน', 'รอบคอบ', 'ชอบความมั่นคง'],
  },
};

// ความหมายนักษัตร
export const THAI_YEAR_ANIMAL_MEANINGS: Record<ThaiYearAnimal, {
  name: string;
  animal: string;
  element: ThaiElement;
  traits: string[];
}> = {
  [ThaiYearAnimal.CHUAT]: { name: 'ชวด', animal: 'หนู', element: ThaiElement.WATER, traits: ['ฉลาด', 'ปรับตัวเก่ง', 'ขยัน', 'ชอบสะสม'] },
  [ThaiYearAnimal.CHAL]: { name: 'ฉลู', animal: 'วัว', element: ThaiElement.EARTH, traits: ['อดทน', 'ขยัน', 'ซื่อสัตย์', 'มั่นคง'] },
  [ThaiYearAnimal.KHAN]: { name: 'ขาล', animal: 'เสือ', element: ThaiElement.WOOD, traits: ['กล้าหาญ', 'อิสระ', 'มั่นใจ', 'เป็นผู้นำ'] },
  [ThaiYearAnimal.THO]: { name: 'เถาะ', animal: 'กระต่าย', element: ThaiElement.WOOD, traits: ['อ่อนโยน', 'ระมัดระวัง', 'ฉลาด', 'โชคดี'] },
  [ThaiYearAnimal.MARONG]: { name: 'มะโรง', animal: 'มังกร', element: ThaiElement.EARTH, traits: ['อำนาจ', 'มีพลัง', 'โชคลาภ', 'มั่นใจ'] },
  [ThaiYearAnimal.MASENG]: { name: 'มะเส็ง', animal: 'งู', element: ThaiElement.FIRE, traits: ['ฉลาด', 'ลึกลับ', 'มีเสน่ห์', 'รอบคอบ'] },
  [ThaiYearAnimal.MAMIA]: { name: 'มะเมีย', animal: 'ม้า', element: ThaiElement.FIRE, traits: ['กระตือรือร้น', 'อิสระ', 'รักความยุติธรรม', 'กล้าได้กล้าเสีย'] },
  [ThaiYearAnimal.MAMAENG]: { name: 'มะแม', animal: 'แพะ', element: ThaiElement.EARTH, traits: ['ศิลปิน', 'อ่อนโยน', 'มีเมตตา', 'ชอบความสวยงาม'] },
  [ThaiYearAnimal.WOK]: { name: 'วอก', animal: 'ลิง', element: ThaiElement.METAL, traits: ['ฉลาด', 'คิดเร็ว', 'ช่างพูด', 'ปรับตัวเก่ง'] },
  [ThaiYearAnimal.RAKA]: { name: 'ระกา', animal: 'ไก่', element: ThaiElement.METAL, traits: ['ตรงเวลา', 'ซื่อสัตย์', 'ขยัน', 'รอบคอบ'] },
  [ThaiYearAnimal.CHO]: { name: 'จอ', animal: 'สุนัข', element: ThaiElement.EARTH, traits: ['ซื่อสัตย์', 'ปกป้อง', 'กล้าหาญ', 'มีความรับผิดชอบ'] },
  [ThaiYearAnimal.KUNN]: { name: 'กุน', animal: 'หมู', element: ThaiElement.WATER, traits: ['ใจดี', 'โชคดี', 'รักความสุข', 'มั่นคง'] },
};
