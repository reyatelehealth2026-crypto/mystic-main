import type { Metadata } from "next";
import Link from "next/link";
import { TAROT_DECK } from "@/lib/tarot/deck";

export const metadata: Metadata = {
  title: "ห้องสมุดไพ่ทาโรต์ 78 ใบ — ความหมายครบทุกใบ",
  description:
    "ค้นหาความหมายไพ่ทาโรต์ทั้ง 78 ใบ Major & Minor Arcana พร้อมคีย์เวิร์ดตั้งตรงและกลับหัว แนวทางเชิงปฏิบัติ เข้าใจง่าย",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "ห้องสมุดไพ่ทาโรต์ 78 ใบ — REFFORTUNE",
    description: "ค้นหาความหมายไพ่ทาโรต์ทุกใบ พร้อมแนวทางเชิงปฏิบัติ",
    url: "/library",
  },
};

export default function TarotLibraryPage() {
  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>ห้องสมุดไพ่ 78 ใบ</h1>
        <Link
          href="/library/saved"
          className="rounded-xl px-4 py-1.5 text-xs font-semibold transition"
          style={{ background: "var(--purple-100)", color: "var(--purple-600)" }}
        >
          คลังของฉัน
        </Link>
      </div>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>ค้นหาความหมายไพ่แต่ละใบแบบรวดเร็ว พร้อมแนวทางเชิงปฏิบัติ</p>

      <div className="mt-5 grid gap-3 grid-cols-2">
        {TAROT_DECK.map((card) => (
          <Link
            key={card.id}
            href={`/library/${card.id}`}
            className="rounded-2xl border p-4 transition hover:bg-surface"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>{card.id}</p>
            <h2 className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>{card.name}</h2>
            <p className="mt-1 text-xs text-fg-subtle">
              {card.arcana === "major" ? "Major Arcana" : `Minor Arcana • ${card.suit}`}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{card.meaningUpright}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
