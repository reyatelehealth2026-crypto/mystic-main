# LIFF / LINE Feature Roadmap

> สรุปแผนพัฒนา LIFF ทั้งหมด (ไม่แตะระบบเครดิต/เงิน)
> ดู PR แรกบน branch `claude/gracious-johnson-118yle`

## เป้าหมาย

ดึงประโยชน์จาก LIFF/LINE ให้สูงสุดในเชิงฟีเจอร์ engagement และ retention โดย **ไม่** แตะ logic เครดิต ไม่เพิ่ม paywall ใหม่ และคง graceful fallback ทุกจุด

---

## Phase 0 — Flex Builder (รากฐาน) ✅

ไฟล์: `src/lib/line/flex.ts` + `src/lib/line/flex.test.ts`

- Pure-JSON Flex builder ไม่ import SDK — ใช้ได้ทั้ง Worker route และ client
- `buildDailyCardFlex(input)` — bubble ไพ่รายวัน (hero + body + CTA button)
- `buildReadingFlex(blocks, headline)` — bubble สำหรับ reading หลายแบบ
- `safeHeroUrl(url)` — บังคับ https เสมอ (ป้องกัน Flex render fail แบบเงียบ)
- `clampFlexText(s, max)`, `liffDeepLink(path)`, `FLEX_BRAND` constants
- `src/lib/line/messaging.ts` — `LineMessage` ขยายเป็น `text | flex` union

**Verify:** `npx vitest run src/lib/line/flex.test.ts` → 20 tests pass

---

## Phase 1 — Native LINE Share (ROI สูงสุด) ✅

ไฟล์แก้: `src/lib/auth/liff.ts`, `src/components/share/index.tsx`, `src/app/daily-card/page.tsx`  
ไฟล์ใหม่: `src/components/share/ShareToLineButton.tsx`

- `canShareTargetPicker()`, `shareViaTargetPicker(messages)` — ห่อ LIFF SDK
- `<ShareToLineButton>` — render เฉพาะในแอป LINE; ถ้า unavailable → `onFallback()`
- `buildFlexForShareable(data)` — แปลง `ShareableData` ทุก vertical → `LineMessage[]`
- `UniversalShareableCard` — ฝัง `<ShareToLineButton>` ในทุก share card
- `daily-card/page.tsx` — แทน URL เก่าด้วย native Flex share + เก็บ URL fallback

**ต้องเปิดใน console:** `shareTargetPicker` feature ใน LIFF App settings

---

## Phase 2 — Daily Push Notification (ฟีเจอร์ retention เรือธง) ✅

ไฟล์ใหม่:
- `supabase/migrations/0002_notification_prefs.sql` — columns `daily_push_opt_in`, `daily_push_hour`, `daily_push_last_sent_on`
- `src/lib/supabase/notifications.ts` — `getNotificationPrefs`, `setNotificationPrefs`, `listUsersDueForDailyPush`, `markDailyPushSent`
- `src/app/api/me/notifications/route.ts` — `GET`/`POST` เก็บ opt-in + hour
- `src/app/api/cron/daily-push/route.ts` — batch sender (auth: `CRON_SECRET`)

ไฟล์แก้:
- `src/lib/supabase/types.ts` — เพิ่มสาม column ใน `UserRow`
- `src/app/profile/ProfileClient.tsx` — toggle เชื่อมกับ `/api/me/notifications` จริง

**Scheduler แนะนำ:** Supabase `pg_cron` + `pg_net` ยิง POST ทุกชั่วโมง:
```sql
select cron.schedule(
  'daily-push-hourly',
  '0 * * * *',
  $$
    select net.http_post(
      'https://www.reffortune.com/api/cron/daily-push',
      '{}',
      '{"Authorization": "Bearer <CRON_SECRET>", "Content-Type": "application/json"}'
    );
  $$
);
```

**Secret ใหม่:** `CRON_SECRET` (`wrangler secret put CRON_SECRET`)  
**Migration:** รัน `0002_notification_prefs.sql` ใน Supabase SQL editor

---

## Phase 3 — Onboarding + Mini-app Home ✅

