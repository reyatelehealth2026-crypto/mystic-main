import type { InterpretationBlock } from "@/lib/reading/types";

function blockStyle(block: InterpretationBlock): string {
  if (block.type === "warning" || block.emphasis === "caution") {
    return "border-rose-300/30 bg-rose-400/10";
  }

  if (block.type === "summary" || block.emphasis === "positive") {
    return "border-emerald-300/20 bg-emerald-400/10";
  }

  return "border-border bg-surface";
}

export function ReadingBlocks({ blocks }: { blocks: InterpretationBlock[] }) {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2">
      {blocks.map((block) => (
        <article key={block.id} className={`rounded-2xl border p-5 ${blockStyle(block)}`}>
          <h2 className="text-base font-semibold text-fg">{block.title}</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-fg-muted">{block.body}</p>
          {block.meta ? <p className="mt-3 text-xs text-fg-subtle">{block.meta}</p> : null}
        </article>
      ))}
    </section>
  );
}
