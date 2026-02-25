export const ReadingDomain = {
  FINANCE_CAREER: "finance_career",
  LOVE_RELATIONSHIPS: "love_relationships",
} as const;

export type ReadingDomain = (typeof ReadingDomain)[keyof typeof ReadingDomain];

export type SpecializedReadingInput = {
  zodiacSign: string;
  domain: ReadingDomain;
  period: "daily" | "weekly" | "monthly" | string;
  date: Date;
};

export type SpecializedReadingResult = {
  zodiacSign: string;
  domain: ReadingDomain;
  period: string;
  dateRange: { start: Date; end: Date };
  prediction: string;
  opportunities: string[];
  challenges: string[];
  actionItems: string[];
  advice: string;
};

// Back-compat alias used by specialized pages
export type SpecializedReading = SpecializedReadingResult;

function toISODate(d: Date): string {
  // Keep it stable for caching keys
  return new Date(d).toISOString().slice(0, 10);
}

/**
 * Minimal stub (prototype) for "specialized" horoscope readings.
 *
 * NOTE:
 * - This implementation intentionally stays deterministic and dependency-free.
 * - Later we can replace this with a real Thai astrology engine + LLM narration layer.
 */
export async function generateSpecializedReading(
  input: SpecializedReadingInput
): Promise<SpecializedReadingResult> {
  const zodiacSign = input?.zodiacSign ?? "";
  const domain = input?.domain ?? ReadingDomain.FINANCE_CAREER;
  const period = input?.period ?? "daily";
  const now = input?.date ?? new Date();
  const date = toISODate(now);

  const domainTh: Record<ReadingDomain, string> = {
    [ReadingDomain.FINANCE_CAREER]: "การเงิน/การงาน",
    [ReadingDomain.LOVE_RELATIONSHIPS]: "ความรัก/ความสัมพันธ์",
  };

  const label = domainTh[domain] ?? "ภาพรวม";

  return {
    zodiacSign,
    domain,
    period,
    dateRange: { start: now, end: now },
    prediction: `ดวง${label} (${period}) ของ${zodiacSign || "คุณ"} — วันนี้โฟกัสที่ความชัดเจนและการตัดสินใจแบบมีข้อมูลประกอบ อย่าด่วนสรุปจากอารมณ์ชั่ววูบ`,
    opportunities: [
      "มีโอกาสได้ข้อสรุป/ดีลที่ค้างคา หากสื่อสารให้ชัด",
      "งาน/ความสัมพันธ์ไปต่อได้ดีเมื่อวางขอบเขตให้ตรงกัน",
    ],
    challenges: [
      "ความลังเลและความกังวลเล็กๆ ทำให้ตัดสินใจช้ากว่าควร",
      "การตีความคำพูดของอีกฝ่ายเกินจริง อาจทำให้สะดุด",
    ],
    actionItems: [
      "เขียน 1 ประเด็นหลักที่ต้องการให้ชัด แล้วทำให้จบภายในวันนี้",
      "คุยให้จบด้วย ‘ข้อตกลง 1 ประโยค’ ก่อนเริ่มลงมือ",
      "กันเวลาพัก 10–15 นาทีเพื่อรีเซ็ตความคิดก่อนตอบกลับ",
    ],
    advice: "ยิ่งวันนี้จัดระบบความคิดและสื่อสารให้ชัด ผลลัพธ์จะไปในทางที่ดีขึ้นอย่างเห็นได้ชัด",
  };
}
