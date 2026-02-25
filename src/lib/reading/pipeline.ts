import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { cardMeaning, parseCardTokens, summarizeReading } from "@/lib/tarot/engine";
import { spiritCardFromDob } from "@/lib/tarot/spirit";
import { createBlock, pickTopKeywords } from "./interpretation";
import type { ReadingInput, ReadingSession, ReadingRequest, ReadingResult } from "./types";
import { ReadingType } from "./types";
import { generateHoroscope } from "@/lib/horoscope/engine";
import { calculateCompatibility } from "@/lib/compatibility/engine";
import { generateChineseZodiacReading } from "@/lib/chinese-zodiac/engine";
import { generateSpecializedReading } from "@/lib/horoscope/specialized";
import { calculateNameNumerology } from "@/lib/name-numerology/engine";
import { getCacheEntry } from "./cache";

function makeSessionId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Process a reading request for new fortune features
 * 
 * This function handles the new reading types (horoscope, compatibility, etc.)
 * and orchestrates the reading generation pipeline:
 * 1. Check cache for existing reading
 * 2. Route to appropriate engine based on reading type
 * 3. Return reading result with metadata
 * 
 * @param request - Reading request with type and input parameters
 * @returns Promise resolving to reading result
 */
export async function processReading(request: ReadingRequest): Promise<ReadingResult> {
  const { type, input } = request;
  
  let data: any;
  let cached = false;
  
  // Route to appropriate engine based on reading type
  switch (type) {
    case ReadingType.HOROSCOPE:
      // Check cache before generating
      const horoscopeKey = `${input.zodiacSign}_${input.period}_${input.date.toISOString().split('T')[0]}`;
      const cachedHoroscope = getCacheEntry(horoscopeKey, 'horoscope');
      if (cachedHoroscope) {
        data = cachedHoroscope;
        cached = true;
      } else {
        data = await generateHoroscope(input);
      }
      break;
      
    case ReadingType.COMPATIBILITY:
      data = await calculateCompatibility(input);
      break;
      
    case ReadingType.CHINESE_ZODIAC:
      // Check cache before generating
      const chineseZodiacKey = `${input.birthYear}_${input.period}_${input.date.toISOString().split('T')[0]}`;
      const cachedChineseZodiac = getCacheEntry(chineseZodiacKey, 'chinese_zodiac');
      if (cachedChineseZodiac) {
        data = cachedChineseZodiac;
        cached = true;
      } else {
        data = await generateChineseZodiacReading(input);
      }
      break;
      
    case ReadingType.SPECIALIZED:
      // Check cache before generating
      const specializedKey = `${input.zodiacSign}_${input.domain}_${input.period}_${input.date.toISOString().split('T')[0]}`;
      const cachedSpecialized = getCacheEntry(specializedKey, 'specialized');
      if (cachedSpecialized) {
        data = cachedSpecialized;
        cached = true;
      } else {
        data = await generateSpecializedReading(input);
      }
      break;
      
    case ReadingType.NAME_NUMEROLOGY:
      data = await calculateNameNumerology(input);
      break;
      
    default:
      throw new Error(`Unsupported reading type: ${type}`);
  }
  
  // Get credit cost for this reading type
  const creditCost = getCreditCost(type, input);
  
  return {
    type,
    timestamp: new Date(),
    data,
    creditCost,
    cached
  };
}

/**
 * Get credit cost for a reading type
 * 
 * Credit costs:
 * - Daily horoscope: 1 credit
 * - Weekly horoscope: 2 credits
 * - Monthly horoscope: 3 credits
 * - Compatibility: 2 credits
 * - Chinese zodiac: 1 credit
 * - Specialized: 2 credits
 * - Name numerology: 2 credits
 * 
 * @param type - Reading type
 * @param options - Optional parameters (e.g., period for horoscopes)
 * @returns Credit cost
 */
