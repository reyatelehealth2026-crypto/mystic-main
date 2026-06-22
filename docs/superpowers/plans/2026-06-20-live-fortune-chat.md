# Live Fortune Chat (ปรึกษาหมอดูสด) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a logged-in customer spend a flat credit cost to open a live consultation round with a human fortune teller; the chat happens in LINE OA, and the หมอดู closes rounds from an admin console.

**Architecture:** Next.js 16 (Vercel, serverless) + Supabase (Postgres, service-role, RLS deny-all). A new `consultations` table tracks rounds. Credits move via the existing atomic `apply_credit_delta` RPC. The หมอดู console polls (~5s) — no websockets/Realtime.

**Tech Stack:** TypeScript, Next.js App Router (route handlers + RSC), `@supabase/supabase-js` (PostgREST), Vitest.

## Global Constraints

- Server data access uses the **service-role** client `getServiceClient()` only; never the anon key. (`src/lib/supabase/server.ts`)
- All new tables: **RLS enabled, no policies** (deny-all). Service role bypasses RLS.
- Credit movement goes through `apply_credit_delta(p_user_id, p_delta, p_reason, p_reading_type?, p_order_id?)` — it inserts a `credit_transactions` ledger row and raises `insufficient_credits` if the balance would go negative.
- Auth helpers: `requireUser()` throws `UnauthorizedError`; `requireAdmin()` throws `UnauthorizedError`/`ForbiddenError` (allowlist `ADMIN_LINE_USER_IDS`).
- Route handlers set `export const dynamic = "force-dynamic";` and map `UnauthorizedError→401`, `ForbiddenError→403`.
- Tests are colocated `src/**/*.test.ts`, Vitest globals, `environment: 'node'`. Only pure logic is unit-tested in this repo.
- Flat cost constant default = **1** credit/round.

---

### Task 1: Migration — `consultations` table

**Files:**
- Create: `supabase/migrations/0002_consultations.sql`

**Interfaces:**
- Produces: table `public.consultations(id, user_id, credits_spent, status, opened_at, closed_at, closed_by)`.

- [ ] **Step 1: Create the migration file**

`supabase/migrations/0002_consultations.sql`:

```sql
-- REFFORTUNE — live consultation rounds (ปรึกษาหมอดูสด)
-- One row per paid round. Chat itself happens in LINE OA; this table only
-- tracks billing + open/closed lifecycle. RLS deny-all (service-role only).

create table if not exists public.consultations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  credits_spent integer not null,
  status        text not null default 'open',   -- 'open' | 'closed'
  opened_at     timestamptz not null default now(),
  closed_at     timestamptz,
  closed_by     text                            -- line_user_id of the หมอดู who closed
);

create index if not exists consultations_status_idx
  on public.consultations (status, opened_at);

alter table public.consultations enable row level security;
-- deny-all: intentionally no policies.
```

- [ ] **Step 2: Apply to Supabase**

Reuse the IPv6 `pg` approach used for `0001`. Write a throwaway script `_tmp_migrate2.mjs` in the project root that reads `0002_consultations.sql` and runs it against the DB (host `db.uropawafseaqnwszazsg.supabase.co:5432`, user `postgres`, the DB password, `ssl: { rejectUnauthorized: false }`). Run `node _tmp_migrate2.mjs`. **Applying to the production DB needs the user's explicit go-ahead** (the auto-classifier gates it).

Expected: prints the `consultations` table exists. Then `rm -f _tmp_migrate2.mjs`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0002_consultations.sql
git commit -m "feat(db): consultations table for live fortune chat"
```

---

### Task 2: Pure consultation policy + tests

**Files:**
- Create: `src/lib/consultation/policy.ts`
- Test: `src/lib/consultation/policy.test.ts`

**Interfaces:**
- Produces: `CONSULTATION_CREDIT_COST: number`; `decideConsultationStart({ hasOpenRound, currentCredits, cost? }): ConsultationStartDecision` where `ConsultationStartDecision = { action: "reuse" } | { action: "charge"; cost: number } | { action: "insufficient"; requiredCredits: number; currentCredits: number }`.

- [ ] **Step 1: Write the failing test**

`src/lib/consultation/policy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { CONSULTATION_CREDIT_COST, decideConsultationStart } from "./policy";

