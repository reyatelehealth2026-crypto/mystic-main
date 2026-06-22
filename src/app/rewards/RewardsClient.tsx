"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { requestConfirm } from "@/lib/ui/confirm";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  cost_credits: number;
}

export function RewardsClient() {
  const { user, loading, login } = useAuth();
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    fetch("/api/rewards", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setRewards(d.rewards as Reward[]);
      })
      .catch(() => {});
  }, []);

  async function redeem(reward: Reward) {
    const enough = (user?.credits ?? 0) >= reward.cost_credits;
    const ok = await requestConfirm({
      title: "ยืนยันแลกของรางวัล",
      icon: "🎁",
      details: [
        { label: "ของรางวัล", value: reward.name },
        { label: "ใช้แต้ม", value: `${reward.cost_credits} แต้ม`, highlight: true },
        { label: "แต้มคงเหลือ", value: `${user?.credits ?? 0} แต้ม` },
      ],
      message: enough ? undefined : "แต้มของคุณไม่พอสำหรับรางวัลนี้",
      confirmText: "แลกเลย",
      tone: "spend",
      disabled: !enough,
    });
    if (!ok) return;

    setBusy(reward.id);
    setMsg("");
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg("แลกของรางวัลสำเร็จ ✅ ทีมงานจะติดต่อยืนยัน");
        window.dispatchEvent(new Event("rf:credits-changed"));
      } else if (res.status === 402) setMsg("แต้มไม่พอสำหรับรางวัลนี้");
      else if (res.status === 401) setMsg("กรุณาเข้าสู่ระบบก่อนนะคะ");
      else setMsg(`แลกไม่สำเร็จ (${data.error ?? "error"})`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="px-5 py-6">
      <h1 className="text-xl font-bold">🎁 แลกของรางวัล</h1>
      <p className="mt-1 text-sm text-fg-muted">ใช้แต้มสะสมแลกสิทธิพิเศษ</p>

      {!user ? (
        <Button className="mt-5 bg-[#06C755] text-white hover:bg-[#05b34c]" onClick={login} disabled={loading}>
          เข้าสู่ระบบด้วย LINE ก่อน
        </Button>
      ) : (
        <div className="mt-5 space-y-3">
          {rewards.length === 0 ? (
            <p className="text-sm text-fg-muted">ยังไม่มีของรางวัล</p>
          ) : (
            rewards.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <CardTitle>{r.name}</CardTitle>
                  {r.description ? <CardDesc className="mt-0.5">{r.description}</CardDesc> : null}
                  <p className="mt-1 text-sm font-semibold text-emerald-600">{r.cost_credits} แต้ม</p>
                </div>
                <Button onClick={() => void redeem(r)} disabled={busy === r.id}>
                  {busy === r.id ? "กำลังแลก…" : "แลก"}
                </Button>
              </Card>
            ))
          )}
          {msg ? <p className="text-center text-sm text-fg-muted">{msg}</p> : null}
        </div>
      )}
    </div>
  );
}
