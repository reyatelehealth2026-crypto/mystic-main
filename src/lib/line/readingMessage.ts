/**
 * Pure builder for the LINE text message that carries a reading result back to
 * the user's chat. No IO so it is unit-testable and shared by the LIFF path and
 * the server-push path.
 */
export function buildReadingMessageText(params: {
  cards: string;
  summary: string;
  url?: string;
}): string {
  const lines = ["🔮 ผลไพ่ทาโรต์ของคุณ", `ไพ่: ${params.cards}`, "", params.summary];
  if (params.url) lines.push("", `ดูผลเต็ม: ${params.url}`);
  return lines.join("\n");
}
