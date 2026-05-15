export type ShareFormatId = "original" | "square" | "story";

export interface ShareFormat {
  id: ShareFormatId;
  label: string;
  hint: string;
  cssWidth: number;
  cssHeight: number | "auto";
  exportWidth: number;
  exportHeight: number;
  pixelRatio: number;
}

export const SHARE_FORMATS: Record<ShareFormatId, ShareFormat> = {
  original: {
    id: "original",
    label: "ต้นฉบับ",
    hint: "เหมาะกับการเซฟไว้ดูเอง",
    cssWidth: 400,
    cssHeight: "auto",
    exportWidth: 800,
    exportHeight: 0,
    pixelRatio: 2,
  },
  square: {
    id: "square",
    label: "ฟีด 1:1",
    hint: "IG / Facebook โพสต์",
    cssWidth: 540,
    cssHeight: 540,
    exportWidth: 1080,
    exportHeight: 1080,
    pixelRatio: 2,
  },
  story: {
    id: "story",
    label: "สตอรี่ 9:16",
    hint: "IG Story / TikTok / Reels",
    cssWidth: 405,
    cssHeight: 720,
    exportWidth: 1080,
    exportHeight: 1920,
    pixelRatio: 2,
  },
};

export const SHARE_FORMAT_ORDER: ShareFormatId[] = ["story", "square", "original"];

export function getShareFormat(id: ShareFormatId): ShareFormat {
  return SHARE_FORMATS[id];
}

export function buildFilename(vertical: string, formatId: ShareFormatId): string {
  const ts = Date.now();
  return `reffortune-${vertical}-${formatId}-${ts}.png`;
}
