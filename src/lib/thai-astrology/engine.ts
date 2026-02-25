// Thai Astrology (โหราศาสตร์ไทย) Engine
// สำหรับคำนวณดวงความรักแบบไทย

import {
  ThaiDay,
  ThaiYearAnimal,
  ThaiElement,
  ThaiCompatibilityInput,
  ThaiCompatibilityReading,
  THAI_DAY_MEANINGS,
  THAI_YEAR_ANIMAL_MEANINGS,
} from './types';

// แปลงวันจาก JavaScript Date เป็นวันไทย
export function getThaiDay(date: Date): ThaiDay {
  const dayOfWeek = date.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ...
  const dayMap: ThaiDay[] = [
    ThaiDay.ARWAN,  // 0 = อาทิตย์
    ThaiDay.JAN,    // 1 = จันทร์
    ThaiDay.ANGKAN, // 2 = อังคาร
    ThaiDay.PHUT,   // 3 = พุธ
    ThaiDay.PHAHAT, // 4 = พฤหัสบดี
    ThaiDay.SUK,    // 5 = ศุกร์
    ThaiDay.SAO,    // 6 = เสาร์
  ];
  return dayMap[dayOfWeek];
}

// คำนวณนักษัตรปีเกิด
export function getThaiYearAnimal(date: Date): ThaiYearAnimal {
  const year = date.getFullYear();
  // นักษัตรเริ่มที่ชวด (หนู) = 2020, 2008, 1996, ...
  // ชวด = ปีที่ mod 12 เท่ากับ 4 (เนื่องจาก 2020 % 12 = 4)
  const animalMap: ThaiYearAnimal[] = [
    ThaiYearAnimal.MARONG, // 0 = มะโรง (2012, 2024)
    ThaiYearAnimal.MASENG, // 1 = มะเส็ง (2013, 2025)
    ThaiYearAnimal.MAMIA,  // 2 = มะเมีย (2014, 2026)
    ThaiYearAnimal.MAMAENG,// 3 = มะแม (2015, 2027)
    ThaiYearAnimal.CHUAT,  // 4 = ชวด (2016, 2028)
    ThaiYearAnimal.CHAL,   // 5 = ฉลู (2017, 2029)
    ThaiYearAnimal.KHAN,   // 6 = ขาล (2018, 2030)
    ThaiYearAnimal.THO,    // 7 = เถาะ (2019, 2031)
    ThaiYearAnimal.MARONG, // 8 = มะโรง (2020)
    ThaiYearAnimal.MASENG, // 9 = มะเส็ง (2021)
    ThaiYearAnimal.MAMIA,  // 10 = มะเมีย (2022)
    ThaiYearAnimal.MAMAENG,// 11 = มะแม (2023)
  ];
  
  // แก้ไข: คำนวณตามปีจริง
  // 2020 = ชวด (หนู), 2021 = ฉลู (วัว), 2022 = ขาล (เสือ), ...
  const baseYear = 2020; // ปีชวด
  const diff = year - baseYear;
  const index = ((diff % 12) + 12) % 12; // ทำให้เป็นบวกเสมอ
  
  const correctedMap: ThaiYearAnimal[] = [
    ThaiYearAnimal.CHUAT,  // 0 = ชวด (2020)
    ThaiYearAnimal.CHAL,   // 1 = ฉลู (2021)
    ThaiYearAnimal.KHAN,   // 2 = ขาล (2022)
    ThaiYearAnimal.THO,    // 3 = เถาะ (2023)
    ThaiYearAnimal.MARONG, // 4 = มะโรง (2024)
    ThaiYearAnimal.MASENG, // 5 = มะเส็ง (2025)
    ThaiYearAnimal.MAMIA,  // 6 = มะเมีย (2026)
    ThaiYearAnimal.MAMAENG,// 7 = มะแม (2027)
    ThaiYearAnimal.WOK,    // 8 = วอก (2028)
    ThaiYearAnimal.RAKA,   // 9 = ระกา (2029)
    ThaiYearAnimal.CHO,    // 10 = จอ (2030)
    ThaiYearAnimal.KUNN,   // 11 = กุน (2031)
  ];
  
  return correctedMap[index];
}

