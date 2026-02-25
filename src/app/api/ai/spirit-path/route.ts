import { NextResponse } from "next/server";
import { getCardById } from "@/lib/tarot/deck";
import { buildSpiritPathPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

function normalizeMarkdown(value: unknown): string {
  if (typeof value !== "string") return "";
  const text = value.replace(/\r\n/g, "\n").trim();
  return text;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });

    const body = (await req.json()) as {
      zodiacCardName?: string;
      soulCardName?: string;
      zodiacCardId?: string;
      soulCardId?: string;
      day?: number;
      month?: number;
      year?: number;
    };

    const zodiacCard = body.zodiacCardId ? getCardById(body.zodiacCardId) : null;
    const soulCard = body.soulCardId ? getCardById(body.soulCardId) : null;

    const zodiacCardName = body.zodiacCardName || zodiacCard?.nameTh || zodiacCard?.name;
    const soulCardName = body.soulCardName || soulCard?.nameTh || soulCard?.name;

    if (!zodiacCardName || !soulCardName) {
      return NextResponse.json({ error: "missing_cards" }, { status: 400 });
    }

    const basePrompt = buildSpiritPathPrompt({
      zodiacCardName,
      soulCardName,
      zodiacCardMeaning: zodiacCard?.meaningUpright,
      soulCardMeaning: soulCard?.meaningUpright,
      day: Number(body.day ?? 0),
      month: Number(body.month ?? 0),
      year: Number(body.year ?? 0),
    });

    const rag = retrieveRag({
      query: `${zodiacCardName}\n${soulCardName}`,
      systemId: "tarot_th",
      limit: 6,
    });

    const prompt = basePrompt + formatRagContext(rag.chunks);

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!resp.ok) return NextResponse.json({ error: "gemini_request_failed" }, { status: 502 });
    const data = await resp.json();

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    let markdown = "";
    
    try {
      const parsed = JSON.parse(raw);
      markdown = [
        parsed.summary,
        ...(parsed.sections || []).map((s: any) => `#### ${s.title}\n\n${s.content}`),
        `#### จุดแข็งที่ใช้ได้ทันที\n\n${(parsed.highlights?.strengths || []).map((t: string) => `- ${t}`).join('\n')}`,
        `#### จุดที่ควรระวัง/กับดัก\n\n${(parsed.highlights?.risks || []).map((t: string) => `- ${t}`).join('\n')}`,
        `#### แผนปฏิบัติ 7 วัน\n\n${(parsed.highlights?.action_plan || []).map((t: string) => `- ${t}`).join('\n')}`,
        `#### คำถามสะท้อนตัวเอง (Journaling)\n\n${parsed.journal_question || ""}`
      ].join('\n\n');
    } catch (e) {
      markdown = normalizeMarkdown(raw);
    }

    if (!markdown) {
      return NextResponse.json({ ok: true, markdown: "#### ภาพรวมพลังงานของเส้นทางนี้\n\nยังไม่สามารถสร้างคำทำนายได้ในขณะนี้ ลองใหม่อีกครั้งนะคะ/ครับ" });
    }

    return NextResponse.json({ ok: true, markdown });
  } catch (e) {
    return NextResponse.json(
      { error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