ไฟล์แก้: `src/lib/auth/liff.ts`, `src/app/liff/LiffClient.tsx`, `src/app/profile/ProfileClient.tsx`  
ไฟล์ใหม่: `src/components/onboarding/AddFriendPrompt.tsx`

- `getFriendshipStatus()` — ห่อ `liff.getFriendship()` gracefully (null = unavailable)
- `<AddFriendPrompt>` — แสดงเมื่อ `friendFlag === false` เท่านั้น; framing เป็น "ปลดล็อกฟีเจอร์"
- `LiffClient` — กลายเป็น mini-app home หลัง login: grid ลิงก์ 6 ฟีเจอร์ + AddFriendPrompt
- `ProfileClient` — แสดง `<AddFriendPrompt>` เมื่อ opt-in push แต่ยังไม่เป็นเพื่อน

**ต้องตั้งค่าใน .env.local:**
```
NEXT_PUBLIC_LINE_OA_ADD_FRIEND_URL=https://line.me/R/ti/p/@your-oa-id
```

**ต้องทำใน console:** เชื่อม LINE OA กับ Login channel ใน LINE Provider เดียวกัน + เพิ่ม `friendship_status` scope

---

## Phase 4 — Webhook + Rich Menu ✅

ไฟล์ใหม่:
- `src/app/api/line/webhook/route.ts` — verify HMAC-SHA256 (Web Crypto), handle `message`/`follow` events
- `scripts/setup-rich-menu.mjs` — สร้าง rich menu 2500×1686 px, 6 ช่อง, set as default

ไฟล์แก้: `src/lib/line/messaging.ts` — เพิ่ม `sendLineReply(replyToken, messages)`

**Commands ที่ต้องทำมือ:**
```bash
# 1. Register webhook in LINE Developers console:
#    Webhook URL: https://www.reffortune.com/api/line/webhook
#    → disable auto-reply, greeting message

# 2. Set secret
wrangler secret put LINE_MESSAGING_CHANNEL_SECRET

# 3. Create image asset
cp your-design.png scripts/rich-menu.png   # 2500×1686 PNG

# 4. Run setup script
node scripts/setup-rich-menu.mjs
```

**Bot commands:** "ไพ่วันนี้" / "ดูดวง" → Flex card reply; other → help message with deep link

---

## Environment variables สรุป

### `wrangler.jsonc` vars (public, commit-safe)
| Key | ค่า |
|---|---|
| `NEXT_PUBLIC_SITE_ORIGIN` | `https://www.reffortune.com` |

### `.env.local` (local dev)
| Key | หมายเหตุ |
|---|---|
| `NEXT_PUBLIC_LIFF_ID` | LIFF App ID จาก LINE console |
| `NEXT_PUBLIC_SITE_ORIGIN` | `https://www.reffortune.com` |
| `NEXT_PUBLIC_LINE_OA_ADD_FRIEND_URL` | `https://line.me/R/ti/p/@reffortune` |

### Cloudflare secrets (`wrangler secret put`)
| Key | Phase |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | existing |
| `LINE_LOGIN_CHANNEL_SECRET` | existing |
| `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN` | existing |
| `SESSION_SECRET` | existing |
| `ADMIN_LINE_USER_IDS` | existing |
| `CRON_SECRET` | Phase 2 (new) |
| `LINE_MESSAGING_CHANNEL_SECRET` | Phase 4 (new) |

---

## Cross-cutting หลักการ

- `LineMessage` union (`text | flex`) เป็น single source of truth ใน `messaging.ts`
- `@line/liff` อยู่เฉพาะใน `src/lib/auth/liff.ts` (dynamic import client-only)
- `flex.ts` เป็น pure JSON — import ได้ทุกที่
- ทุก new API env-guard + log `notifications` table ตาม contract เดิม
- ไม่แตะ credit/order logic

## ลำดับ ROI

```
Phase 0 (รากฐาน) → 1 (share, ไม่มี backend) → 2 (push) → 3 (onboarding) → 4 (webhook/rich menu) → 5 (docs)
```