// คำนวณธาตุจากนักษัตร
export function getElementFromAnimal(animal: ThaiYearAnimal): ThaiElement {
  return THAI_YEAR_ANIMAL_MEANINGS[animal].element;
}

// ตารางเข้ากันของวัน
const DAY_COMPATIBILITY: Record<ThaiDay, Record<ThaiDay, number>> = {
  [ThaiDay.ARWAN]: {
    [ThaiDay.ARWAN]: 70, [ThaiDay.JAN]: 60, [ThaiDay.ANGKAN]: 40, 
    [ThaiDay.PHUT]: 80, [ThaiDay.PHAHAT]: 90, [ThaiDay.SUK]: 85, [ThaiDay.SAO]: 50,
  },
  [ThaiDay.JAN]: {
    [ThaiDay.ARWAN]: 60, [ThaiDay.JAN]: 75, [ThaiDay.ANGKAN]: 85,
    [ThaiDay.PHUT]: 70, [ThaiDay.PHAHAT]: 65, [ThaiDay.SUK]: 80, [ThaiDay.SAO]: 90,
  },
  [ThaiDay.ANGKAN]: {
    [ThaiDay.ARWAN]: 40, [ThaiDay.JAN]: 85, [ThaiDay.ANGKAN]: 65,
    [ThaiDay.PHUT]: 60, [ThaiDay.PHAHAT]: 50, [ThaiDay.SUK]: 70, [ThaiDay.SAO]: 80,
  },
  [ThaiDay.PHUT]: {
    [ThaiDay.ARWAN]: 80, [ThaiDay.JAN]: 70, [ThaiDay.ANGKAN]: 60,
    [ThaiDay.PHUT]: 75, [ThaiDay.PHAHAT]: 85, [ThaiDay.SUK]: 65, [ThaiDay.SAO]: 55,
  },
  [ThaiDay.PHAHAT]: {
    [ThaiDay.ARWAN]: 90, [ThaiDay.JAN]: 65, [ThaiDay.ANGKAN]: 50,
    [ThaiDay.PHUT]: 85, [ThaiDay.PHAHAT]: 80, [ThaiDay.SUK]: 75, [ThaiDay.SAO]: 60,
  },
  [ThaiDay.SUK]: {
    [ThaiDay.ARWAN]: 85, [ThaiDay.JAN]: 80, [ThaiDay.ANGKAN]: 70,
    [ThaiDay.PHUT]: 65, [ThaiDay.PHAHAT]: 75, [ThaiDay.SUK]: 85, [ThaiDay.SAO]: 70,
  },
  [ThaiDay.SAO]: {
    [ThaiDay.ARWAN]: 50, [ThaiDay.JAN]: 90, [ThaiDay.ANGKAN]: 80,
    [ThaiDay.PHUT]: 55, [ThaiDay.PHAHAT]: 60, [ThaiDay.SUK]: 70, [ThaiDay.SAO]: 75,
  },
};

