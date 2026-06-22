"use client";

import * as React from "react";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface OpenConsultation {
  id: string;
  credits_spent: number;
  opened_at: string;
  user: { id: string; display_name: string | null; line_user_id: string; picture_url: string | null };
}

export function ConsultationsClient() {
  const [items, setItems] = React.useState<OpenConsultation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [closingId, setClosingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/consultations", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setItems(data.consultations as OpenConsultation[]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 5000);
    return () => clearInterval(t);
  }, [load]);

  async function close(id: string) {
    setClosingId(id);
    try {
      await fetch(`/api/admin/consultations/${id}/close`, { method: "POST" });
      await load();
    } finally {
      setClosingId(null);
    }
  }

  return (
    <div className="px-5 py-6">
      <h1 className="text-lg font-semibold">ปรึกษาหมอดูสด — รอบที่เปิดอยู่</h1>
      <p className="mt-1 text-sm text-muted-foreground">รายการอัปเดตอัตโนมัติทุก 5 วินาที</p>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">กำลังโหลด…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">ยังไม่มีรอบที่เปิดอยู่</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <CardTitle>{c.user.display_name ?? "ลูกค้า"}</CardTitle>
                <CardDesc className="mt-0.5">
                  {c.credits_spent} เครดิต · เปิดเมื่อ {new Date(c.opened_at).toLocaleString("th-TH")}
                </CardDesc>
              </div>
              <Button
                variant="default"
                size="default"
                onClick={() => void close(c.id)}
                disabled={closingId === c.id}
              >
                {closingId === c.id ? "กำลังปิด…" : "ปิดรอบ"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
