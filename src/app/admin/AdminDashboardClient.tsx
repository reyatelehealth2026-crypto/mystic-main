"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Stats {
  totalCustomers: number;
  openConsultations: number;
  pendingRedemptions: number;
  activeSubscriptions: number;
}
interface OpenConsultation {
  id: string;
  credits_spent: number;
  opened_at: string;
  user: { display_name: string | null; line_user_id: string };
}
interface PendingRedemption {
  id: string;
  cost_credits: number;
  created_at: string;
  user: { display_name: string | null; line_user_id: string };
  reward: { name: string };
}

export function AdminDashboardClient() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [consultations, setConsultations] = React.useState<OpenConsultation[]>([]);
  const [redemptions, setRedemptions] = React.useState<PendingRedemption[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const [s, c, r] = await Promise.all([
      fetch("/api/admin/stats", { cache: "no-store" }).then((x) => (x.ok ? x.json() : null)),
      fetch("/api/admin/consultations", { cache: "no-store" }).then((x) => (x.ok ? x.json() : null)),
      fetch("/api/admin/redemptions", { cache: "no-store" }).then((x) => (x.ok ? x.json() : null)),
    ]);
    if (s?.ok) setStats(s.stats);
    if (c?.ok) setConsultations(c.consultations);
    if (r?.ok) setRedemptions(r.redemptions);
  }, []);

  React.useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 5000);
    return () => clearInterval(t);
  }, [load]);

  async function closeConsult(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/admin/consultations/${id}/close`, { method: "POST" });
      await load();
    } finally {
      setBusy(null);
    }
  }
  async function fulfill(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/admin/redemptions/${id}/fulfill`, { method: "POST" });
      await load();
    } finally {
      setBusy(null);
    }
  }

  const statItems = [
    { label: "ลูกค้าทั้งหมด", value: stats?.totalCustomers, grad: "from-violet-500 to-purple-600" },
    { label: "คิวปรึกษา", value: stats?.openConsultations, grad: "from-emerald-500 to-teal-600" },
    { label: "รอแลกรางวัล", value: stats?.pendingRedemptions, grad: "from-amber-500 to-orange-600" },
    { label: "สมาชิกแพ็ก", value: stats?.activeSubscriptions, grad: "from-sky-500 to-blue-600" },
  ];

  return (
    <div className="px-5 py-6">
      <h1 className="text-xl font-bold">แดชบอร์ดหมอดู</h1>
      <p className="mt-1 text-sm text-fg-muted">จัดการทุกอย่างที่เดียว · อัปเดตทุก 5 วินาที</p>

      {/* stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {statItems.map((s) => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br p-4 text-white ${s.grad}`}>
            <p className="text-xs text-white/80">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold">{s.value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <Link href="/admin/customers" className="flex-1">
          <Button variant="secondary" className="w-full">👥 ลูกค้า (CRM)</Button>
        </Link>
      </div>

      {/* consultation queue */}
      <h2 className="mt-7 text-lg font-semibold">คิวปรึกษาสด</h2>
      {consultations.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">ไม่มีรอบที่เปิดอยู่</p>
      ) : (
        <div className="mt-3 space-y-3">
          {consultations.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <CardTitle>{c.user.display_name ?? "ลูกค้า"}</CardTitle>
                <CardDesc className="mt-0.5">
                  {c.credits_spent} แต้ม · เปิด {new Date(c.opened_at).toLocaleString("th-TH")}
                </CardDesc>
              </div>
              <Button onClick={() => void closeConsult(c.id)} disabled={busy === c.id}>
                {busy === c.id ? "…" : "ปิดรอบ"}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* redemptions */}
      <h2 className="mt-7 text-lg font-semibold">รอแลกของรางวัล</h2>
      {redemptions.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">ไม่มีรายการรอดำเนินการ</p>
      ) : (
        <div className="mt-3 space-y-3">
          {redemptions.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <CardTitle>{r.reward.name}</CardTitle>
                <CardDesc className="mt-0.5">
                  {r.user.display_name ?? "ลูกค้า"} · {r.cost_credits} แต้ม ·{" "}
                  {new Date(r.created_at).toLocaleString("th-TH")}
                </CardDesc>
              </div>
              <Button onClick={() => void fulfill(r.id)} disabled={busy === r.id}>
                {busy === r.id ? "…" : "ทำเสร็จ"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
