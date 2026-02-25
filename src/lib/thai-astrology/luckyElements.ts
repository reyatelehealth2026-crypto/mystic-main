// Lucky Elements Calculator - คำนวณสิ่งมงคลจากวันเดือนปีเกิด
// ใช้สำหรับเลือกองค์ประกอบในวอลเปเปอร์เสริมดวง

import { ThaiDay, ThaiZodiacSign, ThaiYearAnimal } from "./types";
import { getThaiDay, getThaiYearAnimal } from "./engine";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface LuckyElement {
  id: string;
  label: string;
  en: string; // English description for image generation
  category: "nature" | "symbol" | "animal" | "object";
}

// ──────────────────────────────────────────────
// สิ่งมงคลตามวันเกิด (7 วัน)
// ──────────────────────────────────────────────

const DAY_LUCKY_ELEMENTS: Record<ThaiDay, LuckyElement[]> = {
  [ThaiDay.ARWAN]: [ // วันอาทิตย์ - ธาตุไฟ, สีแดง, ดวงอาทิตย์
    { id: "sun", label: "พระอาทิตย์", en: "golden sun rays, radiant sunshine, solar energy", category: "nature" },
    { id: "ruby", label: "ทับทิม", en: "red ruby gemstone, precious garnet, red crystals", category: "symbol" },
    { id: "phoenix", label: "นกฟีนิกซ์", en: "phoenix bird rising, fire bird, golden phoenix wings", category: "animal" },
    { id: "crown", label: "มงกุฎ", en: "golden royal crown, regal crown with jewels", category: "object" },
  ],
  [ThaiDay.JAN]: [ // วันจันทร์ - ธาตุน้ำ, สีขาว/เหลือง, ดวงจันทร์
    { id: "moon", label: "พระจันทร์", en: "silver crescent moon, lunar glow, moonlight", category: "nature" },
    { id: "lotus", label: "บัวขาว", en: "white lotus flower, sacred lotus, water lily", category: "nature" },
    { id: "pearl", label: "ไข่มุก", en: "lustrous pearls, moon pearls, white pearls", category: "symbol" },
    { id: "rabbit", label: "กระต่าย", en: "gentle rabbit, moon rabbit, white bunny", category: "animal" },
  ],
  [ThaiDay.ANGKAN]: [ // วันอังคาร - ธาตุไฟ, สีชมพู/แดง, ดาวอังคาร
    { id: "rose", label: "กุหลาบแดง", en: "red roses, crimson roses, blooming red flowers", category: "nature" },
    { id: "coral", label: "ปะการัง", en: "red coral, precious coral branches", category: "symbol" },
    { id: "tiger", label: "เสือ", en: "majestic tiger, tiger stripes, tiger energy", category: "animal" },
    { id: "sword", label: "ดาบ", en: "golden sword, ceremonial blade, warrior sword", category: "object" },
  ],
  [ThaiDay.PHUT]: [ // วันพุธ - ธาตุไม้/ดิน, สีเขียว, ดาวพุธ
    { id: "emerald", label: "มรกต", en: "green emerald gemstone, vibrant emeralds", category: "symbol" },
    { id: "bamboo", label: "ไผ่", en: "lucky bamboo, green bamboo stalks, bamboo forest", category: "nature" },
    { id: "owl", label: "นกฮูก", en: "wise owl, owl wisdom, owl feathers", category: "animal" },
    { id: "book", label: "หนังสือ", en: "ancient book, wisdom scroll, knowledge tome", category: "object" },
  ],
  [ThaiDay.PHAHAT]: [ // วันพฤหัส - ธาตุไม้, สีส้ม/เขียว, ดาวพฤหัส
    { id: "amber", label: "อำพัน", en: "golden amber, warm amber glow", category: "symbol" },
    { id: "oak", label: "ต้นโอ๊ก", en: "mighty oak tree, strong tree of life, oak leaves", category: "nature" },
    { id: "elephant", label: "ช้าง", en: "auspicious elephant, wise elephant, royal elephant", category: "animal" },
    { id: "temple", label: "เจดีย์", en: "golden pagoda, Buddhist stupa, sacred temple", category: "object" },
  ],
  [ThaiDay.SUK]: [ // วันศุกร์ - ธาตุทอง, สีฟ้า/ขาว, ดาวศุกร์
    { id: "sapphire", label: "ไพลิน", en: "blue sapphire gemstone, star sapphire", category: "symbol" },
    { id: "orchid", label: "กล้วยไม้", en: "elegant orchids, Thai orchid flowers, purple orchids", category: "nature" },
    { id: "dove", label: "นกพิราบ", en: "white dove, peaceful dove, dove of love", category: "animal" },
    { id: "mirror", label: "กระจก", en: "golden mirror frame, ornate mirror, reflection", category: "object" },
  ],
  [ThaiDay.SAO]: [ // วันเสาร์ - ธาตุดิน, สีม่วง/ดำ, ดาวเสาร์
    { id: "amethyst", label: "อเมทิสต์", en: "purple amethyst crystal, violet gemstone", category: "symbol" },
    { id: "mountain", label: "ภูเขา", en: "majestic mountains, mountain peaks, stable mountain", category: "nature" },
    { id: "tortoise", label: "เต่า", en: "longevity tortoise, black tortoise, turtle shell", category: "animal" },
    { id: "ring", label: "แหวน", en: "black onyx ring, obsidian ring, gemstone ring", category: "object" },
  ],
};

