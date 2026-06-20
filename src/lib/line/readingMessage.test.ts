import { describe, it, expect } from "vitest";
import { buildReadingMessageText } from "./readingMessage";

describe("buildReadingMessageText", () => {
  it("includes header, cards, and summary", () => {
    const text = buildReadingMessageText({ cards: "The Sun, The Moon", summary: "วันนี้ดีมาก" });
    expect(text).toContain("🔮 ผลไพ่ทาโรต์ของคุณ");
    expect(text).toContain("ไพ่: The Sun, The Moon");
    expect(text).toContain("วันนี้ดีมาก");
  });

  it("appends the url line only when provided", () => {
    const withUrl = buildReadingMessageText({ cards: "A", summary: "B", url: "https://x.y/z" });
    expect(withUrl).toContain("ดูผลเต็ม: https://x.y/z");
    const withoutUrl = buildReadingMessageText({ cards: "A", summary: "B" });
    expect(withoutUrl).not.toContain("ดูผลเต็ม:");
  });
});
