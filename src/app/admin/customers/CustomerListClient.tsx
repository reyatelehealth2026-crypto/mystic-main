"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

interface Customer {
  id: string;
  line_user_id: string;
  display_name: string | null;
  picture_url: string | null;
  credits: number;
  membership_tier: string;
  created_at: string;
  last_login_at: string | null;
}

export function CustomerListClient() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async (search: string, pg: number) => {
    setLoading(true);
    try {
      const url = `/api/admin/customers?q=${encodeURIComponent(search)}&page=${pg}`;
      const resp = await fetch(url, { cache: "no-store" });
      const data = await resp.json();
      if (data.ok) {
        setCustomers(data.customers);
        setTotal(data.total);
        setPage(data.page);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load("", 0);
  }, [load]);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-bold text-fg">ลูกค้า (CRM)</h1>
      <p className="mt-1 text-sm text-fg-muted">ลูกค้าทั้งหมด {total} ราย</p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void load(q, 0);
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อ หรือ LINE user ID"
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          <Search className="size-4" /> ค้นหา
        </Button>
      </form>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated text-left text-xs text-fg-muted">
            <tr>
              <th className="px-4 py-3">ลูกค้า</th>
              <th className="px-4 py-3 text-center">เครดิต</th>
              <th className="px-4 py-3 text-center">ระดับ</th>
              <th className="px-4 py-3">เข้าระบบล่าสุด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-fg-muted">
                  กำลังโหลด…
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-fg-muted">
                  ไม่พบลูกค้า
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-bg-elevated/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                      {c.picture_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.picture_url} alt="" className="size-8 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-xs">
                          {(c.display_name ?? "?").slice(0, 1)}
                        </span>
                      )}
                      <span className="font-medium text-fg underline-offset-2 hover:underline">
                        {c.display_name ?? "ไม่ระบุชื่อ"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{c.credits}</td>
                  <td className="px-4 py-3 text-center">{c.membership_tier}</td>
                  <td className="px-4 py-3 text-xs text-fg-muted">
                    {c.last_login_at ? new Date(c.last_login_at).toLocaleString("th-TH") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" disabled={page <= 0} onClick={() => void load(q, page - 1)}>
          ก่อนหน้า
        </Button>
        <span className="text-xs text-fg-muted">
          หน้า {page + 1} / {totalPages}
        </span>
        <Button variant="ghost" size="sm" disabled={page + 1 >= totalPages} onClick={() => void load(q, page + 1)}>
          ถัดไป
        </Button>
      </div>
    </div>
  );
}
