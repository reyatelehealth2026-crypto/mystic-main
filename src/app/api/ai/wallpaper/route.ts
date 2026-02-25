import { NextResponse } from "next/server";

// ──────────────────────────────────────────────
// Request type — รับข้อมูลจาก wizard UI
// ──────────────────────────────────────────────

type WallpaperRequest = {
  // สีมงคลที่ผู้ใช้เลือก (1-2 สี)
  selectedColors: { nameEn: string; hex: string }[];
  // เรื่องที่ต้องการเสริม
  topic: "finance" | "career" | "love" | "luck" | "health";
  // ข้อมูลไพ่ที่สุ่มได้
  tarotCardName: string;
  tarotSymbols: string;
  // เลขมงคล
  luckyNumber: number;
  // สไตล์ภาพ
  style: "minimal" | "cosmic";
};

// ──────────────────────────────────────────────
// Prompt builders
// ──────────────────────────────────────────────

const TOPIC_PROMPTS: Record<string, string> = {
  finance: "financial abundance, wealth attraction, golden coins, treasure, prosperity energy",
  career: "career success, rising achievement, burning torch, powerful energy, leadership",
  love: "romantic love energy, hearts, roses, soft warm glow, harmony, connection",
  luck: "good fortune, lucky stars, auspicious symbols, wheel of fate, blessing",
  health: "healing energy, zen serenity, lotus flower, life force, wellness, vitality",
};

const STYLE_PROMPTS: Record<string, string> = {
  minimal: "minimalist clean design, simple elegant composition, soft gradients, uncluttered layout, modern aesthetic",
  cosmic: "cosmic galaxy universe, nebula, stars, celestial bodies, deep space, mystical cosmic energy, swirling galaxies",
};

function buildPrompt(req: WallpaperRequest): string {
  const topicDesc = TOPIC_PROMPTS[req.topic] || TOPIC_PROMPTS.finance;
  const styleDesc = STYLE_PROMPTS[req.style] || STYLE_PROMPTS.minimal;

  const colorNames = req.selectedColors.map((c) => c.nameEn).join(" and ");
  const colorHexes = req.selectedColors.map((c) => c.hex).join(", ");
  const colorDesc = `Primary color palette using ${colorNames} (${colorHexes})`;

  const luckyPart = req.luckyNumber
    ? ` The lucky number "${req.luckyNumber}" should be subtly integrated into the design as a mystical element.`
    : "";

  const tarotPart = req.tarotCardName
    ? ` Incorporate visual symbolism inspired by the "${req.tarotCardName}" tarot card: ${req.tarotSymbols}.`
    : "";

  return `Create a stunning high-quality phone wallpaper for Thai spiritual fortune enhancement.

Theme: ${topicDesc}.
Style: ${styleDesc}.
Color: ${colorDesc}.${tarotPart}${luckyPart}

The design should be inspired by Thai mystical and spiritual aesthetics (สายมู), beautiful and serene, suitable as a phone lock screen wallpaper. The auspicious colors must be prominent and dominant in the composition. Vertical 9:16 aspect ratio, high resolution, photorealistic quality with artistic flair. No text, no letters, no watermarks, no words.`;
}

// ──────────────────────────────────────────────
// POST handler
// ──────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as WallpaperRequest;

    if (!body.topic || !body.style || !body.selectedColors?.length) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const prompt = buildPrompt(body);

    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Gemini wallpaper error:", text);
      return NextResponse.json(
        { error: "gemini_error", detail: text },
        { status: 502 },
      );
    }

    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts;

    if (!parts || !Array.isArray(parts)) {
      return NextResponse.json(
        { error: "no_image_generated", detail: "No parts in response" },
        { status: 500 },
      );
    }

    // Find the image part
    let imageData: string | null = null;
    let mimeType = "image/png";

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
        break;
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { error: "no_image_in_response", detail: "Response contained no image data" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      image: `data:${mimeType};base64,${imageData}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