// ตารางเข้ากันของนักษัตร
const ANIMAL_COMPATIBILITY: Record<ThaiYearAnimal, Record<ThaiYearAnimal, number>> = {
  [ThaiYearAnimal.CHUAT]: { // ชวด - หนู
    [ThaiYearAnimal.CHUAT]: 70, [ThaiYearAnimal.CHAL]: 80, [ThaiYearAnimal.KHAN]: 60,
    [ThaiYearAnimal.THO]: 85, [ThaiYearAnimal.MARONG]: 75, [ThaiYearAnimal.MASENG]: 65,
    [ThaiYearAnimal.MAMIA]: 70, [ThaiYearAnimal.MAMAENG]: 80, [ThaiYearAnimal.WOK]: 90,
    [ThaiYearAnimal.RAKA]: 60, [ThaiYearAnimal.CHO]: 85, [ThaiYearAnimal.KUNN]: 75,
  },
  [ThaiYearAnimal.CHAL]: { // ฉลู - วัว
    [ThaiYearAnimal.CHUAT]: 80, [ThaiYearAnimal.CHAL]: 75, [ThaiYearAnimal.KHAN]: 85,
    [ThaiYearAnimal.THO]: 70, [ThaiYearAnimal.MARONG]: 80, [ThaiYearAnimal.MASENG]: 75,
    [ThaiYearAnimal.MAMIA]: 85, [ThaiYearAnimal.MAMAENG]: 70, [ThaiYearAnimal.WOK]: 65,
    [ThaiYearAnimal.RAKA]: 90, [ThaiYearAnimal.CHO]: 80, [ThaiYearAnimal.KUNN]: 85,
  },
  // ... (เพิ่มเติมทุกนักษัตร)
  [ThaiYearAnimal.KHAN]: { [ThaiYearAnimal.CHUAT]: 60, [ThaiYearAnimal.CHAL]: 85, [ThaiYearAnimal.KHAN]: 70, [ThaiYearAnimal.THO]: 75, [ThaiYearAnimal.MARONG]: 85, [ThaiYearAnimal.MASENG]: 80, [ThaiYearAnimal.MAMIA]: 75, [ThaiYearAnimal.MAMAENG]: 85, [ThaiYearAnimal.WOK]: 70, [ThaiYearAnimal.RAKA]: 65, [ThaiYearAnimal.CHO]: 75, [ThaiYearAnimal.KUNN]: 80 },
  [ThaiYearAnimal.THO]: { [ThaiYearAnimal.CHUAT]: 85, [ThaiYearAnimal.CHAL]: 70, [ThaiYearAnimal.KHAN]: 75, [ThaiYearAnimal.THO]: 75, [ThaiYearAnimal.MARONG]: 80, [ThaiYearAnimal.MASENG]: 70, [ThaiYearAnimal.MAMIA]: 75, [ThaiYearAnimal.MAMAENG]: 85, [ThaiYearAnimal.WOK]: 80, [ThaiYearAnimal.RAKA]: 75, [ThaiYearAnimal.CHO]: 70, [ThaiYearAnimal.KUNN]: 85 },
  [ThaiYearAnimal.MARONG]: { [ThaiYearAnimal.CHUAT]: 75, [ThaiYearAnimal.CHAL]: 80, [ThaiYearAnimal.KHAN]: 85, [ThaiYearAnimal.THO]: 80, [ThaiYearAnimal.MARONG]: 80, [ThaiYearAnimal.MASENG]: 85, [ThaiYearAnimal.MAMIA]: 80, [ThaiYearAnimal.MAMAENG]: 75, [ThaiYearAnimal.WOK]: 70, [ThaiYearAnimal.RAKA]: 80, [ThaiYearAnimal.CHO]: 75, [ThaiYearAnimal.KUNN]: 70 },
  [ThaiYearAnimal.MASENG]: { [ThaiYearAnimal.CHUAT]: 65, [ThaiYearAnimal.CHAL]: 75, [ThaiYearAnimal.KHAN]: 80, [ThaiYearAnimal.THO]: 70, [ThaiYearAnimal.MARONG]: 85, [ThaiYearAnimal.MASENG]: 70, [ThaiYearAnimal.MAMIA]: 75, [ThaiYearAnimal.MAMAENG]: 70, [ThaiYearAnimal.WOK]: 85, [ThaiYearAnimal.RAKA]: 75, [ThaiYearAnimal.CHO]: 80, [ThaiYearAnimal.KUNN]: 75 },
  [ThaiYearAnimal.MAMIA]: { [ThaiYearAnimal.CHUAT]: 70, [ThaiYearAnimal.CHAL]: 85, [ThaiYearAnimal.KHAN]: 75, [ThaiYearAnimal.THO]: 75, [ThaiYearAnimal.MARONG]: 80, [ThaiYearAnimal.MASENG]: 75, [ThaiYearAnimal.MAMIA]: 75, [ThaiYearAnimal.MAMAENG]: 80, [ThaiYearAnimal.WOK]: 75, [ThaiYearAnimal.RAKA]: 85, [ThaiYearAnimal.CHO]: 70, [ThaiYearAnimal.KUNN]: 80 },
  [ThaiYearAnimal.MAMAENG]: { [ThaiYearAnimal.CHUAT]: 80, [ThaiYearAnimal.CHAL]: 70, [ThaiYearAnimal.KHAN]: 85, [ThaiYearAnimal.THO]: 85, [ThaiYearAnimal.MARONG]: 75, [ThaiYearAnimal.MASENG]: 70, [ThaiYearAnimal.MAMIA]: 80, [ThaiYearAnimal.MAMAENG]: 75, [ThaiYearAnimal.WOK]: 80, [ThaiYearAnimal.RAKA]: 70, [ThaiYearAnimal.CHO]: 85, [ThaiYearAnimal.KUNN]: 75 },
  [ThaiYearAnimal.WOK]: { [ThaiYearAnimal.CHUAT]: 90, [ThaiYearAnimal.CHAL]: 65, [ThaiYearAnimal.KHAN]: 70, [ThaiYearAnimal.THO]: 80, [ThaiYearAnimal.MARONG]: 70, [ThaiYearAnimal.MASENG]: 85, [ThaiYearAnimal.MAMIA]: 75, [ThaiYearAnimal.MAMAENG]: 80, [ThaiYearAnimal.WOK]: 75, [ThaiYearAnimal.RAKA]: 80, [ThaiYearAnimal.CHO]: 75, [ThaiYearAnimal.KUNN]: 85 },
  [ThaiYearAnimal.RAKA]: { [ThaiYearAnimal.CHUAT]: 60, [ThaiYearAnimal.CHAL]: 90, [ThaiYearAnimal.KHAN]: 65, [ThaiYearAnimal.THO]: 75, [ThaiYearAnimal.MARONG]: 80, [ThaiYearAnimal.MASENG]: 75, [ThaiYearAnimal.MAMIA]: 85, [ThaiYearAnimal.MAMAENG]: 70, [ThaiYearAnimal.WOK]: 80, [ThaiYearAnimal.RAKA]: 75, [ThaiYearAnimal.CHO]: 85, [ThaiYearAnimal.KUNN]: 70 },
  [ThaiYearAnimal.CHO]: { [ThaiYearAnimal.CHUAT]: 85, [ThaiYearAnimal.CHAL]: 80, [ThaiYearAnimal.KHAN]: 75, [ThaiYearAnimal.THO]: 70, [ThaiYearAnimal.MARONG]: 75, [ThaiYearAnimal.MASENG]: 80, [ThaiYearAnimal.MAMIA]: 70, [ThaiYearAnimal.MAMAENG]: 85, [ThaiYearAnimal.WOK]: 75, [ThaiYearAnimal.RAKA]: 85, [ThaiYearAnimal.CHO]: 80, [ThaiYearAnimal.KUNN]: 90 },
  [ThaiYearAnimal.KUNN]: { [ThaiYearAnimal.CHUAT]: 75, [ThaiYearAnimal.CHAL]: 85, [ThaiYearAnimal.KHAN]: 80, [ThaiYearAnimal.THO]: 85, [ThaiYearAnimal.MARONG]: 70, [ThaiYearAnimal.MASENG]: 75, [ThaiYearAnimal.MAMIA]: 80, [ThaiYearAnimal.MAMAENG]: 75, [ThaiYearAnimal.WOK]: 85, [ThaiYearAnimal.RAKA]: 70, [ThaiYearAnimal.CHO]: 90, [ThaiYearAnimal.KUNN]: 80 },
};

