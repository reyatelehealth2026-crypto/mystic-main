import { describe, it, expect } from "vitest";
import { buildReadingFlexMessage } from "./readingMessage";

const card = (name: string, reversed = false) => ({
  name,
  imageUrl: `https://x.y/card/${name}.png`,
  reversed,
});

describe("buildReadingFlexMessage", () => {
  it("lists card names in altText", () => {
    const msg = buildReadingFlexMessage([card("The Sun"), card("The Moon")]);
    expect(msg.type).toBe("flex");
    expect(msg.altText).toContain("The Sun");
    expect(msg.altText).toContain("The Moon");
  });

  it("uses a single bubble for one card", () => {
    const msg = buildReadingFlexMessage([card("The Star")]);
    expect((msg.contents as { type: string }).type).toBe("bubble");
  });

  it("uses a carousel for multiple cards", () => {
    const msg = buildReadingFlexMessage([card("A"), card("B"), card("C")]);
    const contents = msg.contents as { type: string; contents: unknown[] };
    expect(contents.type).toBe("carousel");
    expect(contents.contents).toHaveLength(3);
  });
});
