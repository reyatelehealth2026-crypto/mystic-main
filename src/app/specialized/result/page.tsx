"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ZodiacSign, TimePeriod } from "@/lib/horoscope/types";
import { ReadingDomain, SpecializedReading, generateSpecializedReading } from "@/lib/horoscope/specialized";
import { getZodiacThaiName } from "@/lib/horoscope/zodiac";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sign = searchParams.get("sign") as ZodiacSign;
  const domain = searchParams.get("domain") as ReadingDomain;
  const period = searchParams.get("period") as TimePeriod;

  const [reading, setReading] = useState<SpecializedReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sign || !domain || !period) {
      setError("กรุณาเลือกราศี ด้าน และช่วงเวลา");
      setLoading(false);
      return;
    }

    const fetchReading = async () => {
      try {
        const result = await generateSpecializedReading({
          zodiacSign: sign,
          domain,
          period,
          date: new Date(),
        });
        setReading(result);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดดวง กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [sign, domain, period]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔮</div>
          <p className="mt-2 text-sm text-fg-muted">กำลังอ่านดวง...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="px-5">
        <Card className="p-5 bg-bg border-danger/30">
          <p className="text-sm text-danger">{error || "ไม่พบข้อมูล"}</p>
          <Button className="mt-4 w-full" onClick={() => router.push("/specialized")}>
            กลับไปเลือกใหม่
          </Button>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getDomainLabel = (domain: ReadingDomain) => {
    return domain === ReadingDomain.FINANCE_CAREER
      ? "การเงิน/การงาน"
      : "ความรัก/ความสัมพันธ์";
  };

  const getDomainIcon = (domain: ReadingDomain) => {
    return domain === ReadingDomain.FINANCE_CAREER ? "💼" : "💕";
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case TimePeriod.DAILY:
        return "รายวัน";
      case TimePeriod.WEEKLY:
        return "รายสัปดาห์";
      case TimePeriod.MONTHLY:
        return "รายเดือน";
      default:
        return "";
    }
  };

  return (
    <div className="px-5 pb-6">
      {/* Header Card */}
      <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 mb-4">
        <div className="text-center">
          <div className="text-3xl mb-2">{getDomainIcon(domain)}</div>
          <h2 className="text-xl font-bold text-fg">{getZodiacThaiName(sign)}</h2>
          <p className="mt-1 text-sm text-fg-muted">{getDomainLabel(domain)}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {getPeriodLabel(period)} • {formatDate(reading.dateRange.start)}
            {period !== TimePeriod.DAILY && ` - ${formatDate(reading.dateRange.end)}`}
          </p>
        </div>
      </Card>

      {/* Prediction */}
      <Card className="p-5 bg-bg mb-3">
        <h3 className="text-sm font-bold text-accent mb-2">🔮 คำทำนาย</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.prediction}</p>
      </Card>

      {/* Opportunities */}
      <Card className="p-5 bg-bg mb-3">
        <h3 className="text-sm font-bold text-accent mb-2">✨ โอกาส</h3>
        <ul className="space-y-2">
          {reading.opportunities.map((opportunity, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-fg-muted">
              <span className="text-accent flex-shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{opportunity}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Challenges */}
      <Card className="p-5 bg-bg mb-3">
        <h3 className="text-sm font-bold text-accent mb-2">⚠️ อุปสรรค</h3>
        <ul className="space-y-2">
          {reading.challenges.map((challenge, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-fg-muted">
              <span className="text-accent flex-shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{challenge}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Items */}
      <Card className="p-5 bg-bg mb-3">
        <h3 className="text-sm font-bold text-accent mb-2">📋 สิ่งที่ควรทำ</h3>
        <ul className="space-y-2">
          {reading.actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-fg-muted">
              <span className="text-accent flex-shrink-0 mt-0.5">{index + 1}.</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Advice */}
      <Card className="p-5 bg-bg mb-4">
        <h3 className="text-sm font-bold text-accent mb-2">💡 คำแนะนำ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.advice}</p>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full" onClick={() => router.push("/specialized")}>
          ดูดวงด้านอื่น
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

export default function SpecializedResultPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงเฉพาะด้าน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">
          ดวงเฉพาะด้านของคุณ
        </h1>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="text-2xl">🔮</div>
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