// ──────────────────────────────────────────────
// สิ่งมงคลตามราศี (12 ราศี)
// ──────────────────────────────────────────────

const ZODIAC_LUCKY_ELEMENTS: Record<ThaiZodiacSign, LuckyElement[]> = {
  [ThaiZodiacSign.MES]: [ // เมษ - อังคาร
    { id: "carnation", label: "คาร์เนชั่น", en: "red carnation flowers, blooming carnations", category: "nature" },
    { id: "diamond", label: "เพชร", en: "brilliant diamond, sparkling diamond light", category: "symbol" },
    { id: "ram", label: "แกะ", en: "golden ram horns, ram spirit, powerful ram", category: "animal" },
  ],
  [ThaiZodiacSign.PHRUET]: [ // พฤษภ - ศุกร์
    { id: "rose", label: "กุหลาบ", en: "pink roses, garden roses, fragrant roses", category: "nature" },
    { id: "jade", label: "หยก", en: "green jade stone, jade pendant, precious jade", category: "symbol" },
    { id: "bull", label: "วัว", en: "strong bull, golden bull, bull strength", category: "animal" },
  ],
  [ThaiZodiacSign.MITHUN]: [ // มิถุน - พุธ
    { id: "lavender", label: "ลาเวนเดอร์", en: "purple lavender flowers, lavender field", category: "nature" },
    { id: "agate", label: "หินอาเกต", en: "banded agate stone, colorful agate", category: "symbol" },
    { id: "butterfly", label: "ผีเสื้อ", en: "colorful butterflies, butterfly wings, monarch butterfly", category: "animal" },
  ],
  [ThaiZodiacSign.KRAKAT]: [ // กรกฎ - จันทร์
    { id: "jasmine", label: "มะลิ", en: "white jasmine flowers, Thai jasmine, fragrant jasmine", category: "nature" },
    { id: "moonstone", label: "มูนสโตน", en: "moonstone gem, moonstone glow, lunar stone", category: "symbol" },
    { id: "crab", label: "ปู", en: "golden crab, crab shell, moon crab", category: "animal" },
  ],
  [ThaiZodiacSign.SING]: [ // สิงห์ - อาทิตย์
    { id: "sunflower", label: "ทานตะวัน", en: "bright sunflowers, golden sunflower field", category: "nature" },
    { id: "gold", label: "ทองคำ", en: "pure gold, golden treasure, gold bars", category: "symbol" },
    { id: "lion", label: "สิงโต", en: "mighty lion, golden lion, lion mane", category: "animal" },
  ],
  [ThaiZodiacSign.KUN]: [ // กันย์ - พุธ
    { id: "chrysanthemum", label: "เบญจมาศ", en: "white chrysanthemums, elegant chrysanthemums", category: "nature" },
    { id: "citrine", label: "ซิทริน", en: "golden citrine gem, yellow citrine crystal", category: "symbol" },
    { id: "deer", label: "กวาง", en: "graceful deer, gentle deer, deer antlers", category: "animal" },
  ],
  [ThaiZodiacSign.TUN]: [ // ตุลย์ - ศุกร์
    { id: "rose_balanced", label: "กุหลาบสมดุล", en: "balanced roses, pink and white roses", category: "nature" },
    { id: "opal", label: "โอปอล", en: "precious opal, rainbow opal, opal glow", category: "symbol" },
    { id: "swan", label: "หงส์", en: "elegant swan, swan pair, white swan", category: "animal" },
  ],
  [ThaiZodiacSign.PHIK]: [ // พิจิก - อังคาร
    { id: "geranium", label: "เจอราเนียม", en: "red geranium flowers, deep red blooms", category: "nature" },
    { id: "topaz", label: "โทแพซ", en: "golden topaz gem, imperial topaz", category: "symbol" },
    { id: "eagle", label: "อินทรี", en: "soaring eagle, eagle wings, majestic eagle", category: "animal" },
  ],
  [ThaiZodiacSign.THANU]: [ // ธนู - พฤหัส
    { id: "carnation_pink", label: "คาร์เนชั่นชมพู", en: "pink carnations, soft pink flowers", category: "nature" },
    { id: "turquoise", label: "เทอร์ควอยซ์", en: "turquoise stone, blue-green turquoise", category: "symbol" },
    { id: "horse", label: "ม้า", en: "noble horse, running horse, white horse", category: "animal" },
  ],
  [ThaiZodiacSign.MAKOK]: [ // มังกร - เสาร์
    { id: "pansy", label: "แพนซี่", en: "purple pansies, winter pansies", category: "nature" },
    { id: "onyx", label: "โอนิกซ์", en: "black onyx stone, black gem, onyx crystal", category: "symbol" },
    { id: "goat", label: "แพะ", en: "mountain goat, sure-footed goat, goat horns", category: "animal" },
  ],
  [ThaiZodiacSign.KUM]: [ // กุมภ์ - เสาร์
    { id: "orchid_orchid", label: "กล้วยไม้สีม่วง", en: "purple orchids, exotic orchids", category: "nature" },
    { id: "lapis", label: "ลาพิส", en: "lapis lazuli, deep blue lapis, royal blue stone", category: "symbol" },
    { id: "peacock", label: "นกยูง", en: "peacock feathers, peacock tail, colorful peacock", category: "animal" },
  ],
  [ThaiZodiacSign.MIN]: [ // มีน - พฤหัส
    { id: "water_lily", label: "บัวน้ำ", en: "water lilies, floating lotus, pond flowers", category: "nature" },
    { id: "aquamarine", label: "อความารีน", en: "aquamarine gem, sea blue aquamarine", category: "symbol" },
    { id: "fish", label: "ปลา", en: "golden fish, koi fish, swimming fish", category: "animal" },
  ],
};