// ตารางเข้ากันของธาตุ
const ELEMENT_COMPATIBILITY: Record<ThaiElement, Record<ThaiElement, number>> = {
  [ThaiElement.WOOD]: {
    [ThaiElement.WOOD]: 80, [ThaiElement.FIRE]: 90, [ThaiElement.EARTH]: 70,
    [ThaiElement.METAL]: 50, [ThaiElement.WATER]: 85,
  },
  [ThaiElement.FIRE]: {
    [ThaiElement.WOOD]: 85, [ThaiElement.FIRE]: 75, [ThaiElement.EARTH]: 90,
    [ThaiElement.METAL]: 70, [ThaiElement.WATER]: 40,
  },
  [ThaiElement.EARTH]: {
    [ThaiElement.WOOD]: 60, [ThaiElement.FIRE]: 85, [ThaiElement.EARTH]: 80,
    [ThaiElement.METAL]: 90, [ThaiElement.WATER]: 75,
  },
  [ThaiElement.METAL]: {
    [ThaiElement.WOOD]: 70, [ThaiElement.FIRE]: 50, [ThaiElement.EARTH]: 85,
    [ThaiElement.METAL]: 75, [ThaiElement.WATER]: 90,
  },
  [ThaiElement.WATER]: {
    [ThaiElement.WOOD]: 90, [ThaiElement.FIRE]: 60, [ThaiElement.EARTH]: 70,
    [ThaiElement.METAL]: 85, [ThaiElement.WATER]: 80,
  },
};

