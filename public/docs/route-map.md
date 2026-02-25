# MysticFlow Route Map (MVP)

## Public
- `/` — Landing + CTA + pricing preview
- `/tarot` — Tarot mode chooser (1/3/10)
- `/tarot/pick?count=1|3|10` — Card selection
- `/tarot/result/:readingId` — Reading result
- `/spirit-card` — Birth-date spirit card flow
- `/numerology` — Phone numerology analyzer
- `/library` — Tarot card library index (78 cards)
- `/library/:cardId` — Card detail page
- `/pricing` — Credit packs + subscription plans
- `/about` — Methodology + trust/disclaimer
- `/privacy` + `/terms`

## Auth-required
- `/dashboard` — Reading history timeline + quick actions
- `/wallet` — Credits, top-up history
- `/subscription` — Plan status + manage subscription
- `/settings` — Profile preferences

## API (Next.js Route Handlers)
- `POST /api/readings/tarot`
- `POST /api/readings/spirit-card`
- `POST /api/readings/numerology`
- `GET /api/readings/:id`
- `GET /api/readings/history`
- `POST /api/payments/create`
- `POST /api/payments/webhook`

## Wireframe Priority (D1)
1. Landing
2. Tarot pick/reveal flow
3. Result page (share + CTA)
4. Dashboard history
