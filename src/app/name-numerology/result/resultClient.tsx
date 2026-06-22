"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AppBar } from "@/components/nav/AppBar";
import type { NameNumerologyReading } from "@/lib/name-numerology/types";

export default function ResultClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const firstName = (sp.get("firstName") ?? "").trim();
  const lastName = (sp.get("lastName") ?? "").trim();

  const [error, setError] = React.useState<string>("");
  const [needCredits, setNeedCredits] = React.useState(false);
  const [reading, setReading] = React.useState<NameNumerologyReading | null>(null);

  React.useEffect(() => {
    if (!firstName || !lastName) {
      setError("กรุณากรอกชื่อและนามสกุล");
      return;
    }
    const fetchReading = async () => {
      try {
        const res = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "name_numerology", params: { firstName, lastName }, dedupeKey: `${firstName}_${lastName}` }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setReading(data.reading as NameNumerologyReading);
          window.dispatchEvent(new Event("rf:credits-changed"));
        } else if (res.status === 401) {
          setError("กรุณาเข้าสู่ระบบด้วย LINE ก่อนดูดวง");
        } else if (res.status === 402) {
          setNeedCredits(true);
          setError("แต้มไม่พอ — เติมแต้มก่อนนะคะ");
        } else {
          setError("เกิดข้อผิดพลาด");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
      }
    };
    void fetchReading();
  }, [firstName, lastName]);

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-10 pt-8">
      <header className="space-y-2">
        <AppBar title="เลขศาสตร์ชื่อ" className="px-0 pt-0 pb-0" />
        <h1 className="text-2xl font-semibold tracking-tight text-fg">ผลการวิเคราะห์ชื่อ</h1>
        <p className="text-sm text-fg-muted">ผลลัพธ์นี้เป็น baseline (คงที่) และจะต่อยอด AI ได้ภายหลัง</p>
      </header>

      {error ? (
        <Card className="mt-6 p-5">
          <CardTitle>เกิดปัญหา</CardTitle>
          <CardDesc className="mt-2 text-danger">{error}</CardDesc>
          {needCredits ? (
            <Link href="/pricing" className="mt-4 block">
              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">เติมแต้ม</Button>
            </Link>
          ) : null}
          <div className="mt-3">
            <Button variant="secondary" className="w-full" onClick={() => router.push("/name-numerology")}>กลับไปกรอกใหม่</Button>
          </div>
        </Card>
      ) : reading ? (
        <section className="mt-6 space-y-4">
          <Card className="p-5">
            <CardTitle>{reading.firstName} {reading.lastName}</CardTitle>
            <CardDesc className="mt-1">เลขชะตา: {reading.scores.destiny} • เลขชื่อเต็ม: {reading.scores.fullName}</CardDesc>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs font-medium text-fg-muted">เลขชื่อ</p>
              <p className="mt-2 text-3xl font-semibold text-fg">{reading.scores.firstName}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium text-fg-muted">เลขนามสกุล</p>
              <p className="mt-2 text-3xl font-semibold text-fg">{reading.scores.lastName}</p>
            </Card>
          </div>

          <Card className="p-5">
            <CardTitle>สรุปบุคลิกภาพ</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{reading.interpretation.personality}</p>
          </Card>

          <Card className="p-5">
            <CardTitle>คำแนะนำ</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{reading.advice}</p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full" onClick={() => router.push("/name-numerology")}>วิเคราะห์ใหม่</Button>
            <Button className="w-full" variant="secondary" onClick={() => router.push("/library/saved")}>ไปคลังบันทึก</Button>
          </div>
        </section>
      ) : (
        <Card className="mt-6 p-5">
          <p className="text-sm text-fg-muted">กำลังประมวลผล...</p>
        </Card>
      )}
    </main>
  );
}
