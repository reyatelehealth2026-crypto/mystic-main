"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

interface Membership {
  memberNo: number | null;
  displayName: string | null;
  pictureUrl: string | null;
  credits: number;
  tier: string;
  nextTier: string | null;
  lifetime: number;
  toNext: number;
  progressPct: number;
  subscription: { planName: string; quota: number; remaining: number; periodEnd: string } | null;
}

function formatMemberNo(no: number | null): string {
  return no == null ? "—" : String(no).padStart(6, "0");
}

export function MembershipCard() {
  const { user, loading, login } = useAuth();
  const [data, setData] = React.useState<Membership | null>(null);
  const [history, setHistory] = React.useState<
    Array<{ id: string; type: string; summary: string | null; created_at: string }>
  >([]);

  React.useEffect(() => {
    if (!user) return;
    fetch("/api/membership", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setData(d as Membership);
      })
      .catch(() => {});
    fetch("/api/history", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setHistory((d.history ?? []).slice(0, 6));
      })
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-sm text-fg-muted">เข้าสู่ระบบเพื่อดูบัตรสมาชิกของคุณ</p>
        <Button
          className="mt-4 bg-[#06C755] text-white hover:bg-[#05b34c]"
          onClick={login}
          disabled={loading}
        >
          เข้าสู่ระบบด้วย LINE
        </Button>
      </div>
    );
  }

  const m = data;

  return (
    <div className="px-4 py-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-5 text-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-emerald-100/90">
            REFFORTUNE · <span className="uppercase">{m?.tier ?? "MEMBER"}</span>
          </p>
          <span className="grid size-9 place-items-center rounded-xl bg-white/15 text-lg backdrop-blur">
            💎
          </span>
        </div>

        {/* identity */}
        <div className="mt-4 flex items-center gap-3">
          {m?.pictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.pictureUrl} alt="" className="size-14 rounded-2xl object-cover ring-2 ring-white/30" />
          ) : (
            <span className="grid size-14 place-items-center rounded-2xl bg-white/15 text-xl">
              {(m?.displayName ?? user.displayName ?? "?").slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold">{m?.displayName ?? user.displayName ?? "สมาชิก"}</p>
            <p className="text-xs text-emerald-100/80">ID {formatMemberNo(m?.memberNo ?? null)}</p>
          </div>
        </div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-emerald-100/80">แต้มสะสม</p>
            <p className="mt-1 text-3xl font-extrabold">{m?.credits ?? user.credits}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-emerald-100/80">สะสมรวม</p>
            <p className="mt-1 text-3xl font-extrabold">{m?.lifetime ?? "—"}</p>
          </div>
        </div>

        {/* progress */}
        <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
          {m?.nextTier ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-100/90">ไปยัง {m.nextTier}</span>
                <span className="font-semibold">{m.progressPct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-emerald-300"
                  style={{ width: `${m.progressPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-emerald-100/80">
                แค่อีก {m.toNext} แต้ม → {m.nextTier}
              </p>
            </>
          ) : (
            <p className="text-xs text-emerald-100/90">🏆 คุณอยู่ระดับสูงสุดแล้ว</p>
          )}
        </div>
      </div>

      {/* subscription quota */}
      {m?.subscription ? (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-700">{m.subscription.planName}</p>
          <p className="mt-1 text-sm text-emerald-900">
            เหลือ <span className="text-lg font-bold">{m.subscription.remaining}</span> / {m.subscription.quota} ครั้งเดือนนี้
          </p>
        </div>
      ) : (
        <Link href="/packages" className="mt-3 block">
          <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center text-sm text-emerald-700">
            ✨ สมัครแพ็กรายเดือน ดูดวงได้คุ้มกว่า →
          </div>
        </Link>
      )}

      {/* actions */}
      <div className="mt-4 flex gap-3">
        <Link href="/pricing" className="flex-1">
          <Button variant="secondary" className="w-full">
            เติมแต้ม
          </Button>
        </Link>
        <Link href="/rewards" className="flex-1">
          <Button className="w-full bg-[#06C755] text-white hover:bg-[#05b34c]">🎁 แลกของรางวัล</Button>
        </Link>
      </div>

      {/* reading history */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-fg">ประวัติการดูดวง</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-xs text-fg-muted">ยังไม่มีประวัติ — เริ่มดูดวงเลย</p>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-2xl border border-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg">{READING_LABELS[h.type] ?? h.type}</p>
                  {h.summary ? <p className="truncate text-xs text-fg-muted">{h.summary}</p> : null}
                </div>
                <span className="shrink-0 text-[11px] text-fg-subtle">
                  {new Date(h.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const READING_LABELS: Record<string, string> = {
  tarot: "ไพ่ทาโรต์",
  "love-tarot": "ทาโรต์ความรัก",
  "spirit-card": "ไพ่จิตวิญญาณ",
  "daily-card": "ไพ่รายวัน",
  numerology: "เลขศาสตร์",
  horoscope: "ดวงชะตา",
  compatibility: "ความเข้ากัน",
  chinese_zodiac: "ปีจีน",
  name_numerology: "เลขศาสตร์ชื่อ",
};
