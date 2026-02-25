import type { ReadingVertical } from "@/lib/reading/types";
import { ReadingType } from "@/lib/reading/types";

/**
 * Local credit cost lookup to avoid circular/broken dependency on pipeline.ts
 */
function getCreditCost(type: ReadingType, options?: any): number {
  switch (type) {
    case ReadingType.HOROSCOPE:
    case ReadingType.SPECIALIZED:
      if (options?.period === "daily") return 1;
      if (options?.period === "weekly") return 2;
      if (options?.period === "monthly") return 3;
      return 1;
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
      return 1;
    default:
      return 1;
  }
}

export interface PaywallContext {
  vertical: ReadingVertical;
  stage: "pre-result" | "result";
  sessionId?: string;
  hasQuestion?: boolean;
  readingType?: ReadingType;
  readingOptions?: any;
}

export interface PaywallDecision {
  show: boolean;
  reason: string;
  ctaLabel: string;
  ctaHref: string;
  variant: "soft" | "hard";
}

/**
 * Credit check result for new fortune features
 */
export interface CreditCheckResult {
  hasCredits: boolean;
  isFreeReading: boolean;
  requiredCredits: number;
  currentCredits: number;
  reason: string;
}

const STORAGE_KEY = "mf.reading.freeCount";
const CREDITS_STORAGE_KEY = "mf.user.credits";
const FREE_READING_PREFIX = "free_readings_";

function getFreeCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function recordFreeReading(): number {
  if (typeof window === "undefined") return 0;
  const next = getFreeCount() + 1;
  window.localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

/**
 * Get current user credits
 * 
 * @returns Current credit balance
 */
function getUserCredits(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(CREDITS_STORAGE_KEY);
  const parsed = Number(raw ?? "0");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Set user credits
 * 
 * @param credits - New credit balance
 */
function setUserCredits(credits: number): void {
  if (typeof window === "undefined") return;
  const validCredits = Number.isFinite(credits) && credits >= 0 ? credits : 0;
  window.localStorage.setItem(CREDITS_STORAGE_KEY, String(validCredits));
}

/**
 * Check if user has used their free reading for a specific feature type
 * 
 * @param featureType - The reading type to check
 * @returns True if free reading has been used
 */
function hasUsedFreeReading(featureType: ReadingType): boolean {
  if (typeof window === "undefined") return false;
  const key = `${FREE_READING_PREFIX}${featureType}`;
  const value = window.localStorage.getItem(key);
  return value === "true";
}

/**
 * Mark free reading as used for a specific feature type
 * 
 * @param featureType - The reading type to mark
 */
function markFreeReadingUsed(featureType: ReadingType): void {
  if (typeof window === "undefined") return;
  const key = `${FREE_READING_PREFIX}${featureType}`;
  window.localStorage.setItem(key, "true");
}

export function evaluatePaywall(context: PaywallContext): PaywallDecision {
  const freeCount = getFreeCount();
  const highIntent = context.hasQuestion === true || context.vertical === "numerology";

  if (freeCount >= 3 && context.stage === "result") {
    return { show: true, reason: "free_limit_reached", ctaLabel: "ปลดล็อก Premium Reading", ctaHref: `/pricing?source=${context.vertical}&reason=limit`, variant: "hard" };
  }

  if (highIntent && context.stage === "result") {
    return { show: true, reason: "high_intent_offer", ctaLabel: "ดูแผนรายเดือนเพื่อผลลัพธ์ละเอียดขึ้น", ctaHref: `/pricing?source=${context.vertical}&reason=intent`, variant: "soft" };
  }

  return { show: false, reason: "eligible_free", ctaLabel: "", ctaHref: "/pricing", variant: "soft" };
}

/**
 * Check if user has sufficient credits for a reading
 * 
 * This function evaluates:
 * 1. Whether this is the user's first reading of this type (free)
 * 2. Whether the user has sufficient credits to pay for the reading
 * 
 * @param readingType - The type of reading to check
 * @param options - Optional parameters (e.g., period for horoscopes)
 * @returns Credit check result with details
 */
export function checkCredits(readingType: ReadingType, options?: any): CreditCheckResult {
  const requiredCredits = getCreditCost(readingType, options);
  const currentCredits = getUserCredits();
  const isFreeReading = !hasUsedFreeReading(readingType);
  
  // First reading of this type is free
  if (isFreeReading) {
    return {
      hasCredits: true,
      isFreeReading: true,
      requiredCredits,
      currentCredits,
      reason: "first_reading_free"
    };
  }
  
  // Check if user has sufficient credits
  const hasCredits = currentCredits >= requiredCredits;
  
  return {
    hasCredits,
    isFreeReading: false,
    requiredCredits,
    currentCredits,
    reason: hasCredits ? "sufficient_credits" : "insufficient_credits"
  };
}

/**
 * Deduct credits for a reading
 * 
 * This function:
 * 1. Checks if this is a free reading (first time for this feature type)
 * 2. If free, marks it as used but doesn't deduct credits
 * 3. If not free, deducts the required credits
 * 
 * @param readingType - The type of reading
 * @param options - Optional parameters (e.g., period for horoscopes)
 * @returns True if credits were successfully deducted or reading was free
 */
export function deductCredits(readingType: ReadingType, options?: any): boolean {
  const creditCheck = checkCredits(readingType, options);
  
  // If this is a free reading, just mark it as used
  if (creditCheck.isFreeReading) {
    markFreeReadingUsed(readingType);
    return true;
  }
  
  // If insufficient credits, return false
  if (!creditCheck.hasCredits) {
    return false;
  }
  
  // Deduct credits
  const newBalance = creditCheck.currentCredits - creditCheck.requiredCredits;
  setUserCredits(newBalance);
  return true;
}

/**
 * Get credit cost for a reading
 * 
 * This function delegates to the reading pipeline's getCreditCost function
 * to maintain a single source of truth for credit costs.
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
 * @param readingType - The type of reading
 * @param options - Optional parameters (e.g., period for horoscopes)
 * @returns Credit cost for the reading
 */
export function getReadingCreditCost(readingType: ReadingType, options?: any): number {
  return getCreditCost(readingType, options);
}
