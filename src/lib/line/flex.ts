/**
 * Pure-JSON Flex Message builder for LINE.
 * Zero SDK imports — safe to use in Cloudflare Workers AND client components.
 *
 * Reference: https://developers.line.biz/en/docs/messaging-api/flex-message-elements/
 */

// ── Brand constants ───────────────────────────────────────────────────────────
export const FLEX_BRAND = {
  violet: "#7C3AED",
  violetLight: "#faf5ff",
  lineGreen: "#06C755",
  accent: "#7C3AED",
  warning: "#F59E0B",
  neutral: "#6B7280",
} as const;

// ── Type definitions (subset of LINE Flex spec) ───────────────────────────────

export interface FlexAction {
  type: "uri";
  label: string;
  uri: string;
}

export interface FlexText {
  type: "text";
  text: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl";
  weight?: "regular" | "bold";
  color?: string;
  wrap?: boolean;
  maxLines?: number;
  flex?: number;
}

export interface FlexImage {
  type: "image";
  url: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl" | "full";
  aspectRatio?: string;
  aspectMode?: "cover" | "fit";
  action?: FlexAction;
}

export interface FlexButton {
  type: "button";
  action: FlexAction;
  style?: "primary" | "secondary" | "link";
  color?: string;
  height?: "sm" | "md";
  flex?: number;
}

export interface FlexSeparator {
  type: "separator";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
}

export type FlexBoxContent = FlexText | FlexImage | FlexButton | FlexBox | FlexSeparator;

export interface FlexBox {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexBoxContent[];
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  paddingAll?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingStart?: string;
  paddingEnd?: string;
  backgroundColor?: string;
  cornerRadius?: string;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  flex?: number;
}

export interface FlexBubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  hero?: FlexImage;
  header?: FlexBox;
  body?: FlexBox;
  footer?: FlexBox;
}

export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: FlexBubble;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Ensure URL is absolute https.
 * Returns undefined when the URL can't be made https-safe — strips the hero to
 * avoid the most common silent Flex render failure on LINE.
 */
export function safeHeroUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    const origin =
      (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SITE_ORIGIN : undefined) ??
      "https://www.reffortune.com";
    const abs = `${origin.replace(/\/$/, "")}${url}`;
    return abs.startsWith("https://") ? abs : undefined;
  }
  // http:// or anything else → drop; unsafe for Flex
  return undefined;
}

/** Clamp a string to `max` characters, appending … when truncated. */
export function clampFlexText(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}\u2026`;
}

/**
 * Build a LIFF deep link.
 * Falls back to the site origin when `NEXT_PUBLIC_LIFF_ID` is not set
 * (e.g. during local dev or tests).
 */
export function liffDeepLink(path: string): string {
  const id =
    typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_LIFF_ID ?? "") : "";
  if (id) return `https://liff.line.me/${id}${path}`;
  const origin =
    (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SITE_ORIGIN : undefined) ??
    "https://www.reffortune.com";
  return `${origin.replace(/\/$/, "")}${path}`;
}

// ── Builders ──────────────────────────────────────────────────────────────────

export interface DailyCardFlexInput {
  cardNameTh: string;
  cardName: string;
  orientation: "upright" | "reversed";
  meaning: string;
  keywords: string[];
  imageUrl?: string | null;
}

/** Flex bubble for the daily card: optional hero + card info + open-in-app CTA. */
export function buildDailyCardFlex(input: DailyCardFlexInput): FlexMessage {
  const orientationLabel = input.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
  const heroUrl = safeHeroUrl(input.imageUrl);
  const keywordLine = input.keywords.slice(0, 3).join(" \u2022 ");
  const altText = clampFlexText(
    `ไพ่รายวัน: ${input.cardNameTh} (${orientationLabel}) \u2014 ${input.meaning}`,
    400,
  );
  const deepLink = liffDeepLink("/daily-card");

  const bodyContents: FlexBoxContent[] = [
    {
      type: "text",
      text: "ไพ่รายวัน \u2728",
      size: "xs",
      color: FLEX_BRAND.violet,
      weight: "bold",
    },
    {
      type: "text",
      text: `${input.cardNameTh} \u2014 ${orientationLabel}`,
      size: "xl",
      weight: "bold",
      wrap: true,
    },
    {
      type: "text",
      text: clampFlexText(input.meaning, 120),
      size: "sm",
      color: "#555555",
      wrap: true,
      maxLines: 4,
    },
  ];

  if (keywordLine) {
    bodyContents.push({
      type: "text",
      text: keywordLine,
      size: "xs",
      color: FLEX_BRAND.neutral,
      wrap: true,
    });
  }

  const bubble: FlexBubble = {
    type: "bubble",
    size: "mega",
    ...(heroUrl
      ? {
          hero: {
            type: "image",
            url: heroUrl,
            size: "full",
            aspectRatio: "2:3",
            aspectMode: "cover",
            action: { type: "uri", label: "ดูไพ่", uri: deepLink },
          },
        }
      : {}),
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      paddingAll: "16px",
      contents: bodyContents,
    },
    footer: {
      type: "box",
      layout: "vertical",
      paddingAll: "12px",
      contents: [
        {
          type: "button",
          action: { type: "uri", label: "เปิดดูไพ่เต็ม \u2728", uri: deepLink },
          style: "primary",
          color: FLEX_BRAND.violet,
        },
      ],
    },
  };

  return { type: "flex", altText, contents: bubble };
}

export interface ReadingBlockInput {
  title: string;
  body: string;
  emphasis?: "neutral" | "positive" | "caution";
}

/**
 * Flex bubble from reading interpretation blocks (for share/push after a tarot
 * or spirit reading). Maps `emphasis` values to brand accent colors.
 */
export function buildReadingFlex(
  blocks: ReadingBlockInput[],
  headline: string,
  deepLinkPath: string = "/",
): FlexMessage {
  const altText = clampFlexText(`ผลการดูดวง: ${headline}`, 400);
  const deepLink = liffDeepLink(deepLinkPath);

  const emphasisColor = (e?: "neutral" | "positive" | "caution"): string => {
    if (e === "positive") return FLEX_BRAND.accent;
    if (e === "caution") return FLEX_BRAND.warning;
    return FLEX_BRAND.neutral;
  };

  const blockItems: FlexBox[] = blocks.slice(0, 4).map((b) => ({
    type: "box",
    layout: "vertical",
    margin: "md",
    contents: [
      {
        type: "text",
        text: clampFlexText(b.title, 40),
        size: "sm",
        weight: "bold",
        color: emphasisColor(b.emphasis),
        wrap: true,
      },
      {
        type: "text",
        text: clampFlexText(b.body, 120),
        size: "sm",
        color: "#555555",
        wrap: true,
        maxLines: 3,
      },
    ],
  }));

  const bubble: FlexBubble = {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      paddingAll: "14px",
      backgroundColor: FLEX_BRAND.violetLight,
      contents: [
        {
          type: "text",
          text: clampFlexText(headline, 60),
          size: "lg",
          weight: "bold",
          color: FLEX_BRAND.violet,
          wrap: true,
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "none",
      paddingAll: "16px",
      contents: blockItems,
    },
    footer: {
      type: "box",
      layout: "vertical",
      paddingAll: "12px",
      contents: [
        {
          type: "button",
          action: { type: "uri", label: "ดูผลดวงเต็ม \u2728", uri: deepLink },
          style: "primary",
          color: FLEX_BRAND.violet,
        },
      ],
    },
  };

  return { type: "flex", altText, contents: bubble };
}
