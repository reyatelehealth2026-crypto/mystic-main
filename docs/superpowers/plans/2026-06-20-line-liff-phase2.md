# LINE/LIFF Phase 2 — F1 + F3 + F4 Plan

**Goal:** Send tarot results into the opener's LINE chat (F1), auto-reply to OA messages by round status (F3), and let users share readings to friends (F4).

**Scope chosen by user:** F1, F3, F4 (NOT F2 push-on-round-open).

## Files
- Create `src/lib/line/readingMessage.ts` (+ `.test.ts`) — pure text builder.
- Modify `src/lib/auth/liff.ts` — add `sendLiffMessages`, `shareReadingToFriends`.
- Modify `src/lib/line/messaging.ts` — add `replyLineMessage`.
- Create `src/app/api/line/push-reading/route.ts` — POST: server push the reading to the logged-in user.
- Create `src/app/api/line/webhook/route.ts` — POST: verify signature, auto-reply by open-round status.
- Create `src/app/tarot/result/SendToLine.tsx` — buttons (send to LINE + share).
- Modify `src/app/tarot/result/ResultClient.tsx` — mount `SendToLine`.
- Env: add `LINE_MESSAGING_CHANNEL_SECRET` (local + Vercel) for webhook signature.

## F1 — result → LINE
- In LINE client: `liff.sendMessages([{type:"text", text}])` posts into the user's OA chat.
- Else (web): `POST /api/line/push-reading` → `sendLinePush(user.line_user_id, …)`.
- Text built by `buildReadingMessageText({cards, summary, url})`.

## F3 — webhook auto-reply
- `POST /api/line/webhook`: verify `x-line-signature` (HMAC-SHA256 of raw body w/ `LINE_MESSAGING_CHANNEL_SECRET`, base64).
- For each text message event: look up `getUserByLineId(source.userId)` → `getOpenConsultationForUser`.
  - open round → "หมอดูกำลังดูให้นะคะ รอสักครู่ 🙏"
  - else → "กดเปิดรอบปรึกษาที่แอปก่อนนะคะ 👉 <url>/consult"
- Reply via `replyLineMessage(replyToken, …)`.

## F4 — share to friends
- `liff.shareTargetPicker([{type:"text", text}])` (guard `isApiAvailable`).

## Prerequisites (user, in LINE console)
- Login + Messaging channels under the SAME provider (userId match for push + webhook lookup).
- Messaging channel: set Webhook URL = `https://mystic-main.vercel.app/api/line/webhook`, enable "Use webhook", disable default auto-reply.
- LIFF linked to the OA (bot link) for `sendMessages`; enable shareTargetPicker.

## Verification
- Unit: `buildReadingMessageText` formats cards/summary/url.
- Build passes; new routes present.
- Manual: draw tarot → "ส่งผลไพ่เข้า LINE" → message arrives; message the OA → auto-reply matches round status.
