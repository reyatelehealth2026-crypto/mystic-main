// Lucky Numbers Engine — ผู้ใช้หยิบไพ่เอง 2 หรือ 4 ใบ
// ไม่ใช้ DOB/topic แล้ว → analyse digits ที่ user หยิบโดยตรง

export type LuckyDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type LuckyDigitCount = 2 | 4;

export interface LuckyDigitMeaning {
  digit: LuckyDigit;
  keywordTh: string;
  reasonTh: string;
}

const DIGIT_MEANINGS: Record<LuckyDigit, Omit<LuckyDigitMeaning, "digit">> = {
  1: { keywordTh: "ผู้นำ / เริ่มต้น", reasonTh: "พลังของการลงมือทำ ความกล้าและการเป็นผู้ริเริ่ม" },
  2: { keywordTh: "สมดุล / คู่ใจ", reasonTh: "พลังความสัมพันธ์ ความนุ่มนวล การประสานคน" },
  3: { keywordTh: "สร้างสรรค์ / สื่อสาร", reasonTh: "พลังการแสดงออก ความสนุกสนาน เสน่ห์" },
  4: { keywordTh: "มั่นคง / รากฐาน", reasonTh: "พลังความขยัน วินัย และความเป็นระบบ" },
  5: { keywordTh: "เปลี่ยนแปลง / เคลื่อนไหว", reasonTh: "พลังโอกาสใหม่ การผจญภัย และอิสระ" },
  6: { keywordTh: "ดูแล / ครอบครัว", reasonTh: "พลังความรักความอบอุ่น ความรับผิดชอบ" },
  7: { keywordTh: "ปัญญา / สมาธิ", reasonTh: "พลังการพินิจ ความลึกซึ้ง และจิตวิญญาณ" },
  8: { keywordTh: "ความมั่งคั่ง / สำเร็จ", reasonTh: "พลังการเงินไหลเวียน การได้รับการยอมรับ" },
  9: { keywordTh: "ปิดวงจร / ยิ่งใหญ่", reasonTh: "พลังของการเปลี่ยนผ่าน ความสมบูรณ์ เลขมหามงคล" },
};

export function digitMeaning(digit: LuckyDigit): LuckyDigitMeaning {
  return { digit, ...DIGIT_MEANINGS[digit] };
}

function sumDigits(value: string): number {
  return value
    .split("")
    .map((d) => Number(d))
    .filter((n) => !Number.isNaN(n))
    .reduce((acc, n) => acc + n, 0);
}

function reduceToRoot(total: number): number {
  let current = Math.abs(total);
  while (current > 9) {
    current = sumDigits(String(current));
  }
  return current;
}

export interface LuckyDigitAnalysis {
  digits: LuckyDigit[];
  count: LuckyDigitCount;
  combined: string;
  sum: number;
  root: number;
  meanings: LuckyDigitMeaning[];
  reading: string;
}

export function analyseLuckyDigits(digits: LuckyDigit[]): LuckyDigitAnalysis | null {
  if (digits.length !== 2 && digits.length !== 4) return null;
  if (!digits.every((d) => Number.isInteger(d) && d >= 1 && d <= 9)) return null;

  const sum = digits.reduce((acc, n) => acc + n, 0);
  const root = reduceToRoot(sum);
  const meanings = digits.map((d) => digitMeaning(d));
  const combined = digits.join("");

  const lines: string[] = [];
  meanings.forEach((m, i) => {
    lines.push(`ไพ่ใบที่ ${i + 1}: เลข ${m.digit} (${m.keywordTh}) — ${m.reasonTh}`);
  });
  lines.push("");
  lines.push(`ผลรวม ${sum} • เลขราก ${root} — ${digitMeaning(root as LuckyDigit).reasonTh}`);

  return {
    digits,
    count: digits.length as LuckyDigitCount,
    combined,
    sum,
    root,
    meanings,
    reading: lines.join("\n"),
  };
}

export function shuffleDigits(): LuckyDigit[] {
  const arr: LuckyDigit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
