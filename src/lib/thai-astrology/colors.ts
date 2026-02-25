// Thai Astrology Auspicious Colors (สีมงคลโหราศาสตร์ไทย)
// 3 ระดับ: วันเกิด (ทักษา), เดือนเกิด (ราศี), เวลาเกิด (ลัคนา)

import { ThaiDay, ThaiZodiacSign, THAI_DAY_MEANINGS } from "./types";
import { getThaiDay } from "./engine";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface AuspiciousColor {
  nameTh: string;
  nameEn: string;
  hex: string;
  tailwind: string; // for gradient class
}

export interface AuspiciousColorSet {
  primary: AuspiciousColor;
  secondary?: AuspiciousColor;
  source: "day" | "zodiac" | "ascendant";
  label: string; // e.g. "สีมงคลวันจันทร์"
}

export interface BirthColorResult {
  dayColors: AuspiciousColorSet;
  zodiacColors: AuspiciousColorSet;
  ascendantColors?: AuspiciousColorSet;
  allColors: AuspiciousColor[];
}

// ──────────────────────────────────────────────
// ระดับ 1: สีมงคลจากวันเกิด (ทักษา)
// ──────────────────────────────────────────────

export const DAY_AUSPICIOUS_COLORS: Record<ThaiDay, { primary: AuspiciousColor; secondary: AuspiciousColor }> = {
  [ThaiDay.ARWAN]: {
    primary: { nameTh: "แดง", nameEn: "red", hex: "#DC2626", tailwind: "from-red-500 to-red-700" },
    secondary: { nameTh: "ส้มทอง", nameEn: "orange-gold", hex: "#EA580C", tailwind: "from-orange-500 to-amber-600" },
  },
  [ThaiDay.JAN]: {
    primary: { nameTh: "เหลือง", nameEn: "yellow", hex: "#EAB308", tailwind: "from-yellow-400 to-yellow-600" },
    secondary: { nameTh: "ครีม", nameEn: "cream", hex: "#FDE68A", tailwind: "from-yellow-200 to-yellow-400" },
  },
  [ThaiDay.ANGKAN]: {
    primary: { nameTh: "ชมพู", nameEn: "pink", hex: "#EC4899", tailwind: "from-pink-400 to-pink-600" },
    secondary: { nameTh: "แดงอ่อน", nameEn: "light-red", hex: "#F87171", tailwind: "from-red-300 to-red-500" },
  },
  [ThaiDay.PHUT]: {
    primary: { nameTh: "เขียว", nameEn: "green", hex: "#22C55E", tailwind: "from-green-400 to-green-600" },
    secondary: { nameTh: "เขียวมรกต", nameEn: "emerald", hex: "#059669", tailwind: "from-emerald-400 to-emerald-700" },
  },
  [ThaiDay.PHAHAT]: {
    primary: { nameTh: "ส้ม", nameEn: "orange", hex: "#F97316", tailwind: "from-orange-400 to-orange-600" },
    secondary: { nameTh: "เหลืองทอง", nameEn: "golden", hex: "#D97706", tailwind: "from-amber-400 to-amber-600" },
  },
  [ThaiDay.SUK]: {
    primary: { nameTh: "ฟ้า", nameEn: "blue", hex: "#3B82F6", tailwind: "from-blue-400 to-blue-600" },
    secondary: { nameTh: "ฟ้าอ่อน", nameEn: "light-blue", hex: "#60A5FA", tailwind: "from-sky-300 to-sky-500" },
  },
  [ThaiDay.SAO]: {
    primary: { nameTh: "ม่วง", nameEn: "purple", hex: "#7C3AED", tailwind: "from-violet-500 to-violet-700" },
    secondary: { nameTh: "ดำ", nameEn: "black", hex: "#1F2937", tailwind: "from-gray-800 to-gray-900" },
  },
};

// ──────────────────────────────────────────────
// ระดับ 2: สีมงคลจากราศี (เดือนเกิด)
// ──────────────────────────────────────────────

export interface ZodiacColorInfo {
  nameTh: string;
  rulingPlanetTh: string;
  primary: AuspiciousColor;
  secondary: AuspiciousColor;
  weaknessPlanetTh: string;
  weaknessColor: AuspiciousColor;
}

