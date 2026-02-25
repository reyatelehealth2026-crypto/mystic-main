"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { calculateThaiCompatibility } from "@/lib/thai-astrology/engine";
import { ThaiCompatibilityReading } from "@/lib/thai-astrology/types";
import { THAI_DAY_MEANINGS, THAI_YEAR_ANIMAL_MEANINGS } from "@/lib/thai-astrology/types";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");

  const [reading, setReading] = useState<ThaiCompatibilityReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date1 || !date2) {
      setError("กรุณาระบุวันเกิดทั้งสองคน");
      setLoading(false);
      return;
    }

    try {
      const result = calculateThaiCompatibility({
        person1: { birthDate: new Date(date1) },
        person2: { birthDate: new Date(date2) },
      });
      setReading(result);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการวิเคราะห์ความเข้ากัน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, [date1, date2]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">💕</div>
          <p className="mt-2 text-sm text-fg-muted">กำลังวิเคราะห์ความเข้ากัน...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="px-5">
        <Card className="p-5 bg-bg border-danger/30">
          <p className="text-sm text-danger">{error || "ไม่พบข้อมูล"}</p>
          <Button className="mt-4 w-full" onClick={() => router.push("/compatibility")}>
            กลับไปใส่วันเกิด
          </Button>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "เข้ากันดีมาก";
    if (score >= 60) return "เข้ากันดี";
    if (score >= 40) return "เข้ากันปานกลาง";
    return "ต้องปรับตัว";
  };

  const dayName1 = THAI_DAY_MEANINGS[reading.person1.day].name;
  const dayName2 = THAI_DAY_MEANINGS[reading.person2.day].name;
  const animal1 = THAI_YEAR_ANIMAL_MEANINGS[reading.person1.yearAnimal];
  const animal2 = THAI_YEAR_ANIMAL_MEANINGS[reading.person2.yearAnimal];

  return (
    <div className="px-5 pb-6">
      {/* Header Card */}
      <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-fg">{dayName1}</div>
              <div className="text-xs text-fg-muted">{animal1.name} ({animal1.animal})</div>
            </div>
            <div className="text-2xl">💕</div>
            <div className="text-center">
              <div className="text-lg font-bold text-fg">{dayName2}</div>
              <div className="text-xs text-fg-muted">{animal2.name} ({animal2.animal})</div>
            </div>
          </div>
          
          <div className={`text-4xl font-bold ${getScoreColor(reading.overallScore)}`}>
            {reading.overallScore}%
          </div>
          <p className="mt-1 text-sm text-fg-muted">{getScoreLabel(reading.overallScore)}</p>
          
          <div className="mt-3 flex justify-center gap-2">
            <span className="px-2 py-1 bg-white/70 rounded-full text-xs">
              ธาตุ{reading.person1.element === 'wood' ? 'ไม้' : 
                     reading.person1.element === 'fire' ? 'ไฟ' :
                     reading.person1.element === 'earth' ? 'ดิน' :
                     reading.person1.element === 'metal' ? 'ทอง' : 'น้ำ'}
            </span>
            <span className="text-fg-muted">×</span>
            <span className="px-2 py-1 bg-white/70 rounded-full text-xs">
              ธาตุ{reading.person2.element === 'wood' ? 'ไม้' : 
                     reading.person2.element === 'fire' ? 'ไฟ' :
                     reading.person2.element === 'earth' ? 'ดิน' :
                     reading.person2.element === 'metal' ? 'ทอง' : 'น้ำ'}
            </span>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">🙏 สรุปภาพรวม</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.interpretation.summary}</p>
      </Card>

      {/* Detailed Scores */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">📊 คะแนนรายด้าน</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">เข้ากันของวัน</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.dayCompatibility)}`}>
              {reading.scores.dayCompatibility}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">เข้ากันของนักษัตร</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.animalCompatibility)}`}>
              {reading.scores.animalCompatibility}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">เข้ากันของธาตุ</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.elementCompatibility)}`}>
              {reading.scores.elementCompatibility}%
            </span>
          </div>
        </div>
      </Card>

      {/* Strengths */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">💪 จุดแข็งของความสัมพันธ์</h3>
        <ul className="space-y-2">
          {reading.interpretation.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-sm leading-relaxed text-fg-muted flex-1">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Challenges */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">⚠️ ความท้าทาย</h3>
        <ul className="space-y-2">
          {reading.interpretation.challenges.map((challenge, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">!</span>
              <span className="text-sm leading-relaxed text-fg-muted flex-1">{challenge}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Advice */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">✨ คำแนะนำ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.interpretation.advice}</p>
      </Card>

      {/* Auspicious Tips */}
      <Card className="mt-4 p-5 bg-amber-50 border-amber-200">
        <h3 className="text-sm font-bold text-amber-700 mb-3">🍀 เคล็ดลับเสริมดวง</h3>
        <ul className="space-y-2">
          {reading.interpretation.auspicious.map((tip, index) => (
            <li key={index} className="flex items-start gap-2"
            >
              <span className="text-amber-600 mt-0.5">🙏</span>
              <span className="text-sm leading-relaxed text-gray-700 flex-1">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => router.push("/compatibility")}>
          วิเคราะห์คู่อื่น
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/")}
        >
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  );
}

export default function ThaiCompatibilityResultPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงความเข้ากัน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ผลการวิเคราะห์</h1>
        <p className="text-sm text-fg-muted">โหราศาสตร์ไทย</p>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="text-2xl">💕</div>
              <p className="mt-2 text-sm text-fg-muted">กำลังโหลด...</p>
            </div>
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </main>
  );
}
