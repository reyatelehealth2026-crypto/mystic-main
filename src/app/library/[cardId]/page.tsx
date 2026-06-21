import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCardById, TAROT_DECK } from "@/lib/tarot/deck";
import { AppBar } from "@/components/nav/AppBar";

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
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ห้องสมุดไพ่" className="px-0 pt-0 pb-0" backHref="/library" />
      </header>

      <div className="px-5 pb-6">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-medium text-accent">{card.id}</p>
          <h1 className="mt-2 text-2xl font-bold text-fg">{card.name}</h1>
          {card.nameTh ? <p className="mt-1 text-sm text-fg-muted">{card.nameTh}</p> : null}
          {card.image ? (
            <Image
              src={card.image}
              alt={card.name}
              width={360}
              height={540}
              className="mt-4 w-full max-w-xs rounded-2xl border border-border object-cover"
            />
          ) : null}

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-medium text-fg-subtle">Arcana</p>
              <p className="mt-1 font-medium text-fg">{card.arcana}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-medium text-fg-subtle">Number</p>
              <p className="mt-1 font-medium text-fg">{card.number}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-border border-l-4 border-l-green-500 p-4">
              <h2 className="text-sm font-bold text-fg">ตั้งตรง</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{card.meaningUpright}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.keywordsUpright.map((kw) => (
                  <span key={kw} className="rounded-xl px-2.5 py-0.5 text-xs bg-green-500/10 text-green-700">{kw}</span>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-border border-l-4 border-l-rose-500 p-4">
              <h2 className="text-sm font-bold text-fg">กลับหัว</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{card.meaningReversed}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.keywordsReversed.map((kw) => (
                  <span key={kw} className="rounded-xl px-2.5 py-0.5 text-xs bg-rose-500/10 text-rose-600">{kw}</span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
