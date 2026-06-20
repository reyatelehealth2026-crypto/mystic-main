"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Detail {
  user: {
    id: string;
    line_user_id: string;
    display_name: string | null;
    picture_url: string | null;
    status_message: string | null;
    credits: number;
    membership_tier: string;
    created_at: string;
    last_login_at: string | null;
  };
  transactions: Array<{ id: string; delta: number; reason: string; reading_type: string | null; balance_after: number; created_at: string }>;
  history: Array<{ id: string; type: string; summary: string | null; created_at: string }>;
  orders: Array<{ id: string; credit_amount: number; price_cents: number; status: string; created_at: string }>;
}

export function CustomerDetailClient({ id }: { id: string }) {
  const [data, setData] = React.useState<Detail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [amount, setAmount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/admin/customers/${id}`, { cache: "no-store" });
      const json = await resp.json();
      if (json.ok) setData(json);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const grant = async () => {
    const n = Number(amount);
    if (!Number.isInteger(n) || n === 0) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/customers/${id}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: n }),
      });
      setAmount("");
      await load();
    } finally {
      setBusy(false);
    }
  };

  const notify = async () => {
    if (!message.trim()) return;
    setBusy(true);
    try {
      const resp = await fetch(`/api/admin/customers/${id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      const json = await resp.json();
      setMessage("");
      alert(json.ok ? "ส่งข้อความสำเร็จ" : `ส่งไม่สำเร็จ: ${json.reason ?? json.error}`);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="px-4 py-8 text-center text-fg-muted">กำลังโหลด…</p>;
  if (!data) return <p className="px-4 py-8 text-center text-fg-muted">ไม่พบลูกค้า</p>;

  const { user } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft className="size-4" /> กลับไปรายชื่อลูกค้า
      </Link>

      <Card className="mt-4 p-5">
        <div className="flex items-center gap-4">
          {user.picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture_url} alt="" className="size-14 rounded-full object-cover" />
          ) : (
            <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-lg">
              {(user.display_name ?? "?").slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <CardTitle>{user.display_name ?? "ไม่ระบุชื่อ"}</CardTitle>
            <p className="truncate text-xs text-fg-muted">{user.line_user_id}</p>
            <p className="mt-1 text-sm">
              เครดิต <span className="font-semibold">{user.credits}</span> · ระดับ {user.membership_tier}
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <CardTitle className="text-sm">ปรับเครดิต</CardTitle>
          <div className="mt-3 flex gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="เช่น 10 หรือ -5"
            />
            <Button onClick={grant} disabled={busy} variant="secondary">
              บันทึก
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <CardTitle className="text-sm">ส่งข้อความ LINE</CardTitle>
          <div className="mt-3 flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="ข้อความถึงลูกค้า" />
            <Button onClick={notify} disabled={busy} variant="secondary">
              ส่ง
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <CardTitle className="text-sm">ประวัติเครดิต (Ledger)</CardTitle>
        <div className="mt-3 space-y-1 text-sm">
          {data.transactions.length === 0 ? (
            <p className="text-fg-muted">ยังไม่มีรายการ</p>
          ) : (
            data.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-border py-1.5">
                <span className="text-fg-muted">
                  {t.reason}
                  {t.reading_type ? ` · ${t.reading_type}` : ""}
                </span>
                <span className={t.delta >= 0 ? "text-emerald-600" : "text-destructive"}>
                  {t.delta >= 0 ? "+" : ""}
                  {t.delta} → {t.balance_after}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <CardTitle className="text-sm">ประวัติการดูดวง</CardTitle>
        <div className="mt-3 space-y-1 text-sm">
          {data.history.length === 0 ? (
            <p className="text-fg-muted">ยังไม่มีประวัติ</p>
          ) : (
            data.history.map((h) => (
              <div key={h.id} className="border-b border-border py-1.5">
                <span className="font-medium">{h.type}</span>
                <span className="ml-2 text-fg-muted">{h.summary?.slice(0, 80)}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