// ──────────────────────────────────────────────
// สิ่งมงคลตามนักษัตร (12 ปี)
// ──────────────────────────────────────────────

const ANIMAL_LUCKY_ELEMENTS: Record<ThaiYearAnimal, LuckyElement[]> = {
  [ThaiYearAnimal.CHUAT]: [ // ชวด (หนู) - ปีหนู
    { id: "rat_lucky", label: "นกยูง", en: "peacock feathers display, colorful plumage", category: "animal" },
    { id: "pearl_rat", label: "ไข่มุก", en: "white pearls, pearl necklace, pearl glow", category: "symbol" },
  ],
  [ThaiYearAnimal.CHAL]: [ // ฉลู (วัว) - ปีวัว
    { id: "ox_lucky", label: "ดอกบัว", en: "lotus flower bloom, pink lotus petals", category: "nature" },
    { id: "jade_ox", label: "หยกเขียว", en: "green jade pendant, jade carving", category: "symbol" },
  ],
  [ThaiYearAnimal.KHAN]: [ // ขาล (เสือ) - ปีเสือ
    { id: "tiger_lucky", label: "พระอาทิตย์", en: "rising sun, golden sunrise, solar energy", category: "nature" },
    { id: "ruby_tiger", label: "ทับทิม", en: "red ruby gemstone, burning ruby", category: "symbol" },
  ],
  [ThaiYearAnimal.THO]: [ // เถาะ (กระต่าย) - ปีกระต่าย
    { id: "rabbit_lucky", label: "พระจันทร์", en: "full moon, moonlight glow, silver moon", category: "nature" },
    { id: "moonstone_rabbit", label: "มูนสโตน", en: "moonstone crystal, moonstone pendant", category: "symbol" },
  ],
  [ThaiYearAnimal.MARONG]: [ // มะโรง (มังกร) - ปีมังกร
    { id: "dragon_lucky", label: "มังกรทอง", en: "golden dragon, Chinese dragon, dragon scales", category: "animal" },
    { id: "gold_dragon", label: "ทองคำ", en: "pure gold ingot, golden treasure", category: "symbol" },
  ],
  [ThaiYearAnimal.MASENG]: [ // มะเส็ง (งู) - ปีงู
    { id: "snake_lucky", label: "อัญมณี", en: "precious gems, gemstone collection", category: "symbol" },
    { id: "orchid_snake", label: "กล้วยไม้", en: "orchid flowers, purple orchids", category: "nature" },
  ],
  [ThaiYearAnimal.MAMIA]: [ // มะเมีย (ม้า) - ปีม้า
    { id: "horse_lucky", label: "ตะวัน", en: "bright sun, sunny day, golden sunlight", category: "nature" },
    { id: "amber_horse", label: "อำพัน", en: "golden amber, amber resin, warm amber", category: "symbol" },
  ],
  [ThaiYearAnimal.MAMAENG]: [ // มะแม (แพะ) - ปีแพะ
    { id: "goat_lucky", label: "ดอกไม้", en: "flower garden, blooming flowers", category: "nature" },
    { id: "emerald_goat", label: "มรกต", en: "green emerald, emerald gemstone", category: "symbol" },
  ],
  [ThaiYearAnimal.WOK]: [ // วอก (ลิง) - ปีลิง
    { id: "monkey_lucky", label: "ผลไม้", en: "fruits abundance, golden fruits, peach of immortality", category: "nature" },
    { id: "citrine_monkey", label: "ซิทริน", en: "citrine gem, yellow citrine", category: "symbol" },
  ],
  [ThaiYearAnimal.RAKA]: [ // ระกา (ไก่) - ปีไก่
    { id: "rooster_lucky", label: "เหรียญทอง", en: "gold coins, golden money, prosperity coins", category: "symbol" },
    { id: "coral_rooster", label: "ปะการัง", en: "red coral, coral branches", category: "symbol" },
  ],
  [ThaiYearAnimal.CHO]: [ // จอ (สุนัข) - ปีสุนัข
    { id: "dog_lucky", label: "หยก", en: "green jade, jade pendant, jade protection", category: "symbol" },
    { id: "bamboo_dog", label: "ไผ่", en: "bamboo grove, lucky bamboo", category: "nature" },
  ],
  [ThaiYearAnimal.KUNN]: [ // กุน (หมู) - ปีหมู
    { id: "pig_lucky", label: "เพชร", en: "diamond sparkle, brilliant diamond", category: "symbol" },
    { id: "pearl_pig", label: "ไข่มุก", en: "pearl jewelry, lustrous pearls", category: "symbol" },
  ],
};

