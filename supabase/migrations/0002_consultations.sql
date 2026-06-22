-- REFFORTUNE — live consultation rounds (ปรึกษาหมอดูสด)
-- One row per paid round. Chat itself happens in LINE OA; this table only
-- tracks billing + open/closed lifecycle. RLS deny-all (service-role only).

create table if not exists public.consultations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  credits_spent integer not null,
  status        text not null default 'open',   -- 'open' | 'closed'
  opened_at     timestamptz not null default now(),
  closed_at     timestamptz,
  closed_by     text                            -- line_user_id of the หมอดู who closed
);

create index if not exists consultations_status_idx
  on public.consultations (status, opened_at);

alter table public.consultations enable row level security;
-- deny-all: intentionally no policies.
