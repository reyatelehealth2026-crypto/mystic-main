import { describe, it, expect } from "vitest";
import {
  SHARE_FORMATS,
  SHARE_FORMAT_ORDER,
  buildFilename,
  getShareFormat,
} from "./formats";

describe("share formats", () => {
  it("exposes all three formats", () => {
    expect(Object.keys(SHARE_FORMATS).sort()).toEqual([
      "original",
      "square",
      "story",
    ]);
  });

  it("story format is 9:16 at export resolution", () => {
    const story = SHARE_FORMATS.story;
    expect(story.exportWidth).toBe(1080);
    expect(story.exportHeight).toBe(1920);
    expect(story.exportHeight / story.exportWidth).toBeCloseTo(16 / 9, 5);
  });

  it("square format is 1:1 at 1080px", () => {
    const sq = SHARE_FORMATS.square;
    expect(sq.exportWidth).toBe(1080);
    expect(sq.exportHeight).toBe(1080);
  });

  it("orders story first to nudge IG/TikTok flow", () => {
    expect(SHARE_FORMAT_ORDER[0]).toBe("story");
  });

  it("getShareFormat returns the matching record", () => {
    expect(getShareFormat("square").id).toBe("square");
  });

  it("buildFilename embeds vertical and format and ends with .png", () => {
    const name = buildFilename("tarot", "story");
    expect(name).toMatch(/^reffortune-tarot-story-\d+\.png$/);
  });
});