// ──────────────────────────────────────────────
// คำนวณราศีจากวันที่เกิด (โหราศาสตร์ไทย)
// ──────────────────────────────────────────────

const ZODIAC_DATE_RANGES: { sign: ThaiZodiacSign; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
  { sign: ThaiZodiacSign.MES,    startMonth: 4,  startDay: 13, endMonth: 5,  endDay: 14 },
  { sign: ThaiZodiacSign.PHRUET, startMonth: 5,  startDay: 15, endMonth: 6,  endDay: 14 },
  { sign: ThaiZodiacSign.MITHUN, startMonth: 6,  startDay: 15, endMonth: 7,  endDay: 15 },
  { sign: ThaiZodiacSign.KRAKAT, startMonth: 7,  startDay: 16, endMonth: 8,  endDay: 16 },
  { sign: ThaiZodiacSign.SING,   startMonth: 8,  startDay: 17, endMonth: 9,  endDay: 16 },
  { sign: ThaiZodiacSign.KUN,    startMonth: 9,  startDay: 17, endMonth: 10, endDay: 16 },
  { sign: ThaiZodiacSign.TUN,    startMonth: 10, startDay: 17, endMonth: 11, endDay: 15 },
  { sign: ThaiZodiacSign.PHIK,   startMonth: 11, startDay: 16, endMonth: 12, endDay: 15 },
  { sign: ThaiZodiacSign.THANU,  startMonth: 12, startDay: 16, endMonth: 1,  endDay: 14 },
  { sign: ThaiZodiacSign.MAKOK,  startMonth: 1,  startDay: 15, endMonth: 2,  endDay: 12 },
  { sign: ThaiZodiacSign.KUM,    startMonth: 2,  startDay: 13, endMonth: 3,  endDay: 14 },
  { sign: ThaiZodiacSign.MIN,    startMonth: 3,  startDay: 15, endMonth: 4,  endDay: 12 },
];

