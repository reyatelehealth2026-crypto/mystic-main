import type { Metadata } from "next";
import Link from "next/link";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

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
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar
          title="ห้องสมุดไพ่"
          className="px-0 pt-0 pb-0"
          right={
            <Link
              href="/library/saved"
              className="rounded-xl px-4 py-1.5 text-xs font-semibold bg-accent/10 text-accent transition"
            >
              คลังของฉัน
            </Link>
          }
        />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ห้องสมุดไพ่ 78 ใบ</h1>
        <p className="mt-1 text-sm text-fg-muted">ค้นหาความหมายไพ่แต่ละใบแบบรวดเร็ว พร้อมแนวทางเชิงปฏิบัติ</p>
      </header>

      <div className="px-5 pb-6">
        <div className="grid gap-3 grid-cols-2">
          {TAROT_DECK.map((card) => (
            <Link
              key={card.id}
              href={`/library/${card.id}`}
              className="rounded-2xl border border-border bg-surface p-4 transition hover:bg-bg-elevated"
            >
              <p className="text-xs font-medium text-fg-subtle">{card.id}</p>
              <h2 className="mt-1 text-sm font-semibold text-fg">{card.name}</h2>
              <p className="mt-1 text-xs text-fg-subtle">
                {card.arcana === "major" ? "Major Arcana" : `Minor Arcana • ${card.suit}`}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{card.meaningUpright}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      <FAB />
    </main>
  );
}
