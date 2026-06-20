-- REFFORTUNE — rewards catalog + redemptions (แลกของรางวัลด้วยแต้ม)

create table if not exists public.rewards (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  cost_credits integer not null,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.reward_redemptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  reward_id    uuid not null references public.rewards(id),
  cost_credits integer not null,
  status       text not null default 'pending',   -- 'pending' | 'fulfilled'
  created_at   timestamptz not null default now()
);
create index if not exists reward_redemptions_user_idx
  on public.reward_redemptions (user_id, created_at desc);

alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
-- deny-all: service-role only.

-- seed a starter catalog (edit to taste)
insert into public.rewards (name, description, cost_credits, active) values
  ('ดูดวงเชิงลึกฟรี 1 ครั้ง', 'แลกแต้มเป็นการดูดวงเชิงลึกพิเศษ', 50, true),
  ('คูปองส่วนลด 10%', 'ส่วนลดสำหรับเติมแต้มครั้งถัดไป', 100, true),
  ('ปรึกษาหมอดูสด 1 รอบ', 'แลกแต้มเป็นรอบปรึกษาหมอดูสด', 150, true)
on conflict do nothing;
