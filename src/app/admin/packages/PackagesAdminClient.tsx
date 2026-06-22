"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

type Field = { key: string; label: string; type: "text" | "number" | "bool" };
type Row = Record<string, unknown>;

function Section({
  title,
  hint,
  endpoint,
  idKey,
  fields,
  addTemplate,
  canDelete,
}: {
  title: string;
  hint?: string;
  endpoint: string;
  idKey: string;
  fields: Field[];
  addTemplate?: Row | null;
  canDelete: boolean;
}) {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [savingIdx, setSavingIdx] = React.useState<number | null>(null);

  const load = React.useCallback(async () => {
    try {
      const r = await fetch(endpoint, { cache: "no-store" });
      const d = await r.json();
      if (d.ok) setRows(d.items as Row[]);
    } catch {
      /* ignore */
    }
  }, [endpoint]);

  React.useEffect(() => {
    void load();
  }, [load]);

  function setField(idx: number, key: string, val: unknown) {
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  }

  async function save(idx: number) {
    setSavingIdx(idx);
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows[idx]),
      });
      await load();
    } finally {
      setSavingIdx(null);
    }
  }

  async function del(idx: number) {
    const id = rows[idx][idKey];
    if (!id) {
      setRows((rs) => rs.filter((_, i) => i !== idx));
      return;
    }
    await fetch(`${endpoint}?id=${encodeURIComponent(String(id))}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="mt-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hint ? <p className="mt-0.5 text-xs text-fg-muted">{hint}</p> : null}

      <div className="mt-3 space-y-3">
        {rows.map((row, idx) => (
          <div key={String(row[idKey] ?? `new-${idx}`)} className="rounded-2xl border border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              {fields.map((f) => (
                <label key={f.key} className="text-xs text-fg-muted">
                  {f.label}
                  {f.type === "bool" ? (
                    <button
                      type="button"
                      onClick={() => setField(idx, f.key, !row[f.key])}
                      className={`mt-1 block rounded-lg px-3 py-1.5 text-sm font-medium ${row[f.key] ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {row[f.key] ? "เปิด" : "ปิด"}
                    </button>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(row[f.key] ?? "")}
                      onChange={(e) =>
                        setField(idx, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-border px-2 py-1.5 text-sm text-fg"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => void save(idx)} disabled={savingIdx === idx}>
                {savingIdx === idx ? "บันทึก…" : "บันทึก"}
              </Button>
              {canDelete ? (
                <Button size="sm" variant="ghost" onClick={() => void del(idx)}>
                  ลบ
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {addTemplate ? (
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => setRows((rs) => [...rs, { ...addTemplate }])}
        >
          + เพิ่มรายการ
        </Button>
      ) : null}
    </section>
  );
}

export function PackagesAdminClient() {
  return (
    <div className="px-5 py-6">
      <h1 className="text-xl font-bold">จัดการแพ็กเกจ</h1>
      <p className="mt-1 text-sm text-fg-muted">ราคาเป็นสตางค์ (฿1 = 100) · กดบันทึกทีละรายการ</p>

      <Section
        title="A · แพ็กรายเดือน"
        hint="ดูฟรีตามจำนวนครั้ง/เดือน"
        endpoint="/api/admin/catalog/plans"
        idKey="id"
        canDelete
        fields={[
          { key: "id", label: "รหัส", type: "text" },
          { key: "name", label: "ชื่อ", type: "text" },
          { key: "monthly_quota", label: "ครั้ง/เดือน", type: "number" },
          { key: "price_cents", label: "ราคา(สตางค์)", type: "number" },
          { key: "sort", label: "ลำดับ", type: "number" },
          { key: "active", label: "สถานะ", type: "bool" },
        ]}
        addTemplate={{ id: "", name: "", monthly_quota: 10, price_cents: 0, sort: 0, active: true }}
      />

      <Section
        title="B · ค่าบริการต่อครั้ง"
        hint="ดูดวงแต่ละแบบใช้กี่เครดิต (server บังคับใช้ค่านี้)"
        endpoint="/api/admin/catalog/service-costs"
        idKey="reading_type"
        canDelete={false}
        fields={[
          { key: "reading_type", label: "ประเภท", type: "text" },
          { key: "label", label: "ชื่อ", type: "text" },
          { key: "cost_credits", label: "เครดิต/ครั้ง", type: "number" },
        ]}
        addTemplate={null}
      />

      <Section
        title="C · ของรางวัล"
        hint="ใช้แต้มแลก"
        endpoint="/api/admin/catalog/rewards"
        idKey="id"
        canDelete
        fields={[
          { key: "name", label: "ชื่อ", type: "text" },
          { key: "description", label: "รายละเอียด", type: "text" },
          { key: "cost_credits", label: "แต้มที่ใช้", type: "number" },
          { key: "active", label: "สถานะ", type: "bool" },
        ]}
        addTemplate={{ name: "", description: "", cost_credits: 0, active: true }}
      />

      <Section
        title="D · แพ็กเครดิต"
        hint="จ่ายเงิน → ได้เครดิต"
        endpoint="/api/admin/catalog/packs"
        idKey="id"
        canDelete
        fields={[
          { key: "id", label: "รหัส", type: "text" },
          { key: "name", label: "ชื่อ", type: "text" },
          { key: "credit_amount", label: "เครดิตที่ได้", type: "number" },
          { key: "price_cents", label: "ราคา(สตางค์)", type: "number" },
          { key: "active", label: "สถานะ", type: "bool" },
        ]}
        addTemplate={{ id: "", name: "", credit_amount: 0, price_cents: 0, active: true }}
      />
    </div>
  );
}
