"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ReadingType } from "@/lib/reading/types";
import { THAI_DAY_MEANINGS, ThaiDay } from "@/lib/thai-astrology/types";
import { THAI_YEAR_ANIMAL_MEANINGS } from "@/lib/thai-astrology/types";

export default function ThaiCompatibilityPage() {
  const router = useRouter();
  const [person1Date, setPerson1Date] = useState("");
  const [person2Date, setPerson2Date] = useState("");
  const [person1Error, setPerson1Error] = useState("");
  const [person2Error, setPerson2Error] = useState("");

  const validateDates = (): boolean => {
    let isValid = true;
    setPerson1Error("");
    setPerson2Error("");

    if (!person1Date) {
      setPerson1Error("กรุณาระบุวันเกิดคนที่ 1");
      isValid = false;
    }

    if (!person2Date) {
      setPerson2Error("กรุณาระบุวันเกิดคนที่ 2");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateDates()) return;

    const params = new URLSearchParams({
      date1: person1Date,
      date2: person2Date,
    });

    router.push(`/compatibility/result?${params.toString()}`);
  };

  // แสดงวันเกิดเป็นภาษาไทย
  const getThaiDayName = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const dayMap: Record<number, string> = {
      0: "อาทิตย์",
      1: "จันทร์",
      2: "อังคาร",
      3: "พุธ",
      4: "พฤหัสบดี",
      5: "ศุกร์",
      6: "เสาร์",
    };
    return `วัน${dayMap[dayOfWeek]}`;
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* Privacy Notice - shows only on first use */}
      <PrivacyNotice 
        featureType={ReadingType.COMPATIBILITY}
        featureName="ดูดวงความรัก"
      />
      
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงความรัก" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ดูดวงความเข้ากัน</h1>
        <p className="mt-1 text-sm text-fg-muted">
          โหราศาสตร์ไทย - วันเกิด นักษัตร และธาตุ
        </p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5 bg-bg">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💕</span>
              <h2 className="text-base font-semibold text-fg">ข้อมูลวันเกิด</h2>
            </div>
            <p className="text-sm text-fg-muted">
              ระบบจะคำนวณตาม<strong>โหราศาสตร์ไทย</strong> วันเกิด นักษัตร และธาตุ
            </p>
          </div>

          {/* Person 1 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-fg mb-2">
              คนที่ 1 🧑
            </label>
            <input
              type="date"
              value={person1Date}
              onChange={(e) => setPerson1Date(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-fg outline-none transition focus:ring-2 focus:ring-ring"
            />
            {person1Date && (
              <p className="mt-2 text-sm text-accent">
                {getThaiDayName(person1Date)} 
                <span className="text-fg-muted">(นักษัตรปี{getThaiAnimalYear(person1Date)})</span>
              </p>
            )}
            {person1Error && (
              <p className="mt-1 text-sm text-danger">{person1Error}</p>
            )}
          </div>

          <div className="text-center text-2xl my-2">💕</div>

          {/* Person 2 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-fg mb-2">
              คนที่ 2 👩
            </label>
            <input
              type="date"
              value={person2Date}
              onChange={(e) => setPerson2Date(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-fg outline-none transition focus:ring-2 focus:ring-ring"
            />
            {person2Date && (
              <p className="mt-2 text-sm text-accent">
                {getThaiDayName(person2Date)} 
                <span className="text-fg-muted">(นักษัตรปี{getThaiAnimalYear(person2Date)})</span>
              </p>
            )}
            {person2Error && (
              <p className="mt-1 text-sm text-danger">{person2Error}</p>
            )}
          </div>
        </Card>

        <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <span className="text-lg">🙏</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-fg mb-1">โหราศาสตร์ไทย</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                การวิเคราะห์ความเข้ากันจะดูจาก<strong>วันเกิด</strong> 
                <strong>นักษัตรปีเกิด</strong> และ<strong>ธาตุ</strong> 
                ตามตำราโหราศาสตร์ไทยโบราณ ให้คำแนะนำที่เหมาะสมสำหรับความสัมพันธ์
              </p>
            </div>
          </div>
        </Card>

        <div className="sticky bottom-20 z-30 mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!person1Date || !person2Date}
          >
            วิเคราะห์ความเข้ากัน
          </Button>
        </div>

        {/* Feature Menu */}
        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      {/* FAB */}
      <FAB label="เพิ่มเพื่อน LINE" />
    </main>
  );
}

// Helper function to get Thai animal year name
function getThaiAnimalYear(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  
  // คำนวณนักษัตร
  const baseYear = 2020; // ปีชวด (หนู)
  const diff = year - baseYear;
  const index = ((diff % 12) + 12) % 12;
  
  const animals = [
    "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)",
    "มะโรง (มังกร)", "มะเส็ง (งู)", "มะเมีย (ม้า)", "มะแม (แพะ)",
    "วอก (ลิง)", "ระกา (ไก่)", "จอ (สุนัข)", "กุน (หมู)"
  ];
  
  return animals[index];
}