// สร้างคำทำนาย
function generateInterpretation(
  day1: ThaiDay,
  day2: ThaiDay,
  animal1: ThaiYearAnimal,
  animal2: ThaiYearAnimal,
  element1: ThaiElement,
  element2: ThaiElement,
  overallScore: number,
  scores: ThaiCompatibilityReading['scores']
): ThaiCompatibilityReading['interpretation'] {
  const dayName1 = THAI_DAY_MEANINGS[day1].name;
  const dayName2 = THAI_DAY_MEANINGS[day2].name;
  const animalName1 = THAI_YEAR_ANIMAL_MEANINGS[animal1].name;
  const animalName2 = THAI_YEAR_ANIMAL_MEANINGS[animal2].name;
  
  // สรุปภาพรวม
  let summary = '';
  if (overallScore >= 80) {
    summary = `${dayName1} กับ ${dayName2} ถือว่าเข้ากันได้ดีมาก นักษัตร ${animalName1} และ ${animalName2} มีธาตุที่ส่งเสริมกัน ความรักนี้มีแนวโน้มที่ดี`;
  } else if (overallScore >= 60) {
    summary = `${dayName1} กับ ${dayName2} เข้ากันได้ในระดับที่ดี แม้จะมีความต่างบ้างแต่ก็สามารถปรับตัวเข้าหากันได้`;
  } else {
    summary = `${dayName1} กับ ${dayName2} มีความท้าทายในการเข้ากัน ต้องใช้ความเข้าใจและอดทนมากเป็นพิเศษ`;
  }
  
  // จุดแข็ง
  const strengths: string[] = [];
  if (scores.dayCompatibility >= 70) {
    strengths.push('วันเกิดของทั้งคู่ส่งเสริมกัน ทำให้เข้าใจกันง่าย');
  }
  if (scores.animalCompatibility >= 70) {
    strengths.push('นักษัตรเข้ากันได้ดี มีพื้นฐานความเข้ากันในตัว');
  }
  if (scores.elementCompatibility >= 70) {
    strengths.push('ธาตุส่งเสริมกัน ช่วยเสริมพลังให้กันและกัน');
  }
  if (strengths.length === 0) {
    strengths.push('ความแตกต่างทำให้เกิดการเรียนรู้ซึ่งกันและกัน');
  }
  
  // ความท้าทาย
  const challenges: string[] = [];
  if (scores.dayCompatibility < 60) {
    challenges.push('วันเกิดไม่ค่อยส่งเสริมกัน อาจต้องปรับตัวมากหน่อย');
  }
  if (scores.elementCompatibility < 60) {
    challenges.push('ธาตุไม่เข้ากัน ต้องหาจุดกลางที่เหมาะสม');
  }
  if (challenges.length === 0) {
    challenges.push('อย่าประมาทความสัมพันธ์ ต้องดูแลกันเสมอ');
  }
  
  // คำแนะนำ
  let advice = '';
  if (overallScore >= 80) {
    advice = 'ความสัมพันธ์นี้มีพื้นฐานที่ดี ควรรักษาความเข้าใจกันไว้ อย่าให้เรื่องเล็กน้อยมาทำลายความรัก';
  } else if (overallScore >= 60) {
    advice = 'ต้องใช้เวลาในการปรับตัวเข้าหากัน ความอดทนและความเข้าใจคือกุญแจสำคัญ';
  } else {
    advice = 'ต้องใช้ความพยายามอย่างมากจากทั้งสองฝ่าย แต่ถ้าผ่านไปได้จะแข็งแกร่งมาก';
  }
  
  // เคล็ดลับเสริมดวง
  const auspicious = [
    `สีมงคลสำหรับ ${dayName1}: ${THAI_DAY_MEANINGS[day1].color}`,
    `สีมงคลสำหรับ ${dayName2}: ${THAI_DAY_MEANINGS[day2].color}`,
    'ทำบุญตักบาตรวันเกิดของกันและกัน',
    'หมั่นสวดมนต์ภาวนาร่วมกัน',
  ];
  
  return {
    summary,
    strengths,
    challenges,
    advice,
    auspicious,
  };
}

