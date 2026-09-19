/**
 * Canonical site URL.
 *
 * Centralized so metadataBase (`app/layout.tsx`), the sitemap, robots.txt,
 * and any other emitter agree on the same origin. Update here only.
 */
export const SITE_URL = "https://reftirata.life";
/** Bare host for on-image captions (share cards, wallpapers). */
export const SITE_HOST = new URL(SITE_URL).host;
export const SITE_NAME = "REFFORTUNE";

/** LINE Official Account add-friend link (used by every LINE CTA). */
export const LINE_OA_URL = "https://line.me/R/ti/p/@reffortune";

/** Deep link that opens LINE with `text` pre-filled in the share sheet. */
export function lineMessageUrl(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}
