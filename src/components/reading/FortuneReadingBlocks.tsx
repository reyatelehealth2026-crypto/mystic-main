// Fortune Reading Blocks Component
// Displays structured fortune readings for all new reading types
// Feature: popular-fortune-features

import type { HoroscopeReading } from "@/lib/horoscope/types";
import type { CompatibilityReading } from "@/lib/compatibility/types";
import type { ChineseZodiacReading } from "@/lib/chinese-zodiac/types";
import type { NameNumerologyReading } from "@/lib/name-numerology/types";
import type { SpecializedReading } from "@/lib/horoscope/specialized";
import { Button } from "@/components/ui/Button";

// Union type for all fortune reading types
type FortuneReading = 
  | { type: 'horoscope'; data: HoroscopeReading }
  | { type: 'compatibility'; data: CompatibilityReading }
  | { type: 'chinese_zodiac'; data: ChineseZodiacReading }
  | { type: 'name_numerology'; data: NameNumerologyReading }
  | { type: 'specialized'; data: SpecializedReading };

interface FortuneReadingBlocksProps {
  reading: FortuneReading;
  onViewAnother?: () => void;
  onShare?: () => void;
  onReturnToMenu?: () => void;
}

/**
 * Format date range for display
 */
function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  const endStr = end.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
  
  if (startStr === endStr) {
    return startStr;
  }
  
  return `${startStr} - ${endStr}`;
}

/**
 * Render horoscope reading
 */
function HoroscopeBlocks({ data }: { data: HoroscopeReading }) {
  const isAIEnhanced = data.confidence > 50;
  
  return (
    <>
      {/* Date Range */}
      <div className="mb-4 text-center">
        <p className="text-sm text-slate-400">
          {formatDateRange(data.dateRange.start, data.dateRange.end)}
        </p>
      </div>

      {/* Confidence Indicator */}
      {isAIEnhanced && (
        <div className="mb-4 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3">
          <p className="text-xs text-emerald-300">
            ✨ การตีความนี้ได้รับการปรับปรุงด้วย AI เพื่อความเฉพาะเจาะจงมากขึ้น
          </p>
        </div>
      )}

      {/* Aspects Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💕 ความรัก</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.aspects.love}</p>
        </article>

        <article className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💼 การงาน</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.aspects.career}</p>
        </article>

        <article className="rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💰 การเงิน</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.aspects.finance}</p>
        </article>

        <article className="rounded-2xl border border-green-300/20 bg-green-400/10 p-5">
          <h2 className="text-base font-semibold text-white">🏥 สุขภาพ</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.aspects.health}</p>
        </article>
      </div>

      {/* Lucky Numbers and Colors */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🍀 เลขนำโชค</h2>
          <p className="mt-2 text-sm text-slate-200">{data.luckyNumbers.join(', ')}</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🎨 สีนำโชค</h2>
          <p className="mt-2 text-sm text-slate-200">{data.luckyColors.join(', ')}</p>
        </article>
      </div>

      {/* Advice */}
      <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💡 คำแนะนำ</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.advice}</p>
      </article>
    </>
  );
}

/**
 * Render compatibility reading
 */
function CompatibilityBlocks({ data }: { data: CompatibilityReading }) {
  return (
    <>
      {/* Overall Score */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border-4 border-rose-400 bg-rose-400/20">
          <span className="text-3xl font-bold text-white">{data.overallScore}</span>
        </div>
        <p className="text-sm text-slate-400">{data.elementCompatibility}</p>
      </div>

      {/* Score Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">💬 การสื่อสาร</h2>
          <p className="mt-2 text-2xl font-bold text-slate-200">{data.scores.communication}%</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">💕 ความเชื่อมโยงทางอารมณ์</h2>
          <p className="mt-2 text-2xl font-bold text-slate-200">{data.scores.emotional}%</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🌟 ศักยภาพระยะยาว</h2>
          <p className="mt-2 text-2xl font-bold text-slate-200">{data.scores.longTerm}%</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">✨ คะแนนรวม</h2>
          <p className="mt-2 text-2xl font-bold text-slate-200">{data.scores.overall}%</p>
        </article>
      </div>

      {/* Strengths */}
      <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💪 จุดแข็ง</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-200">
          {data.strengths.map((strength, index) => (
            <li key={index}>• {strength}</li>
          ))}
        </ul>
      </article>

      {/* Challenges */}
      <article className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-5">
        <h2 className="text-base font-semibold text-white">⚠️ ความท้าทาย</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-200">
          {data.challenges.map((challenge, index) => (
            <li key={index}>• {challenge}</li>
          ))}
        </ul>
      </article>

      {/* Advice */}
      <article className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💡 คำแนะนำ</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.advice}</p>
      </article>
    </>
  );
}

/**
 * Render Chinese zodiac reading
 */
function ChineseZodiacBlocks({ data }: { data: ChineseZodiacReading }) {
  return (
    <>
      {/* Animal and Element */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-white">{data.thaiName}</h3>
        <p className="text-sm text-slate-400">{data.chineseName}</p>
        <p className="mt-1 text-sm text-slate-400">
          {formatDateRange(data.dateRange.start, data.dateRange.end)}
        </p>
      </div>

      {/* Fortune Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🌟 โชคลาภโดยรวม</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.fortune.overall}</p>
        </article>

        <article className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💼 การงาน</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.fortune.career}</p>
        </article>

        <article className="rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💰 ความมั่งคั่ง</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.fortune.wealth}</p>
        </article>

        <article className="rounded-2xl border border-green-300/20 bg-green-400/10 p-5">
          <h2 className="text-base font-semibold text-white">🏥 สุขภาพ</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.fortune.health}</p>
        </article>

        <article className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💕 ความสัมพันธ์</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.fortune.relationships}</p>
        </article>
      </div>

      {/* Lucky Items */}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🎨 สีนำโชค</h2>
          <p className="mt-2 text-sm text-slate-200">{data.luckyColors.join(', ')}</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🍀 เลขนำโชค</h2>
          <p className="mt-2 text-sm text-slate-200">{data.luckyNumbers.join(', ')}</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🧭 ทิศนำโชค</h2>
          <p className="mt-2 text-sm text-slate-200">{data.luckyDirections.join(', ')}</p>
        </article>
      </div>

      {/* Advice */}
      <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💡 คำแนะนำ</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.advice}</p>
      </article>
    </>
  );
}