export const ZODIAC_COLORS: Record<ThaiZodiacSign, ZodiacColorInfo> = {
  [ThaiZodiacSign.MES]: {
    nameTh: "เมษ",
    rulingPlanetTh: "ดาวอังคาร",
    primary: { nameTh: "แดง", nameEn: "red", hex: "#DC2626", tailwind: "from-red-500 to-red-700" },
    secondary: { nameTh: "ส้ม", nameEn: "orange", hex: "#EA580C", tailwind: "from-orange-500 to-orange-700" },
    weaknessPlanetTh: "ดาวศุกร์",
    weaknessColor: { nameTh: "ฟ้า", nameEn: "blue", hex: "#3B82F6", tailwind: "from-blue-400 to-blue-600" },
  },
  [ThaiZodiacSign.PHRUET]: {
    nameTh: "พฤษภ",
    rulingPlanetTh: "ดาวศุกร์",
    primary: { nameTh: "ชมพู", nameEn: "pink", hex: "#EC4899", tailwind: "from-pink-400 to-pink-600" },
    secondary: { nameTh: "ขาว", nameEn: "white", hex: "#F9FAFB", tailwind: "from-gray-50 to-gray-200" },
    weaknessPlanetTh: "ดาวอังคาร",
    weaknessColor: { nameTh: "แดง", nameEn: "red", hex: "#DC2626", tailwind: "from-red-500 to-red-700" },
  },
  [ThaiZodiacSign.MITHUN]: {
    nameTh: "มิถุน",
    rulingPlanetTh: "ดาวพุธ",
    primary: { nameTh: "เขียว", nameEn: "green", hex: "#22C55E", tailwind: "from-green-400 to-green-600" },
    secondary: { nameTh: "เหลือง", nameEn: "yellow", hex: "#EAB308", tailwind: "from-yellow-400 to-yellow-600" },
    weaknessPlanetTh: "ดาวพฤหัส",
    weaknessColor: { nameTh: "ส้ม", nameEn: "orange", hex: "#F97316", tailwind: "from-orange-400 to-orange-600" },
  },
  [ThaiZodiacSign.KRAKAT]: {
    nameTh: "กรกฎ",
    rulingPlanetTh: "ดาวจันทร์",
    primary: { nameTh: "เงิน", nameEn: "silver", hex: "#CBD5E1", tailwind: "from-slate-300 to-slate-400" },
    secondary: { nameTh: "ขาวนวล", nameEn: "cream-white", hex: "#F5F5F4", tailwind: "from-stone-100 to-stone-200" },
    weaknessPlanetTh: "ดาวเสาร์",
    weaknessColor: { nameTh: "ม่วง", nameEn: "purple", hex: "#7C3AED", tailwind: "from-violet-500 to-violet-700" },
  },
  [ThaiZodiacSign.SING]: {
    nameTh: "สิงห์",
    rulingPlanetTh: "ดาวอาทิตย์",
    primary: { nameTh: "ทอง", nameEn: "gold", hex: "#D97706", tailwind: "from-amber-400 to-amber-600" },
    secondary: { nameTh: "แดง", nameEn: "red", hex: "#DC2626", tailwind: "from-red-500 to-red-700" },
    weaknessPlanetTh: "ดาวเสาร์",
    weaknessColor: { nameTh: "ดำ", nameEn: "black", hex: "#1F2937", tailwind: "from-gray-800 to-gray-900" },
  },
  [ThaiZodiacSign.KUN]: {
    nameTh: "กันย์",
    rulingPlanetTh: "ดาวพุธ",
    primary: { nameTh: "เขียวอ่อน", nameEn: "light-green", hex: "#4ADE80", tailwind: "from-green-300 to-green-500" },
    secondary: { nameTh: "น้ำตาลอ่อน", nameEn: "light-brown", hex: "#A8A29E", tailwind: "from-stone-300 to-stone-500" },
    weaknessPlanetTh: "ดาวพฤหัส",
    weaknessColor: { nameTh: "ส้ม", nameEn: "orange", hex: "#F97316", tailwind: "from-orange-400 to-orange-600" },
  },
  [ThaiZodiacSign.TUN]: {
    nameTh: "ตุลย์",
    rulingPlanetTh: "ดาวศุกร์",
    primary: { nameTh: "ฟ้า", nameEn: "blue", hex: "#3B82F6", tailwind: "from-blue-400 to-blue-600" },
    secondary: { nameTh: "ชมพู", nameEn: "pink", hex: "#EC4899", tailwind: "from-pink-400 to-pink-600" },
    weaknessPlanetTh: "ดาวอังคาร",
    weaknessColor: { nameTh: "แดงเข้ม", nameEn: "dark-red", hex: "#991B1B", tailwind: "from-red-700 to-red-900" },
  },
  [ThaiZodiacSign.PHIK]: {
    nameTh: "พิจิก",
    rulingPlanetTh: "ดาวอังคาร",
    primary: { nameTh: "แดงเข้ม", nameEn: "dark-red", hex: "#991B1B", tailwind: "from-red-700 to-red-900" },
    secondary: { nameTh: "ดำ", nameEn: "black", hex: "#1F2937", tailwind: "from-gray-800 to-gray-900" },
    weaknessPlanetTh: "ดาวศุกร์",
    weaknessColor: { nameTh: "ชมพู", nameEn: "pink", hex: "#EC4899", tailwind: "from-pink-400 to-pink-600" },
  },
  [ThaiZodiacSign.THANU]: {
    nameTh: "ธนู",
    rulingPlanetTh: "ดาวพฤหัส",
    primary: { nameTh: "ส้ม", nameEn: "orange", hex: "#F97316", tailwind: "from-orange-400 to-orange-600" },
    secondary: { nameTh: "เหลือง", nameEn: "yellow", hex: "#EAB308", tailwind: "from-yellow-400 to-yellow-600" },
    weaknessPlanetTh: "ดาวพุธ",
    weaknessColor: { nameTh: "เขียว", nameEn: "green", hex: "#22C55E", tailwind: "from-green-400 to-green-600" },
  },
  [ThaiZodiacSign.MAKOK]: {
    nameTh: "มังกร",
    rulingPlanetTh: "ดาวเสาร์",
    primary: { nameTh: "น้ำตาล", nameEn: "brown", hex: "#78716C", tailwind: "from-stone-500 to-stone-700" },
    secondary: { nameTh: "ดำ", nameEn: "black", hex: "#1F2937", tailwind: "from-gray-800 to-gray-900" },
    weaknessPlanetTh: "ดาวจันทร์",
    weaknessColor: { nameTh: "เงิน", nameEn: "silver", hex: "#CBD5E1", tailwind: "from-slate-300 to-slate-400" },
  },
  [ThaiZodiacSign.KUM]: {
    nameTh: "กุมภ์",
    rulingPlanetTh: "ดาวเสาร์",
    primary: { nameTh: "น้ำเงินเข้ม", nameEn: "dark-blue", hex: "#1E3A8A", tailwind: "from-blue-700 to-blue-900" },
    secondary: { nameTh: "ม่วง", nameEn: "purple", hex: "#7C3AED", tailwind: "from-violet-500 to-violet-700" },
    weaknessPlanetTh: "ดาวอาทิตย์",
    weaknessColor: { nameTh: "ทอง", nameEn: "gold", hex: "#D97706", tailwind: "from-amber-400 to-amber-600" },
  },
  [ThaiZodiacSign.MIN]: {
    nameTh: "มีน",
    rulingPlanetTh: "ดาวพฤหัส",
    primary: { nameTh: "เขียวทะเล", nameEn: "teal", hex: "#14B8A6", tailwind: "from-teal-400 to-teal-600" },
    secondary: { nameTh: "ม่วงอ่อน", nameEn: "lavender", hex: "#A78BFA", tailwind: "from-violet-300 to-violet-500" },
    weaknessPlanetTh: "ดาวพุธ",
    weaknessColor: { nameTh: "เขียว", nameEn: "green", hex: "#22C55E", tailwind: "from-green-400 to-green-600" },
  },
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
      // ช่วงปกติ (เช่น เม.ย. – พ.ค.)
      if (
        (month === range.startMonth && day >= range.startDay) ||
        (month === range.endMonth && day <= range.endDay) ||
        (month > range.startMonth && month < range.endMonth)
      ) {
        return range.sign;
      }
    } else {
      // ข้ามปี (เช่น ธ.ค. – ม.ค.)
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
// ระดับ 3: คำนวณลัคนาแบบ simplified
// ──────────────────────────────────────────────
// ลัคนา = ราศีที่ขึ้นทางทิศตะวันออก ณ เวลาเกิด
// วิธีคำนวณแบบง่าย: ใช้เวลาเกิด (ชั่วโมง) + เดือนเกิด
// แต่ละช่วง 2 ชั่วโมง = 1 ราศี เลื่อน

const ZODIAC_ORDER: ThaiZodiacSign[] = [
  ThaiZodiacSign.MES,
  ThaiZodiacSign.PHRUET,
  ThaiZodiacSign.MITHUN,
  ThaiZodiacSign.KRAKAT,
  ThaiZodiacSign.SING,
  ThaiZodiacSign.KUN,
  ThaiZodiacSign.TUN,
  ThaiZodiacSign.PHIK,
  ThaiZodiacSign.THANU,
  ThaiZodiacSign.MAKOK,
  ThaiZodiacSign.KUM,
  ThaiZodiacSign.MIN,
];

export function getAscendant(birthDate: Date, birthTimeHour: number): ThaiZodiacSign {
  // ราศีดวงอาทิตย์ (จากวันเกิด) เป็นจุดเริ่มต้น
  const sunSign = getZodiacFromDate(birthDate);
  const sunIndex = ZODIAC_ORDER.indexOf(sunSign);

  // ช่วง 2 ชั่วโมง = 1 ราศี เลื่อน
  // 06:00 = ลัคนา ≈ ราศีดวงอาทิตย์ (ascending)
  // ทุก 2 ชั่วโมงหลัง 06:00 เลื่อนไป 1 ราศี
  const hoursFrom6 = ((birthTimeHour - 6) + 24) % 24;
  const signShift = Math.floor(hoursFrom6 / 2);

  const ascendantIndex = (sunIndex + signShift) % 12;
  return ZODIAC_ORDER[ascendantIndex];
}

// ──────────────────────────────────────────────
// Main: คำนวณสีมงคลทั้ง 3 ระดับ
// ──────────────────────────────────────────────

export function calculateBirthColors(
  birthDate: Date,
  birthTimeHour?: number, // 0-23, undefined = ไม่ทราบเวลาเกิด
): BirthColorResult {
  // ระดับ 1: วันเกิด
  const thaiDay = getThaiDay(birthDate);
  const dayMeaning = THAI_DAY_MEANINGS[thaiDay];
  const dayColorData = DAY_AUSPICIOUS_COLORS[thaiDay];

  const dayColors: AuspiciousColorSet = {
    primary: dayColorData.primary,
    secondary: dayColorData.secondary,
    source: "day",
    label: `สีมงคล${dayMeaning.name} (ทักษา)`,
  };

  // ระดับ 2: ราศี (เดือนเกิด)
  const zodiacSign = getZodiacFromDate(birthDate);
  const zodiacData = ZODIAC_COLORS[zodiacSign];

  const zodiacColors: AuspiciousColorSet = {
    primary: zodiacData.primary,
    secondary: zodiacData.secondary,
    source: "zodiac",
    label: `สีราศี${zodiacData.nameTh} (${zodiacData.rulingPlanetTh})`,
  };

  // ระดับ 3: ลัคนา (เวลาเกิด)
  let ascendantColors: AuspiciousColorSet | undefined;
  if (birthTimeHour !== undefined) {
    const ascendantSign = getAscendant(birthDate, birthTimeHour);
    const ascData = ZODIAC_COLORS[ascendantSign];

    ascendantColors = {
      primary: ascData.primary,
      secondary: ascData.secondary,
      source: "ascendant",
      label: `สีลัคนาราศี${ascData.nameTh}`,
    };
  }

  // รวมสีทั้งหมด (ไม่ซ้ำ)
  const colorMap = new Map<string, AuspiciousColor>();
  const addColor = (c: AuspiciousColor) => {
    if (!colorMap.has(c.hex)) colorMap.set(c.hex, c);
  };

  addColor(dayColorData.primary);
  addColor(dayColorData.secondary);
  addColor(zodiacData.primary);
  addColor(zodiacData.secondary);
  if (ascendantColors) {
    addColor(ascendantColors.primary);
    if (ascendantColors.secondary) addColor(ascendantColors.secondary);
  }

  return {
    dayColors,
    zodiacColors,
    ascendantColors,
    allColors: Array.from(colorMap.values()),
  };
}
