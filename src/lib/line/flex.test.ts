import { describe, it, expect } from "vitest";
import {
  buildDailyCardFlex,
  buildReadingFlex,
  safeHeroUrl,
  clampFlexText,
  liffDeepLink,
} from "./flex";

// ── safeHeroUrl ───────────────────────────────────────────────────────────────
describe("safeHeroUrl", () => {
  it("passes through valid https URLs", () => {
    expect(safeHeroUrl("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
  });

  it("converts root-relative paths using NEXT_PUBLIC_SITE_ORIGIN", () => {
    process.env.NEXT_PUBLIC_SITE_ORIGIN = "https://www.reffortune.com";
    const result = safeHeroUrl("/card/01.png");
    expect(result).toBe("https://www.reffortune.com/card/01.png");
  });

  it("returns undefined for http:// URLs", () => {
    expect(safeHeroUrl("http://insecure.com/img.jpg")).toBeUndefined();
  });

  it("returns undefined for null/undefined", () => {
    expect(safeHeroUrl(null)).toBeUndefined();
    expect(safeHeroUrl(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(safeHeroUrl("")).toBeUndefined();
  });
});

// ── clampFlexText ─────────────────────────────────────────────────────────────
describe("clampFlexText", () => {
  it("returns the string unchanged when within limit", () => {
    expect(clampFlexText("hello", 10)).toBe("hello");
  });

  it("truncates and appends ellipsis", () => {
    const result = clampFlexText("abcdefghij", 5);
    expect(result.length).toBe(5);
    expect(result.endsWith("…")).toBe(true);
  });
});

// ── liffDeepLink ─────────────────────────────────────────────────────────────
describe("liffDeepLink", () => {
  it("builds liff.line.me URL when LIFF_ID is set", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    expect(liffDeepLink("/daily-card")).toBe(
      "https://liff.line.me/1234567890-abcdefgh/daily-card",
    );
  });

  it("falls back to site origin when LIFF_ID is absent", () => {
    delete process.env.NEXT_PUBLIC_LIFF_ID;
    process.env.NEXT_PUBLIC_SITE_ORIGIN = "https://www.reffortune.com";
    expect(liffDeepLink("/daily-card")).toBe("https://www.reffortune.com/daily-card");
  });
});

// ── buildDailyCardFlex ────────────────────────────────────────────────────────
describe("buildDailyCardFlex", () => {
  const baseInput = {
    cardNameTh: "นักโง่",
    cardName: "The Fool",
    orientation: "upright" as const,
    meaning: "การเริ่มต้นใหม่ ความบริสุทธิ์ใจ",
    keywords: ["อิสรภาพ", "ผจญภัย", "ศรัทธา"],
    imageUrl: "https://www.reffortune.com/card/00.png",
  };

  it("returns a flex message with correct type", () => {
    const msg = buildDailyCardFlex(baseInput);
    expect(msg.type).toBe("flex");
    expect(msg.contents.type).toBe("bubble");
  });

  it("altText must be ≤ 400 characters", () => {
    const msg = buildDailyCardFlex(baseInput);
    expect(msg.altText.length).toBeLessThanOrEqual(400);
  });

  it("altText must be ≤ 400 chars even with very long meaning", () => {
    const longMeaning = "x".repeat(500);
    const msg = buildDailyCardFlex({ ...baseInput, meaning: longMeaning });
    expect(msg.altText.length).toBeLessThanOrEqual(400);
  });

  it("includes hero when imageUrl is valid https", () => {
    const msg = buildDailyCardFlex(baseInput);
    expect(msg.contents.hero).toBeDefined();
    expect(msg.contents.hero?.url).toBe("https://www.reffortune.com/card/00.png");
  });

  it("omits hero when imageUrl is http (non-https)", () => {
    const msg = buildDailyCardFlex({
      ...baseInput,
      imageUrl: "http://insecure.example.com/card.png",
    });
    expect(msg.contents.hero).toBeUndefined();
  });

  it("omits hero when imageUrl is absent", () => {
    const msg = buildDailyCardFlex({ ...baseInput, imageUrl: null });
    expect(msg.contents.hero).toBeUndefined();
  });

  it("footer contains a URI action pointing to the LIFF deep link", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    const msg = buildDailyCardFlex(baseInput);
    const button = msg.contents.footer?.contents[0];
    expect(button?.type).toBe("button");
    if (button?.type === "button") {
      expect(button.action.uri).toContain("liff.line.me");
      expect(button.action.uri).toContain("/daily-card");
    }
  });
});

// ── buildReadingFlex ──────────────────────────────────────────────────────────
describe("buildReadingFlex", () => {
  const blocks = [
    { title: "สรุป", body: "พลังงานเชิงบวกล้อมรอบคุณ", emphasis: "positive" as const },
    { title: "ระวัง", body: "อย่าตัดสินใจเร็วเกินไป", emphasis: "caution" as const },
  ];

  it("returns a flex message", () => {
    const msg = buildReadingFlex(blocks, "ผลไพ่ทาโรต์");
    expect(msg.type).toBe("flex");
  });

  it("altText must be ≤ 400 characters", () => {
    const msg = buildReadingFlex(blocks, "x".repeat(450));
    expect(msg.altText.length).toBeLessThanOrEqual(400);
  });

  it("renders at most 4 blocks", () => {
    const manyBlocks = Array.from({ length: 10 }, (_, i) => ({
      title: `Block ${i}`,
      body: "body text",
    }));
    const msg = buildReadingFlex(manyBlocks, "Reading");
    // body contents array ≤ 4
    expect((msg.contents.body?.contents ?? []).length).toBeLessThanOrEqual(4);
  });

  it("has a header with the headline", () => {
    const msg = buildReadingFlex(blocks, "ผลไพ่ทาโรต์");
    const headerText = msg.contents.header?.contents[0];
    expect(headerText?.type).toBe("text");
    if (headerText?.type === "text") {
      expect(headerText.text).toContain("ผลไพ่");
    }
  });
});