describe("decideConsultationStart", () => {
  it("reuses an existing open round without charging", () => {
    expect(decideConsultationStart({ hasOpenRound: true, currentCredits: 0 })).toEqual({
      action: "reuse",
    });
  });

  it("charges when no open round and enough credits", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 5 })).toEqual({
      action: "charge",
      cost: CONSULTATION_CREDIT_COST,
    });
  });

  it("blocks when credits are below cost", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 0 })).toEqual({
      action: "insufficient",
      requiredCredits: CONSULTATION_CREDIT_COST,
      currentCredits: 0,
    });
  });

  it("honors a custom cost", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 2, cost: 3 })).toEqual({
      action: "insufficient",
      requiredCredits: 3,
      currentCredits: 2,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/consultation/policy.test.ts`
Expected: FAIL — cannot find module `./policy`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/consultation/policy.ts`:

```ts
/**
 * Pure decision logic for opening a live consultation round. No DB/IO so it is
 * unit-testable and shared by the route handler.
 */
export const CONSULTATION_CREDIT_COST = 1;

export type ConsultationStartDecision =
  | { action: "reuse" }
  | { action: "charge"; cost: number }
  | { action: "insufficient"; requiredCredits: number; currentCredits: number };

export function decideConsultationStart(params: {
  hasOpenRound: boolean;
  currentCredits: number;
  cost?: number;
}): ConsultationStartDecision {
  const cost = params.cost ?? CONSULTATION_CREDIT_COST;
  if (params.hasOpenRound) return { action: "reuse" };
  if (params.currentCredits < cost) {
    return { action: "insufficient", requiredCredits: cost, currentCredits: params.currentCredits };
  }
  return { action: "charge", cost };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/consultation/policy.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/consultation/policy.ts src/lib/consultation/policy.test.ts
git commit -m "feat(consult): pure start-decision policy + tests"
```

---

### Task 3: Types + DB layer

**Files:**
- Modify: `src/lib/supabase/types.ts` (append `ConsultationRow`)
- Create: `src/lib/supabase/consultations.ts`

**Interfaces:**
- Consumes: `getServiceClient()`, `apply_credit_delta` RPC.
- Produces:
  - `ConsultationRow { id; user_id; credits_spent; status: "open"|"closed"; opened_at; closed_at: string|null; closed_by: string|null }`
  - `getOpenConsultationForUser(userId: string): Promise<ConsultationRow | null>`
  - `openConsultation(userId: string, cost: number): Promise<ConsultationRow>`
  - `OpenConsultationView { id; credits_spent; opened_at; user: { id; display_name: string|null; line_user_id: string; picture_url: string|null } }`
  - `listOpenConsultations(): Promise<OpenConsultationView[]>`
  - `closeConsultation(id: string, closedByLineId: string): Promise<ConsultationRow | null>`

- [ ] **Step 1: Append the row type**

Append to `src/lib/supabase/types.ts`:

```ts
export interface ConsultationRow {
  id: string;
  user_id: string;
  credits_spent: number;
  status: "open" | "closed";
  opened_at: string;
  closed_at: string | null;
  closed_by: string | null;
}
```

- [ ] **Step 2: Create the DB layer**

`src/lib/supabase/consultations.ts`:

```ts
import { getServiceClient } from "@/lib/supabase/server";
import type { ConsultationRow } from "@/lib/supabase/types";

export async function getOpenConsultationForUser(userId: string): Promise<ConsultationRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as ConsultationRow) ?? null;
}

export async function openConsultation(userId: string, cost: number): Promise<ConsultationRow> {
  const db = getServiceClient();
  // Atomic deduct first; raises 'insufficient_credits' if balance would go negative.
  const { error: rpcError } = await db.rpc("apply_credit_delta", {
    p_user_id: userId,
    p_delta: -cost,
    p_reason: "consultation_spend",
  });
  if (rpcError) throw rpcError;

  const { data, error } = await db
    .from("consultations")
    .insert({ user_id: userId, credits_spent: cost, status: "open" })
    .select("*")
    .single();
  if (error) throw error;
  return data as ConsultationRow;
}

export interface OpenConsultationView {
  id: string;
  credits_spent: number;
  opened_at: string;
  user: { id: string; display_name: string | null; line_user_id: string; picture_url: string | null };
}

export async function listOpenConsultations(): Promise<OpenConsultationView[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .select("id, credits_spent, opened_at, users:user_id (id, display_name, line_user_id, picture_url)")
    .eq("status", "open")
    .order("opened_at", { ascending: true });
  if (error) throw error;
  return ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r.id as string,
    credits_spent: r.credits_spent as number,
    opened_at: r.opened_at as string,
    user: r.users as OpenConsultationView["user"],
  }));
}

export async function closeConsultation(
  id: string,
  closedByLineId: string,
): Promise<ConsultationRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .update({ status: "closed", closed_at: new Date().toISOString(), closed_by: closedByLineId })
    .eq("id", id)
    .eq("status", "open")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as ConsultationRow) ?? null;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/types.ts src/lib/supabase/consultations.ts
git commit -m "feat(consult): consultations DB layer"
```

---

### Task 4: Customer API — `/api/consultation`

**Files:**
- Create: `src/app/api/consultation/route.ts`

**Interfaces:**
- Consumes: `requireUser`, `UnauthorizedError`, `decideConsultationStart`, `getOpenConsultationForUser`, `openConsultation`.
- Produces: `GET /api/consultation` → `{ ok, consultation: ConsultationRow|null }`; `POST /api/consultation` → `{ ok, reused, consultation }` | `402 { error:"insufficient_credits", requiredCredits, currentCredits }` | `401`.

- [ ] **Step 1: Create the route**

`src/app/api/consultation/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { decideConsultationStart } from "@/lib/consultation/policy";
import { getOpenConsultationForUser, openConsultation } from "@/lib/supabase/consultations";

export const dynamic = "force-dynamic";

/** Current open round for the logged-in user (no charge). */
export async function GET() {
  try {
    const user = await requireUser();
    const consultation = await getOpenConsultationForUser(user.id);
    return NextResponse.json({ ok: true, consultation });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "status_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

/** Open (and charge) a round, or return the existing open round unchanged. */
export async function POST() {
  try {
    const user = await requireUser();
    const existing = await getOpenConsultationForUser(user.id);
    const decision = decideConsultationStart({
      hasOpenRound: existing !== null,
      currentCredits: user.credits,
    });

    if (decision.action === "reuse") {
      return NextResponse.json({ ok: true, reused: true, consultation: existing });
    }
    if (decision.action === "insufficient") {
      return NextResponse.json(
        {
          error: "insufficient_credits",
          requiredCredits: decision.requiredCredits,
          currentCredits: decision.currentCredits,
        },
        { status: 402 },
      );
    }
    const consultation = await openConsultation(user.id, decision.cost);
    return NextResponse.json({ ok: true, reused: false, consultation });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "consultation_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` (expected: no new errors).

```bash
git add src/app/api/consultation/route.ts
git commit -m "feat(consult): customer start/status API"
```

---

### Task 5: Admin APIs — list + close

**Files:**
- Create: `src/app/api/admin/consultations/route.ts`
- Create: `src/app/api/admin/consultations/[id]/close/route.ts`

**Interfaces:**
- Consumes: `requireAdmin`, `ForbiddenError`, `UnauthorizedError`, `listOpenConsultations`, `closeConsultation`.
- Produces: `GET /api/admin/consultations` → `{ ok, consultations: OpenConsultationView[] }`; `POST /api/admin/consultations/[id]/close` → `{ ok, consultation }` | `404 { error:"not_open" }`.

- [ ] **Step 1: List route**

`src/app/api/admin/consultations/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { listOpenConsultations } from "@/lib/supabase/consultations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const consultations = await listOpenConsultations();
    return NextResponse.json({ ok: true, consultations });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "list_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Close route**

`src/app/api/admin/consultations/[id]/close/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { closeConsultation } from "@/lib/supabase/consultations";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;
    const closed = await closeConsultation(id, admin.line_user_id);
    if (!closed) return NextResponse.json({ error: "not_open" }, { status: 404 });
    return NextResponse.json({ ok: true, consultation: closed });
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json(
      { error: "close_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` (expected: no new errors).

```bash
git add src/app/api/admin/consultations
git commit -m "feat(consult): admin list + close APIs"
```

---

### Task 6: หมอดู Console page

**Files:**
- Create: `src/app/admin/consultations/page.tsx`
- Create: `src/app/admin/consultations/ConsultationsClient.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/consultations`, `POST /api/admin/consultations/[id]/close`, `requireAdmin`.

- [ ] **Step 1: Server page (admin gate + render client)**

`src/app/admin/consultations/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { ConsultationsClient } from "./ConsultationsClient";

export const dynamic = "force-dynamic";

export default async function ConsultationsPage() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) redirect("/login?returnTo=/admin/consultations");
    if (err instanceof ForbiddenError) redirect("/");
    throw err;
  }
  return <ConsultationsClient />;
}
```

- [ ] **Step 2: Client (poll + close)**

`src/app/admin/consultations/ConsultationsClient.tsx`:

```tsx
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
```

> If `@/components/ui/Card` does not export `CardDesc`/`CardTitle` with these names, check `src/components/ui/Card.tsx` and match the exact exports used by `src/app/profile/ProfileClient.tsx` (it imports `Card`, `CardTitle`, `CardDesc`). Use `text-muted-foreground` only if present in the codebase; otherwise drop the class.

- [ ] **Step 3: Build + commit**

Run: `npx tsc --noEmit` then `npm run build` (expected: compiles, `/admin/consultations` route listed).

```bash
git add src/app/admin/consultations
git commit -m "feat(consult): หมอดู console page"
```

---

### Task 7: Customer page `/consult` + profile links + OA env

**Files:**
- Create: `src/app/consult/page.tsx`
- Create: `src/app/consult/ConsultClient.tsx`
- Modify: `src/app/profile/ProfileClient.tsx` (add links in the account button row)
- Modify: `.env.local` (add `NEXT_PUBLIC_LINE_OA_ID`)

**Interfaces:**
- Consumes: `useAuth()`, `GET/POST /api/consultation`, env `NEXT_PUBLIC_LINE_OA_ID`.

- [ ] **Step 1: Server page**

`src/app/consult/page.tsx`:

```tsx
import * as React from "react";
import type { Metadata } from "next";
import { ConsultClient } from "./ConsultClient";

export const metadata: Metadata = { title: "ปรึกษาหมอดูสด" };

export default function ConsultPage() {
  return (
    <React.Suspense fallback={null}>
      <ConsultClient />
    </React.Suspense>
  );
}
```

- [ ] **Step 2: Client**

`src/app/consult/ConsultClient.tsx`:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
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
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/consultation", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setHasOpen(true);
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
```

- [ ] **Step 3: Add links in ProfileClient**

In `src/app/profile/ProfileClient.tsx`, inside the logged-in account button row, add a customer link before "เติมเครดิต" and an admin link after the CRM link. Replace:

```tsx
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/pricing">
                  <Button variant="secondary" size="default">
                    {language === "th" ? "เติมเครดิต" : "Top up credits"}
                  </Button>
                </Link>
                {user.isAdmin ? (
                  <Link href="/admin/customers">
                    <Button variant="ghost" size="default">
                      {language === "th" ? "ลูกค้า (CRM)" : "Customers (CRM)"}
                    </Button>
                  </Link>
                ) : null}
```

with:

```tsx
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/consult">
                  <Button variant="default" size="default">
                    {language === "th" ? "ปรึกษาหมอดูสด" : "Live consult"}
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="secondary" size="default">
                    {language === "th" ? "เติมเครดิต" : "Top up credits"}
                  </Button>
                </Link>
                {user.isAdmin ? (
                  <Link href="/admin/customers">
                    <Button variant="ghost" size="default">
                      {language === "th" ? "ลูกค้า (CRM)" : "Customers (CRM)"}
                    </Button>
                  </Link>
                ) : null}
                {user.isAdmin ? (
                  <Link href="/admin/consultations">
                    <Button variant="ghost" size="default">
                      {language === "th" ? "คิวหมอดู" : "Consult queue"}
                    </Button>
                  </Link>
                ) : null}
```

- [ ] **Step 4: Add OA env (local + Vercel)**

Append to `.env.local`:

```env
# LINE OA basic id for the add-friend / open-chat link (e.g. @abc1234)
NEXT_PUBLIC_LINE_OA_ID=
```

Set on Vercel (production) once the real `@id` is known:

```bash
printf '%s' '@your_oa_id' | vercel env add NEXT_PUBLIC_LINE_OA_ID production --scope suti --token "$VERCEL_TOKEN"
```

- [ ] **Step 5: Build + commit**

Run: `npx tsc --noEmit` then `npm run build` (expected: compiles; `/consult` route listed).

```bash
git add src/app/consult src/app/profile/ProfileClient.tsx
git commit -m "feat(consult): customer consult page + profile links"
```

---

### Task 8: Full verification + deploy

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (existing 13 + 4 new policy tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: success; routes `/consult`, `/admin/consultations`, `/api/consultation`, `/api/admin/consultations`, `/api/admin/consultations/[id]/close` all present.

- [ ] **Step 3: Deploy (needs user go-ahead)**

```bash
vercel deploy --prod --yes --scope suti --token "$VERCEL_TOKEN"
```

- [ ] **Step 4: Smoke test**

- Logged-in customer at `/consult` with ≥1 credit → "ปรึกษาหมอดูสด" → round opens, credits drop by 1, button switches to "เปิดแชทกับหมอดูใน LINE".
- Tap again → no double charge (reuse).
- Admin at `/admin/consultations` → sees the open round → "ปิดรอบ" → row disappears within ~5s.

## Self-Review

- **Spec coverage:** consultations table (T1), flat cost constant (T2), credit deduction via `apply_credit_delta` (T3), open/reuse/insufficient (T2+T4), admin close (T5), console (T6), customer UI + OA link + add-friend (T7), no-push Phase-1 (omitted by design), tests (T2) + verification (T8). LINE same-provider push is Phase 2 (out of scope) — noted, not built.
- **Placeholder scan:** none — every step has concrete code/commands.
- **Type consistency:** `ConsultationRow`, `OpenConsultationView`, `ConsultationStartDecision`, `decideConsultationStart`, `getOpenConsultationForUser`, `openConsultation`, `listOpenConsultations`, `closeConsultation` are used with identical signatures across tasks.
