"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ZodiacSign, HoroscopeReading } from "@/lib/horoscope/types";
import { getZodiacThaiName } from "@/lib/horoscope/zodiac";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sign = searchParams.get("sign") as ZodiacSign;

  const [reading, setReading] = useState<HoroscopeReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needCredits, setNeedCredits] = useState(false);

  useEffect(() => {
    if (!sign) {
      setError("กรุณาเลือกราศี");
      setLoading(false);
      return;
    }

    const fetchReading = async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "horoscope",
            params: { sign, period: "daily" },
            dedupeKey: `${sign}_daily`,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          const r = data.reading as HoroscopeReading;
          if (r?.dateRange) r.dateRange = { start: new Date(r.dateRange.start), end: new Date(r.dateRange.end) };
          setReading(r);
          window.dispatchEvent(new Event("rf:credits-changed"));
        } else if (res.status === 401) {
          setError("กรุณาเข้าสู่ระบบด้วย LINE ก่อนดูดวง");
        } else if (res.status === 402) {
          setNeedCredits(true);
          setError("แต้มไม่พอ — เติมแต้มก่อนนะคะ");
        } else {
          setError("เกิดข้อผิดพลาดในการโหลดดวง กรุณาลองใหม่อีกครั้ง");
        }
      } catch {
        setError("เกิดข้อผิดพลาดในการโหลดดวง กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [sign]);

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
          {needCredits ? (
            <Link href="/pricing" className="mt-4 block">
              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">เติมแต้ม</Button>
            </Link>
          ) : null}
          <Button className="mt-3 w-full" variant="ghost" onClick={() => router.push("/horoscope/daily")}>
            กลับไปเลือกราศี
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

  return (
    <div className="px-5 pb-6">
      {/* Header Card */}
      <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fg">{getZodiacThaiName(sign)}</h2>
          <p className="mt-1 text-sm text-fg-muted">
            {formatDate(reading.dateRange.start)}
          </p>
        </div>
      </Card>

      {/* Aspects */}
      <div className="mt-4 space-y-3">
        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💕 ความรัก</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.aspects.love}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💼 การงาน</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.aspects.career}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">💰 การเงิน</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.aspects.finance}</p>
        </Card>

        <Card className="p-5 bg-bg">
          <h3 className="text-sm font-bold text-accent mb-2">🏥 สุขภาพ</h3>
          <p className="text-sm leading-relaxed text-fg-muted">{reading.aspects.health}</p>
        </Card>
      </div>

      {/* Lucky Numbers & Colors */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">🍀 เลขและสีมงคล</h3>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-fg-subtle">เลขมงคล: </span>
            <span className="text-sm text-fg">{reading.luckyNumbers.join(", ")}</span>
          </div>
          <div>
            <span className="text-xs text-fg-subtle">สีมงคล: </span>
            <span className="text-sm text-fg">{reading.luckyColors.join(", ")}</span>
          </div>
        </div>
      </Card>

      {/* Advice */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">✨ คำแนะนำ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.advice}</p>
      </Card>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => router.push("/horoscope/daily")}>
          ดูดวงราศีอื่น
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/horoscope")}
        >
          กลับไปเลือกช่วงเวลา
        </Button>
      </div>
    </div>
  );
}

export default function DailyHoroscopeResultPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงรายวัน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ดวงรายวันของคุณ</h1>
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
