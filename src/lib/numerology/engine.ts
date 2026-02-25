export interface NumerologyResult {
  normalizedPhone: string;
  total: number;
  root: number;
  score: number;
  tier: "ดีมาก" | "สมดุล" | "ต้องปรับ";
  themes: {
    work: string;
    money: string;
    relationship: string;
    caution: string;
  };
}

const rootMeaning: Record<number, { work: string; money: string; relationship: string }> = {
  1: {
    work: "เด่นเรื่องภาวะผู้นำ เหมาะเริ่มสิ่งใหม่",
    money: "รายรับขึ้นจากความกล้าตัดสินใจ",
    relationship: "ต้องบาลานซ์ความมั่นใจกับการรับฟัง",
  },
  2: {
    work: "เก่งงานประสานและงานทีม",
    money: "รายได้ค่อยเป็นค่อยไปจากความร่วมมือ",
    relationship: "เสน่ห์จากความอ่อนโยนและเอาใจใส่",
  },
  3: {
    work: "สื่อสารดี เหมาะงานคอนเทนต์/ขาย",
    money: "เงินมาจากความคิดสร้างสรรค์",
    relationship: "คุยเก่ง ทำให้ความสัมพันธ์สดใส",
  },
  4: {
    work: "เด่นเรื่องระบบและความสม่ำเสมอ",
    money: "มั่นคงจากวินัยการเงิน",
    relationship: "จริงจังและให้ความมั่นคงกับคู่",
  },
  5: {
    work: "เหมาะงานที่ต้องแก้ปัญหาไว",
    money: "โอกาสรายได้หลายทาง แต่ควบคุมรายจ่ายด้วย",
    relationship: "รักอิสระ ต้องสื่อสารขอบเขตให้ชัด",
  },
  6: {
    work: "เด่นงานดูแลลูกค้า/บริการ",
    money: "เงินดีเมื่อสร้างคุณค่าระยะยาว",
    relationship: "อบอุ่น รับผิดชอบ และจริงใจ",
  },
  7: {
    work: "เหมาะงานวิเคราะห์ วางกลยุทธ์",
    money: "ดีเมื่อวางแผนรอบคอบก่อนลงทุน",
    relationship: "ต้องการพื้นที่ส่วนตัวแต่ลึกซึ้ง",
  },
  8: {
    work: "เด่นด้านบริหารและเป้าหมายใหญ่",
    money: "ศักยภาพการเงินสูง หากคุมความเสี่ยงดี",
    relationship: "จริงจังกับอนาคตและความมั่นคง",
  },
  9: {
    work: "เหมาะงานที่มีผลต่อผู้คนวงกว้าง",
    money: "เงินไหลดีเมื่อทำสิ่งที่มีคุณค่าต่อสังคม",
    relationship: "ใจดี เห็นอกเห็นใจ แต่ต้องไม่แบกรับเกินไป",
  },
};

function sumDigits(text: string): number {
  return text
    .split("")
    .map((digit) => Number(digit))
    .reduce((sum, value) => sum + value, 0);
}

function reduceToRoot(total: number): number {
  let current = total;
  while (current > 9) {
    current = sumDigits(String(current));
  }
  return current;
}

export function normalizeThaiPhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("66") && digits.length === 11) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

export function analyzeThaiPhone(input: string): NumerologyResult | null {
  const normalizedPhone = normalizeThaiPhone(input);

  if (!/^0\d{9}$/.test(normalizedPhone)) {
    return null;
  }

  const digitsOnly = normalizedPhone.slice(1);
  const total = sumDigits(digitsOnly);
  const root = reduceToRoot(total);

  const repeatedBonus = (digitsOnly.match(/(\d)\1/g) ?? []).length * 3;
  const eightBonus = (digitsOnly.match(/8/g) ?? []).length * 2;
  const fourBonus = (digitsOnly.match(/4/g) ?? []).length;
  const zeroPenalty = (digitsOnly.match(/0/g) ?? []).length * 2;

  const rawScore = 55 + root * 3 + repeatedBonus + eightBonus + fourBonus - zeroPenalty;
  const score = Math.max(35, Math.min(99, rawScore));

  const tier: NumerologyResult["tier"] =
    score >= 80 ? "ดีมาก" : score >= 65 ? "สมดุล" : "ต้องปรับ";

  const base = rootMeaning[root] ?? rootMeaning[5];

  return {
    normalizedPhone,
    total,
    root,
    score,
    tier,
    themes: {
      ...base,
      caution:
        tier === "ดีมาก"
          ? "รักษาวินัยเดิมและอย่าประมาทเรื่องสัญญา/เอกสาร"
          : tier === "สมดุล"
            ? "เพิ่มความชัดเจนเรื่องเป้าหมายการเงินและเวลา"
            : "ควรเสริมวินัยการเงินและเลือกใช้คำพูดอย่างนุ่มนวล",
    },
  };
}
