import type { InterpretationBlock, ReadingBlockType } from "./types";

export function createBlock(input: {
  id: string;
  type: ReadingBlockType;
  title: string;
  body: string;
  emphasis?: InterpretationBlock["emphasis"];
  meta?: string;
}): InterpretationBlock {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    body: input.body,
    emphasis: input.emphasis ?? "neutral",
    meta: input.meta,
  };
}

export function pickTopKeywords(keywords: string[], count = 3): string {
  return keywords.slice(0, count).join(" • ");
}