export function getZodiacFromDate(date: Date): ThaiZodiacSign {
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();

  for (const range of ZODIAC_DATE_RANGES) {
    if (range.startMonth <= range.endMonth) {
      if (
        (month === range.startMonth && day >= range.startDay) ||
        (month === range.endMonth && day <= range.endDay) ||
        (month > range.startMonth && month < range.endMonth)
      ) {
        return range.sign;
      }
    } else {
      if (
        (month === range.startMonth && day >= range.startDay) ||
        (month === range.endMonth && day <= range.endDay) ||
        month > range.startMonth ||
        month < range.endMonth
      ) {
        return range.sign;
      }
    }
  }

  return ThaiZodiacSign.MES; // fallback
}

// ──────────────────────────────────────────────
// Main: คำนวณสิ่งมงคลจากวันเดือนปีเกิด
// ──────────────────────────────────────────────

export interface LuckyElementsResult {
  elements: LuckyElement[];
  birthDate: Date;
  thaiDay: ThaiDay;
  zodiac: ThaiZodiacSign;
  yearAnimal: ThaiYearAnimal;
}

export function calculateLuckyElements(birthDate: Date): LuckyElementsResult {
  // 1. วันเกิด (ทักษา)
  const thaiDay = getThaiDay(birthDate);
  const dayElements = DAY_LUCKY_ELEMENTS[thaiDay];

  // 2. ราศี (เดือนเกิด)
  const zodiac = getZodiacFromDate(birthDate);
  const zodiacElements = ZODIAC_LUCKY_ELEMENTS[zodiac];

  // 3. นักษัตร (ปีเกิด)
  const yearAnimal = getThaiYearAnimal(birthDate);
  const animalElements = ANIMAL_LUCKY_ELEMENTS[yearAnimal];

  // รวมสิ่งมงคลทั้งหมด โดยเลือกอย่างละ 1-2 อย่าง
  const selected: LuckyElement[] = [];

  // เลือกจากวันเกิด (2 อย่าง)
  selected.push(dayElements[0], dayElements[1]);

  // เลือกจากราศี (1 อย่าง)
  const zodiacPick = zodiacElements[Math.floor(Math.random() * zodiacElements.length)];
  if (zodiacPick && !selected.some(e => e.id === zodiacPick.id)) {
    selected.push(zodiacPick);
  }

  // เลือกจากนักษัตร (1 อย่าง)
  const animalPick = animalElements[Math.floor(Math.random() * animalElements.length)];
  if (animalPick && !selected.some(e => e.id === animalPick.id)) {
    selected.push(animalPick);
  }

  // ถ้ามีน้อยกว่า 3 อย่าง ให้เติมจากวันเกิดเพิ่ม
  if (selected.length < 3 && dayElements.length > 2) {
    for (let i = 2; i < dayElements.length && selected.length < 4; i++) {
      if (!selected.some(e => e.id === dayElements[i].id)) {
        selected.push(dayElements[i]);
      }
    }
  }

  return {
    elements: selected.slice(0, 4), // สูงสุด 4 อย่าง
    birthDate,
    thaiDay,
    zodiac,
    yearAnimal,
  };
}
