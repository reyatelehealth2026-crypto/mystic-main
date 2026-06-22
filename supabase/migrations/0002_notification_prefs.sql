-- REFFORTUNE — notification preferences
-- Additive, idempotent. Run via Supabase SQL editor or `supabase db push`.
-- Extends public.users with per-user daily-push opt-in settings.

alter table public.users
  add column if not exists daily_push_opt_in     boolean  not null default false,
  add column if not exists daily_push_hour        smallint not null default 8,      -- 0..23 Asia/Bangkok
  add column if not exists daily_push_last_sent_on date;                            -- idempotency: prevents double-send

-- Partial index — used by listUsersDueForDailyPush to find opted-in users per hour
-- efficiently without a full-table scan.
create index if not exists users_daily_push_idx
  on public.users (daily_push_hour)
  where daily_push_opt_in = true;

comment on column public.users.daily_push_opt_in is 'User has opted in to receive daily tarot push via LINE OA.';
comment on column public.users.daily_push_hour   is 'Hour (0–23, Asia/Bangkok) at which the daily push should be sent.';
comment on column public.users.daily_push_last_sent_on is 'Date (YYYY-MM-DD, Bangkok) of the last successful push — prevents duplicate sends within a day.';
