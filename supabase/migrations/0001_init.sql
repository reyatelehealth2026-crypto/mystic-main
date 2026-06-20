-- REFFORTUNE CRM — initial schema
-- Run manually via the Supabase SQL editor or `supabase db push`.
-- All access is server-side via the service-role key, so RLS is enabled with
-- NO public policies (deny-all to anon/authenticated). This protects the data
-- even if the anon key leaks; the service role bypasses RLS.

create extension if not exists "pgcrypto";

-- ── users ────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  line_user_id    text not null unique,
  display_name    text,
  picture_url     text,
  status_message  text,
  credits         integer not null default 0,
  membership_tier text not null default 'free',
  created_at      timestamptz not null default now(),
  last_login_at   timestamptz
);

-- ── reading_history ──────────────────────────────────────────────────────────
create table if not exists public.reading_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  type       text not null,
  summary    text,
  details    jsonb,
  client_id  text,                 -- original localStorage id (idempotent sync)
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);
create index if not exists reading_history_user_idx on public.reading_history (user_id, created_at desc);

-- ── packages (authoritative purchasable credit packs) ────────────────────────
create table if not exists public.packages (
  id            text primary key,
  name          text not null,
  credit_amount integer not null,
  price_cents   integer not null,
  active        boolean not null default true
);

-- ── orders ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  package_id    text references public.packages(id),
  credit_amount integer not null,
  price_cents   integer not null,
  status        text not null default 'pending',  -- pending | paid | failed
  provider      text,
  provider_ref  text,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- ── credit_transactions (ledger = source of truth) ───────────────────────────
create table if not exists public.credit_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  delta         integer not null,                 -- +grant / -spend
  reason        text not null,                    -- purchase | reading_spend | signup_bonus | admin_adjust
  reading_type  text,
  order_id      uuid references public.orders(id),
  balance_after integer not null,
  created_at    timestamptz not null default now()
);
create index if not exists credit_tx_user_idx on public.credit_transactions (user_id, created_at desc);

-- ── notifications (LINE push log) ────────────────────────────────────────────
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete cascade,
  channel      text not null default 'line_push',
  message_type text,
  payload      jsonb,
  status       text not null,                     -- sent | failed
  error        text,
  created_at   timestamptz not null default now()
);

-- ── apply_credit_delta: atomic balance update + ledger insert ────────────────
-- Prevents double-spend across concurrent Worker invocations. Raises if the
-- resulting balance would go negative.
create or replace function public.apply_credit_delta(
  p_user_id      uuid,
  p_delta        integer,
  p_reason       text,
  p_reading_type text default null,
  p_order_id     uuid default null
) returns integer
language plpgsql
as $$
declare
  v_balance integer;
begin
  update public.users
     set credits = credits + p_delta
   where id = p_user_id
   returning credits into v_balance;

  if v_balance is null then
    raise exception 'user_not_found';
  end if;
  if v_balance < 0 then
    raise exception 'insufficient_credits';
  end if;

  insert into public.credit_transactions (user_id, delta, reason, reading_type, order_id, balance_after)
  values (p_user_id, p_delta, p_reason, p_reading_type, p_order_id, v_balance);

  return v_balance;
end;
$$;

-- ── RLS: deny-all (service role bypasses) ────────────────────────────────────
alter table public.users               enable row level security;
alter table public.reading_history     enable row level security;
alter table public.packages            enable row level security;
alter table public.orders              enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.notifications       enable row level security;

-- ── seed example credit packs (edit to taste) ────────────────────────────────
insert into public.packages (id, name, credit_amount, price_cents, active) values
  ('pack_starter', 'แพ็กเริ่มต้น 10 เครดิต', 10, 5900, true),
  ('pack_value',   'แพ็กคุ้มค่า 30 เครดิต',  30, 14900, true),
  ('pack_pro',     'แพ็กโปร 100 เครดิต',     100, 39900, true)
on conflict (id) do nothing;
