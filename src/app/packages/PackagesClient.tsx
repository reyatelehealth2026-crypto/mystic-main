"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription/plans";

export function PackagesClient() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState("");

  async function subscribe(planId: string) {
    setBusy(planId);
    setMsg("");
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      if (res.ok) {
        setMsg("สมัครแพ็กสำเร็จ ✅");
        router.push("/membership");
      } else if (res.status === 401) {
        setMsg("กรุณาเข้าสู่ระบบก่อนนะคะ");
      } else {
        setMsg("สมัครไม่สำเร็จ ลองใหม่อีกครั้งนะคะ");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="px-5 py-6">
      <h1 className="text-xl font-bold">แพ็กรายเดือน</h1>
      <p className="mt-1 text-sm text-fg-muted">ดูดวง/ปรึกษาได้ตามจำนวนครั้งทุกเดือน คุ้มกว่าจ่ายรายครั้ง</p>

      {!user ? (
        <Button className="mt-5 bg-[#06C755] text-white hover:bg-[#05b34c]" onClick={login} disabled={loading}>
          เข้าสู่ระบบด้วย LINE ก่อน
        </Button>
      ) : (
        <div className="mt-5 space-y-3">
          {SUBSCRIPTION_PLANS.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <CardTitle>{p.name}</CardTitle>
                <CardDesc className="mt-0.5">฿{(p.priceCents / 100).toFixed(0)} / เดือน</CardDesc>
              </div>
              <Button onClick={() => void subscribe(p.id)} disabled={busy === p.id}>
                {busy === p.id ? "กำลังสมัคร…" : "สมัคร"}
              </Button>
            </Card>
          ))}
          {msg ? <p className="text-center text-sm text-fg-muted">{msg}</p> : null}
          <p className="text-center text-xs text-fg-subtle">* ยังไม่ผูกระบบชำระเงิน — สมัครเพื่อทดลองใช้ก่อน</p>
        </div>
      )}
    </div>
  );
}