export function getCreditCost(type: ReadingType, options?: any): number {
  switch (type) {
    case ReadingType.HOROSCOPE:
    case ReadingType.SPECIALIZED:
      // Cost varies by period
      if (options?.period === 'daily') return 1;
      if (options?.period === 'weekly') return 2;
      if (options?.period === 'monthly') return 3;
      return 1; // Default to daily cost
      
    case ReadingType.COMPATIBILITY:
      return 2;
      
    case ReadingType.CHINESE_ZODIAC:
      return 1;
      
    case ReadingType.NAME_NUMEROLOGY:
      return 2;
      
    case ReadingType.TAROT:
    case ReadingType.SPIRIT_CARD:
    case ReadingType.NUMEROLOGY:
    case ReadingType.DAILY_CARD:
      // Existing features - maintain current costs
      return 1;
      
    default:
      return 1;
  }
}

export function runReadingPipeline(input: ReadingInput): ReadingSession | null {
  if (input.kind === "tarot") {
    const cards = parseCardTokens(input.cardsToken);
    if (cards.length === 0 || (input.count > 0 && cards.length !== input.count)) return null;
    const reading = summarizeReading({ cards, count: input.count, question: input.question });

    return {
      sessionId: makeSessionId("tarot"),
      vertical: "tarot",
      headline: "Tarot Reading Result",
      summary: reading.summary,
      tags: ["tarot", `spread-${input.count}`],
      blocks: [
        createBlock({ id: "tarot-summary", type: "summary", title: "ภาพรวมคำทำนาย", body: reading.summary, emphasis: "positive" }),
        ...reading.sections.map((section) =>
          createBlock({ id: `tarot-${section.position}`, type: "insight", title: section.title, body: `${section.description}\n${section.focus}` }),
        ),
        createBlock({ id: "tarot-action", type: "action", title: "Action ต่อจากนี้", body: "เขียน 1 การตัดสินใจภายใน 24 ชั่วโมง • กำหนดตัวชี้วัดที่วัดได้ • เช็กอินอีกครั้งใน 7 วัน" }),
      ],
    };
  }

  if (input.kind === "spirit-card") {
    const result = spiritCardFromDob(input.dob);
    if (!result) return null;
    const keywords = result.orientation === "upright" ? result.card.keywordsUpright : result.card.keywordsReversed;

    return {
      sessionId: makeSessionId("spirit"),
      vertical: "spirit-card",
      headline: "Spirit Card Insight",
      summary: `${result.card.nameTh ?? result.card.name} (${result.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"})`,
      tags: ["spirit-card", `life-path-${result.lifePathNumber}`],
      blocks: [
        createBlock({ id: "spirit-summary", type: "summary", title: "การ์ดประจำจิตวิญญาณ", body: `${result.card.nameTh ?? result.card.name} • เลขเส้นทางชีวิต ${result.lifePathNumber}`, emphasis: "positive" }),
        createBlock({ id: "spirit-insight", type: "insight", title: "ความหมายหลัก", body: cardMeaning(result) }),
        createBlock({ id: "spirit-focus", type: "focus", title: "โฟกัสพลัง", body: pickTopKeywords(keywords) }),
      ],
    };
  }

  const result = analyzeThaiPhone(input.phone);
  if (!result) return null;

  return {
    sessionId: makeSessionId("numerology"),
    vertical: "numerology",
    headline: "Numerology Insight",
    summary: `คะแนน ${result.score}/99 (${result.tier}) จากเบอร์ ${result.normalizedPhone}`,
    tags: ["numerology", `tier-${result.tier}`],
    blocks: [
      createBlock({ id: "num-summary", type: "summary", title: "สรุปคะแนนพลังเบอร์", body: `คะแนน ${result.score}/99 (${result.tier}) • เลขรวม ${result.total} • เลขราก ${result.root}`, emphasis: result.score >= 80 ? "positive" : result.score >= 65 ? "neutral" : "caution" }),
      createBlock({ id: "num-work", type: "insight", title: "การงาน", body: result.themes.work }),
      createBlock({ id: "num-money", type: "insight", title: "การเงิน", body: result.themes.money }),
      createBlock({ id: "num-relationship", type: "insight", title: "ความสัมพันธ์", body: result.themes.relationship }),
      createBlock({ id: "num-warning", type: "warning", title: "คำแนะนำ", body: result.themes.caution, emphasis: "caution" }),
    ],
  };
}
