import { NextResponse } from "next/server";
import { cardMeaning, parseCardTokens } from "@/lib/tarot/engine";
import { buildTarotPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext, guessIntentsFromText } from "@/lib/rag/retriever";

type GeminiTarotResponse = {
  summary: string;
  opportunities?: string[];
  risks?: string[];
  actions?: string[];
  timeframe?: string;
  confidence?: string;
  disclaimer?: string;
};

function formatAsCardStructure(parsed: GeminiTarotResponse): string {
  const parts = [];
  
  if (parsed.opportunities?.length) {
    parts.push(`✨ โอกาสและจุดเด่น:\n${parsed.opportunities.map(o => `• ${o}`).join('\n')}`);
  }
  
  if (parsed.risks?.length) {
    parts.push(`⚠️ สิ่งที่ควรระวัง:\n${parsed.risks.map(r => `• ${r}`).join('\n')}`);
  }
  
  if (parsed.actions?.length) {
    parts.push(`📋 แนวทางที่ควรทำ:\n${parsed.actions.map(a => `• ${a}`).join('\n')}`);
  }
  
  if (parsed.timeframe) {
    parts.push(`⏳ กรอบเวลา: ${parsed.timeframe}`);
  }

  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = (await req.json()) as {
      cardsToken?: string;
      count?: number;
      question?: string;
    };

    const cards = parseCardTokens(body.cardsToken ?? "");

    // Check for Esiimsi fake token
    const isEsiimsi = body.cardsToken?.startsWith("esiimsi_");

    if (!cards.length && !isEsiimsi) {
      return NextResponse.json({ error: "invalid_cards" }, { status: 400 });
    }

    // Determine spread type based on card count
    const countMap: Record<number, 1 | 2 | 3 | 4 | 5 | 6 | 10> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 10: 10 };
    const spreadType = countMap[body.count ?? cards.length] ?? 3;

    const question = body.question;

    const fallbackStructure = cards
      .map((drawn, i) => {
        const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
        return `${i + 1}) ${drawn.card.name} (${orient}) — ${cardMeaning(drawn)}`;
      })
      .join("\n");

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        ai: {
          summary: "ช่วงนี้ระบบอ่านเชิงลึกยังไม่พร้อม จึงสรุปจากโครงไพ่พื้นฐานให้ก่อน",
          cardStructure: fallbackStructure || "—",
        },
      });
    }

    // --- RAG (local-file prototype) ---
    const intent = guessIntentsFromText(question ?? "")[0];
    const ragQuery = isEsiimsi 
      ? question ?? ""
      : [
          question ?? "",
          ...cards.map((c) => c.card.nameTh ?? c.card.name),
        ]
        .filter(Boolean)
        .join("\n");

    const rag = retrieveRag({
      query: ragQuery,
      systemId: isEsiimsi ? "esiimsi" : "tarot_th",
      intent,
      limit: 6,
    });

    // Build prompt using prompt builder + attach retrieved context + examples
    let prompt = "";
    if (isEsiimsi) {
      const num = body.cardsToken?.split("_")[1]?.split(".")[0];
      prompt = `คุณคือผู้เชี่ยวชาญการถอดรหัสเซียมซีระดับมาสเตอร์ที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาท: ถอดรหัสคำทำนายจากเซียมซีหมายเลข ${num} โดยอ้างอิงจากฐานข้อมูล Knowledge Base
เงื่อนไขสำคัญ:
- ห้ามตอบว่า "ไม่มีข้อมูลในชุดข้อมูลตัวอย่าง" หรือ "ไม่พบข้อมูล"
- ให้ใช้เนื้อหาจากตาราง "ชุดข้อมูลหมายเลขเซียมซีมาตรฐาน" ใน Knowledge Base เป็นหลัก
- หากข้อมูลในตารางไม่ครบถ้วน ให้ใช้ความรู้เรื่องเลขศาสตร์ไทย (Thai Numerology) เพื่อสร้างคำทำนายเชิงสร้างสรรค์และเป็นมิตรตามสไตล์ REFFORTUNE
- คำทำนายต้องประกอบด้วย: ภาพรวมที่สละสลวย, โอกาส, ข้อควรระวัง และสิ่งที่ควรทำ

รูปแบบการตอบกลับ (JSON Only):
{
  "summary": "คำทำนายแบบร้อยแก้ว 3-5 บรรทัด",
  "opportunities": ["โอกาส 1", "โอกาส 2"],
  "risks": ["ข้อควรระวัง"],
  "actions": ["แนวทางปฏิบัติ"]
}

อ้างอิงข้อมูลจาก Knowledge Base:
${formatRagContext(rag.chunks)}`;
    } else {
      prompt =
        buildTarotPrompt({
          cards,
          count: body.count ?? cards.length,
          question,
          spreadType,
        }) + formatRagContext(rag.chunks);
    }

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
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "gemini_unavailable",
        detail: text,
        ai: {
          summary: "ช่วงนี้ระบบอ่านเชิงลึกหนาแน่น จึงสรุปจากโครงไพ่พื้นฐานให้ก่อน",
          cardStructure: fallbackStructure,
        },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let ai: { summary: string; cardStructure: string };
    try {
      const parsed = JSON.parse(raw) as GeminiTarotResponse;
      ai = {
        summary: parsed.summary || "สรุปคำทำนายยังไม่สมบูรณ์",
        cardStructure: formatAsCardStructure(parsed) || "ไม่สามารถระบุรายละเอียดได้",
      };
    } catch {
      ai = {
        summary: "สรุปคำทำนายยังไม่สมบูรณ์ (Parse Error)",
        cardStructure: fallbackStructure,
      };
    }

    return NextResponse.json({ ok: true, ai });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
