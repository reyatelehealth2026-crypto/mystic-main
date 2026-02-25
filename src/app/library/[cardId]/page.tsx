import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, TAROT_DECK } from "@/lib/tarot/deck";

export function generateStaticParams() {
  return TAROT_DECK.map((card) => ({ cardId: card.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const card = getCardById(cardId);
  if (!card) return {};
  const arcanaLabel = card.arcana === "major" ? "Major Arcana" : `Minor Arcana • ${card.suit}`;
  return {
    title: `${card.name} — ความหมายไพ่ทาโรต์ (${arcanaLabel})`,
    description: `ความหมายไพ่ ${card.name} ทั้งตั้งตรงและกลับหัว พร้อมคีย์เวิร์ดและแนวทางเชิงปฏิบัติ — REFFORTUNE`,
    alternates: { canonical: `/library/${cardId}` },
    openGraph: {
      title: `${card.name} — ไพ่ทาโรต์ REFFORTUNE`,
      description: `เรียนรู้ความหมายไพ่ ${card.name} (${arcanaLabel}) ทั้งด้านบวกและด้านท้าทาย`,
      url: `/library/${cardId}`,
    },
  };
}

export default async function TarotCardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = getCardById(cardId);

  if (!card) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      <Link
        href="/library"
        className="inline-flex items-center gap-1 text-sm transition"
        style={{ color: "var(--text-muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        ห้องสมุด
      </Link>

      <section className="mt-4 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--purple-500)" }}>{card.id}</p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>{card.name}</h1>
        {card.nameTh ? <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{card.nameTh}</p> : null}
        {card.image ? (
          <Image
            src={card.image}
            alt={card.name}
            width={360}
            height={540}
            className="mt-4 w-full max-w-xs rounded-2xl border object-cover"
            style={{ borderColor: "var(--border)" }}
          />
        ) : null}

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Arcana</p>
            <p className="mt-1 font-medium" style={{ color: "var(--text)" }}>{card.arcana}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Number</p>
            <p className="mt-1 font-medium" style={{ color: "var(--text)" }}>{card.number}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border-l-4 border p-4" style={{ borderColor: "var(--border)", borderLeftColor: "var(--success)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>ตั้งตรง</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{card.meaningUpright}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.keywordsUpright.map((kw) => (
                <span key={kw} className="rounded-xl px-2.5 py-0.5 text-xs" style={{ background: "rgba(34,197,94,0.08)", color: "var(--success)" }}>{kw}</span>
              ))}
            </div>
          </article>

          <article className="rounded-xl border-l-4 border p-4" style={{ borderColor: "var(--border)", borderLeftColor: "var(--rose)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>กลับหัว</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{card.meaningReversed}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.keywordsReversed.map((kw) => (
                <span key={kw} className="rounded-xl px-2.5 py-0.5 text-xs" style={{ background: "rgba(244,63,94,0.08)", color: "var(--rose)" }}>{kw}</span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
