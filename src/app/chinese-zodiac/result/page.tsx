"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRecordReadingView } from "@/lib/history/useRecordReadingView";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimalDisplay } from "@/components/chinese-zodiac/AnimalDisplay";
import { ChineseZodiacReading, ChineseZodiacAnimal, ChineseElement } from "@/lib/chinese-zodiac/types";
import { TimePeriod } from "@/lib/horoscope/types";
import { generateChineseZodiacReading } from "@/lib/chinese-zodiac/engine";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = searchParams.get("year");
  const period = searchParams.get("period") as TimePeriod;

  const [reading, setReading] = useState<ChineseZodiacReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useRecordReadingView({
    type: "chinese-zodiac",
    summary: "ผลดวงปีจีน",
    ready: !!reading,
    dedupeKey: `${year ?? ""}_${period ?? ""}`,
  });

  useEffect(() => {
    if (!year || !period) {
      setError("กรุณาระบุปีเกิดและช่วงเวลา");
      setLoading(false);
      return;
    }

    const fetchReading = async () => {
      try {
        const birthYear = parseInt(year);
        if (isNaN(birthYear)) {
          setError("ปีเกิดไม่ถูกต้อง");
          setLoading(false);
          return;
        }

        const result = await generateChineseZodiacReading({
          birthYear,
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
  }, [year, period]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🐉</div>
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
          <Button className="mt-4 w-full" onClick={() => router.push("/chinese-zodiac")}>
            กลับไประบุข้อมูล
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
      {/* Animal Display */}
      <AnimalDisplay
        animal={reading.animal}
        element={reading.element}
        showDetails={true}
        className="mb-4"
      />

      {/* Period Info */}
      <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 mb-4">
        <div className="text-center">
          <p className="text-xs text-fg-muted">ดวง{getPeriodLabel(period)}</p>
          <p className="mt-1 text-sm font-medium text-fg">
            {formatDate(reading.dateRange.start)}
            {period !== TimePeriod.DAILY && ` - ${formatDate(reading.dateRange.end)}`}
          </p>
        </div>
      </Card>

      {/* Fortune Sections */}
      <div className="space-y-3">
        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">🌟 โชคชะตาโดยรวม</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.fortune.overall}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💼 การงาน</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.fortune.career}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💰 การเงิน</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.fortune.wealth}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">🏥 สุขภาพ</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.fortune.health}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💕 ความสัมพันธ์</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.fortune.relationships}</p>
        </Card>
      </div>

      {/* Advice */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">✨ คำแนะนำ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.advice}</p>
      </Card>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => router.push("/chinese-zodiac")}>
          ดูดวงช่วงเวลาอื่น
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

export default function ChineseZodiacResultPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงจีน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ดวงจีนของคุณ</h1>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="text-2xl">🐉</div>
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
