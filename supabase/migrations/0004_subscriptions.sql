-- REFFORTUNE — monthly subscription packages (แพ็กรายเดือน X ครั้ง/เดือน)
-- A subscriber gets `monthly_quota` free uses per period; beyond that they pay
-- credits. One active row per user; `used_count` resets by starting a new period.

create table if not exists public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  plan_id       text not null,
  plan_name     text not null,
  monthly_quota integer not null,
  used_count    integer not null default 0,
  period_start  timestamptz not null default now(),
  period_end    timestamptz not null,
  status        text not null default 'active',  -- 'active' | 'expired'
  created_at    timestamptz not null default now()
);

create index if not exists subscriptions_user_status_idx
  on public.subscriptions (user_id, status);

alter table public.subscriptions enable row level security;
-- deny-all: service-role only.
