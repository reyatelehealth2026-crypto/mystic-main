"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { requestConfirm } from "@/lib/ui/confirm";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID ?? "";
const OA_LINK = OA_ID ? `https://line.me/R/ti/p/${OA_ID}` : "https://line.me/";

export function ConsultClient() {
  const { user, loading, login } = useAuth();
  const [hasOpen, setHasOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const refresh = React.useCallback(async () => {
    const res = await fetch("/api/consultation", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setHasOpen(Boolean(data.consultation));
    }
  }, []);

  React.useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);

  async function start() {
    const ok = await requestConfirm({
      title: "ยืนยันเปิดรอบปรึกษา",
      icon: "💬",
      details: [
        { label: "ปรึกษาหมอดูสด", value: "1 รอบ" },
        { label: "ใช้แต้ม", value: "1 แต้ม", highlight: true },
        { label: "แต้มคงเหลือ", value: `${user?.credits ?? 0} แต้ม` },
      ],
      message: "เปิดรอบแล้วทักหาหมอดูที่ LINE ได้เลย",
      confirmText: "เปิดรอบเลย",
      tone: "spend",
    });
    if (!ok) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/consultation", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setHasOpen(true);
        window.dispatchEvent(new Event("rf:credits-changed"));
      } else if (res.status === 402) {
        setError(`เครดิตไม่พอ — ต้องใช้ ${data.requiredCredits} เครดิต (คุณมี ${data.currentCredits})`);
      } else {
        setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-5 py-6">
      <Card className="p-5">
        <CardTitle>ปรึกษาหมอดูสด</CardTitle>
        <CardDesc className="mt-1">
          จ่าย 1 เครดิตเพื่อเปิดรอบปรึกษา แล้วทักหาหมอดูที่ LINE ได้เลย
        </CardDesc>

        {!user ? (
          <div className="mt-4">
            <Button
              onClick={login}
              disabled={loading}
              className="bg-[#06C755] text-white hover:bg-[#05b34c]"
            >
              เข้าสู่ระบบด้วย LINE ก่อน
            </Button>
          </div>
        ) : hasOpen ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-green-600">✅ เปิดรอบแล้ว — ทักหาหมอดูที่ LINE ได้เลย</p>
            <a href={OA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="default" className="bg-[#06C755] text-white hover:bg-[#05b34c]">
                เปิดแชทกับหมอดูใน LINE
              </Button>
            </a>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Button variant="default" onClick={() => void start()} disabled={busy}>
              {busy ? "กำลังเปิดรอบ…" : "ปรึกษาหมอดูสด · 1 เครดิต"}
            </Button>
            {error ? (
              <p className="text-sm text-red-600">
                {error} <Link href="/pricing" className="underline">เติมเครดิต</Link>
              </p>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