/**
 * Render name numerology reading
 */
function NameNumerologyBlocks({ data }: { data: NameNumerologyReading }) {
  return (
    <>
      {/* Name and Scores */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-white">{data.firstName} {data.lastName}</h3>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs text-slate-400">ชื่อ</p>
            <p className="text-2xl font-bold text-white">{data.scores.firstName}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs text-slate-400">นามสกุล</p>
            <p className="text-2xl font-bold text-white">{data.scores.lastName}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs text-slate-400">ชื่อเต็ม</p>
            <p className="text-2xl font-bold text-white">{data.scores.fullName}</p>
          </div>
          <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3">
            <p className="text-xs text-emerald-300">เลขชะตา</p>
            <p className="text-2xl font-bold text-white">{data.scores.destiny}</p>
          </div>
        </div>
      </div>

      {/* Interpretation Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-base font-semibold text-white">🎭 บุคลิกภาพ</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.interpretation.personality}</p>
        </article>

        <article className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💪 จุดแข็ง</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {data.interpretation.strengths.map((strength, index) => (
              <li key={index}>• {strength}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-5">
          <h2 className="text-base font-semibold text-white">⚠️ จุดอ่อน</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {data.interpretation.weaknesses.map((weakness, index) => (
              <li key={index}>• {weakness}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
          <h2 className="text-base font-semibold text-white">🛤️ เส้นทางชีวิต</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.interpretation.lifePath}</p>
        </article>

        <article className="rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💼 การงาน</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.interpretation.career}</p>
        </article>

        <article className="rounded-2xl border border-purple-300/20 bg-purple-400/10 p-5">
          <h2 className="text-base font-semibold text-white">💕 ความสัมพันธ์</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.interpretation.relationships}</p>
        </article>
      </div>

      {/* Lucky Numbers */}
      <article className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-base font-semibold text-white">🍀 เลขนำโชค</h2>
        <p className="mt-2 text-sm text-slate-200">{data.luckyNumbers.join(', ')}</p>
      </article>

      {/* Advice */}
      <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💡 คำแนะนำ</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.advice}</p>
      </article>
    </>
  );
}

/**
 * Render specialized reading
 */
function SpecializedBlocks({ data }: { data: SpecializedReading }) {
  return (
    <>
      {/* Date Range */}
      <div className="mb-4 text-center">
        <p className="text-sm text-slate-400">
          {formatDateRange(data.dateRange.start, data.dateRange.end)}
        </p>
      </div>

      {/* Prediction */}
      <article className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-base font-semibold text-white">🔮 คำทำนาย</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.prediction}</p>
      </article>

      {/* Opportunities and Challenges */}
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
          <h2 className="text-base font-semibold text-white">✨ โอกาส</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {data.opportunities.map((opportunity, index) => (
              <li key={index}>• {opportunity}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-5">
          <h2 className="text-base font-semibold text-white">⚠️ ความท้าทาย</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {data.challenges.map((challenge, index) => (
              <li key={index}>• {challenge}</li>
            ))}
          </ul>
        </article>
      </div>

      {/* Action Items */}
      <article className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
        <h2 className="text-base font-semibold text-white">📋 สิ่งที่ควรทำ</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-200">
          {data.actionItems.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </article>

      {/* Advice */}
      <article className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <h2 className="text-base font-semibold text-white">💡 คำแนะนำ</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{data.advice}</p>
      </article>
    </>
  );
}

/**
 * Main FortuneReadingBlocks component
 * 
 * Displays structured fortune readings with appropriate formatting
 * for each reading type. Shows confidence indicators for AI-enhanced
 * content and provides post-reading action buttons.
 */
export function FortuneReadingBlocks({ 
  reading, 
  onViewAnother,
  onShare,
  onReturnToMenu
}: FortuneReadingBlocksProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Reading Content */}
      <section className="mt-6">
        {reading.type === 'horoscope' && <HoroscopeBlocks data={reading.data} />}
        {reading.type === 'compatibility' && <CompatibilityBlocks data={reading.data} />}
        {reading.type === 'chinese_zodiac' && <ChineseZodiacBlocks data={reading.data} />}
        {reading.type === 'name_numerology' && <NameNumerologyBlocks data={reading.data} />}
        {reading.type === 'specialized' && <SpecializedBlocks data={reading.data} />}
      </section>

      {/* Post-Reading Actions */}
      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {onViewAnother && (
          <Button onClick={onViewAnother} variant="default">
            ดูดวงอีกครั้ง
          </Button>
        )}
        {onShare && (
          <Button onClick={onShare} variant="secondary">
            แชร์ผลการดูดวง
          </Button>
        )}
        {onReturnToMenu && (
          <Button onClick={onReturnToMenu} variant="ghost">
            กลับไปเมนูหลัก
          </Button>
        )}
      </section>
    </div>
  );
}
