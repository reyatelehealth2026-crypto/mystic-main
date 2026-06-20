"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { requestConfirm } from "@/lib/ui/confirm";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Plan {
  id: string;
  name: string;
  monthlyQuota: number;
  priceCents: number;
}

export function PackagesClient() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    fetch("/api/subscription/plans", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setPlans(d.plans as Plan[]);
      })
      .catch(() => {});
  }, []);

  async function subscribe(planId: string) {
    const plan = plans.find((p) => p.id === planId);
    const ok = await requestConfirm({
      title: "ยืนยันสมัครแพ็ก",
      icon: "📅",
      details: plan
        ? [
            { label: "แพ็ก", value: plan.name },
            { label: "ดูได้", value: `${plan.monthlyQuota} ครั้ง/เดือน`, highlight: true },
            { label: "ราคา", value: `฿${(plan.priceCents / 100).toFixed(0)} / เดือน` },
          ]
        : undefined,
      message: "ยังไม่ผูกระบบชำระเงิน — สมัครเพื่อทดลองใช้ก่อน",
      confirmText: "สมัครเลย",
    });
    if (!ok) return;

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
          {plans.length === 0 ? <p className="text-sm text-fg-muted">ยังไม่มีแพ็ก</p> : null}
          {plans.map((p) => (
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