// คำนวณความเข้ากันแบบโหราศาสตร์ไทย
export function calculateThaiCompatibility(
  input: ThaiCompatibilityInput
): ThaiCompatibilityReading {
  const { person1, person2 } = input;
  
  // คำนวณวันเกิด
  const day1 = getThaiDay(person1.birthDate);
  const day2 = getThaiDay(person2.birthDate);
  
  // คำนวณนักษัตร
  const animal1 = getThaiYearAnimal(person1.birthDate);
  const animal2 = getThaiYearAnimal(person2.birthDate);
  
  // คำนวณธาตุ
  const element1 = getElementFromAnimal(animal1);
  const element2 = getElementFromAnimal(animal2);
  
  // คำนวณคะแนน
  const dayScore = DAY_COMPATIBILITY[day1][day2];
  const animalScore = ANIMAL_COMPATIBILITY[animal1][animal2];
  const elementScore = ELEMENT_COMPATIBILITY[element1][element2];
  
  // คะแนนรวม (ถ่วงน้ำหนัก)
  const overallScore = Math.round(
    (dayScore * 0.3) + (animalScore * 0.4) + (elementScore * 0.3)
  );
  
  // สร้างคำทำนาย
  const interpretation = generateInterpretation(
    day1, day2, animal1, animal2, element1, element2, overallScore,
    {
      dayCompatibility: dayScore,
      animalCompatibility: animalScore,
      elementCompatibility: elementScore,
    }
  );
  
  return {
    person1: {
      birthDate: person1.birthDate,
      day: day1,
      yearAnimal: animal1,
      element: element1,
    },
    person2: {
      birthDate: person2.birthDate,
      day: day2,
      yearAnimal: animal2,
      element: element2,
    },
    overallScore,
    scores: {
      dayCompatibility: dayScore,
      animalCompatibility: animalScore,
      elementCompatibility: elementScore,
    },
    interpretation,
  };
}
