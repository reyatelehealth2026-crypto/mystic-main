import fs from "node:fs";
import path from "node:path";

export type RagDocKind = "kb" | "example" | "glossary" | "schema";

export type RagChunk = {
  id: string;
  kind: RagDocKind;
  systemId?: string;
  intents?: string[];
  title: string;
  headingPath: string[];
  text: string;
  source: string;
};

// Use process.cwd() to resolve docs relative to project root in deployment (Next.js)
const DOCS_DIR = path.join(process.cwd(), "public/docs");

const FILES = {
  kb: "mysticg_divination_KB_full_th.md",
  taxonomy: "mysticg_divination_taxonomy_th.md",
  glossary: "mysticg_divination_glossary_th.json",
  examples: "mysticg_examples_pack_th.md",
  schema: "mysticg_divination_dataset_schema_full_th.json",
  kb_complete: "mysticflow-knowledge-complete.md",
  handbook: "mystical-knowledge-handbook.md",
  summary: "mysticflow_ai_knowledge_summary_th.md",
  esiimsi: "esiimsi_knowledge_th.md",
} as const;

// Lightweight, dependency-free retrieval for prototype (lexical scoring).
// This is intentionally simple so it runs anywhere.

let cachedChunks: RagChunk[] | null = null;

function readText(fileName: string): string {
  const fullPath = path.join(DOCS_DIR, fileName);
  if (!fs.existsSync(fullPath)) {
    console.warn(`RAG file not found: ${fileName}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  const n = normalize(s);
  // Thai tokenization is non-trivial; we do a pragmatic split.
  // Keep alphanumerics + Thai chars; split on whitespace.
  return n
    .replace(/[^0-9a-z\u0E00-\u0E7F\s]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 64);
}

function guessSystemIdFromHeadingPath(headingPath: string[]): string | undefined {
  const joined = headingPath.join(" / ").toLowerCase();
  if (joined.includes("ไพ่") || joined.includes("tarot")) return "tarot_th";
  if (joined.includes("เลขศาสตร์") || joined.includes("numerology")) return "numerology_th";
  if (joined.includes("โหราศาสตร์ไทย") || joined.includes("thai astrology")) return "thai_astrology";
  if (joined.includes("ฮวงจุ้ย") || joined.includes("feng")) return "fengshui";
  if (joined.includes("นักษัตร") || joined.includes("chinese zodiac")) return "chinese_zodiac";
  if (joined.includes("ลายมือ")) return "palmistry";
  if (joined.includes("โหงวเฮ้ง")) return "physiognomy";
  if (joined.includes("เซียมซี") || joined.includes("esiimsi")) return "esiimsi";
  return undefined;
}

export function guessIntentsFromText(text: string): string[] {
  const t = normalize(text);
  const intents: string[] = [];
  if (/(งาน|อาชีพ|โปรเจค|หัวหน้า|ทีม|เลื่อนตำแหน่ง)/.test(t)) intents.push("work");
  if (/(รัก|ความสัมพันธ์|แฟน|คนคุย|คู่)/.test(t)) intents.push("love");
  if (/(เงิน|รายได้|หนี้|ลงทุน|โชคลาภ)/.test(t)) intents.push("money");
  if (/(เข้ากัน|คู่แท้|match|compat)/.test(t)) intents.push("matching");
  if (/(เวลา|ช่วง|เดือนไหน|สัปดาห์|รายวัน|รายเดือน|ฤกษ์)/.test(t)) intents.push("timing");
  return Array.from(new Set(intents));
}

function chunkMarkdown(md: string, source: string, kind: RagDocKind): RagChunk[] {
  if (!md) return [];
  const lines = md.split(/\r?\n/);
  const chunks: RagChunk[] = [];

  let headingPath: string[] = [];
  let buf: string[] = [];
  let currentTitle = "";

  function flush() {
    const text = buf.join("\n").trim();
    if (!text) return;
    const title = currentTitle || headingPath[headingPath.length - 1] || source;
    const id = `${kind}:${source}:${chunks.length}`;
    const systemId = guessSystemIdFromHeadingPath(headingPath);
    const intents = guessIntentsFromText(title + "\n" + text);

    chunks.push({
      id,
      kind,
      systemId,
      intents,
      title,
      headingPath: [...headingPath],
      text,
      source,
    });
  }

  for (const line of lines) {
    const m = /^(#{2,4})\s+(.*)$/.exec(line);
    if (m) {
      // flush previous section
      flush();
      buf = [];

      const level = m[1].length; // 2..4
      const title = m[2].trim();

      // Maintain heading path
      // We treat ## as level 2, ### level 3, #### level 4
      const idx = level - 2;
      headingPath = headingPath.slice(0, idx);
      headingPath[idx] = title;
      currentTitle = title;
      continue;
    }

    buf.push(line);
  }

  flush();
  return chunks;
}

function chunkExamples(md: string, source: string): RagChunk[] {
  // Examples pack is structured with headings like:
  // ## 1) Work — Tarot (3-card)
  // **Q:** ...
  // **A:** ...
  // We'll chunk per "##" heading to keep each example self-contained.
  return chunkMarkdown(md, source, "example");
}

export function loadRagChunks(): RagChunk[] {
  if (cachedChunks) return cachedChunks;

  const kb = readText(FILES.kb);
  const examples = readText(FILES.examples);
  const kbComplete = readText(FILES.kb_complete);
  const handbook = readText(FILES.handbook);
  const summary = readText(FILES.summary);
  const esiimsi = readText(FILES.esiimsi);

  const chunks = [
    ...chunkMarkdown(kb, FILES.kb, "kb"),
    ...chunkMarkdown(kbComplete, FILES.kb_complete, "kb"),
    ...chunkMarkdown(handbook, FILES.handbook, "kb"),
    ...chunkMarkdown(summary, FILES.summary, "kb"),
    ...chunkMarkdown(esiimsi, FILES.esiimsi, "kb"),
    ...chunkExamples(examples, FILES.examples),
  ];

  cachedChunks = chunks;
  return chunks;
}

export type RetrieveParams = {
  query: string;
  systemId?: string;
  intent?: string;
  limit?: number;
};

export type RetrieveResult = {
  chunks: Array<RagChunk & { score: number }>;
};

export function retrieveRag({ query, systemId, intent, limit = 6 }: RetrieveParams): RetrieveResult {
  const chunks = loadRagChunks();
  const qTokens = tokenize(query);
  const qNorm = normalize(query);

  const scored = chunks
    .map((c) => {
      const textNorm = normalize(c.title + "\n" + c.text);
      let score = 0;

      // Token overlap scoring
      for (const tok of qTokens) {
        if (tok.length < 2) continue;
        if (textNorm.includes(tok)) score += 2;
      }

      // Phrase bonus
      if (qNorm.length >= 6 && textNorm.includes(qNorm)) score += 6;

      // Filter boosts
      if (systemId && c.systemId === systemId) score += 6;
      if (intent && c.intents?.includes(intent)) score += 4;

      // Prefer KB over examples for grounding (still keep examples)
      if (c.kind === "kb") score += 1;

      return { ...c, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return { chunks: scored };
}

export function formatRagContext(chunks: Array<RagChunk & { score: number }>): string {
  if (!chunks.length) return "";
  const parts = chunks.map((c, i) => {
    const meta = [
      c.kind,
      c.systemId ? `system_id=${c.systemId}` : null,
      c.intents?.length ? `intents=${c.intents.join(",")}` : null,
      c.source,
    ]
      .filter(Boolean)
      .join(" | ");

    return `[#${i + 1}] ${c.title}\n(${meta})\n${c.text}`;
  });

  return `\n\n<knowledge_base>\n${parts.join("\n\n---\n\n")}\n</knowledge_base>\n`;
}
