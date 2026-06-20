-- REFFORTUNE — admin-managed catalogs (จัดการแพ็กเกจ)
-- Move hardcoded subscription plans + per-reading credit costs into DB so the
-- หมอดู can edit them without code changes. (rewards + packages tables already exist.)

create table if not exists public.subscription_plans (
  id            text primary key,
  name          text not null,
  monthly_quota integer not null,
  price_cents   integer not null,
  active        boolean not null default true,
  sort          integer not null default 0
);

insert into public.subscription_plans (id, name, monthly_quota, price_cents, sort) values
  ('basic',     'แพ็กพื้นฐาน · 10 ครั้ง/เดือน', 10,   19900, 1),
  ('premium',   'แพ็กพรีเมียม · 30 ครั้ง/เดือน', 30,   39900, 2),
  ('unlimited', 'แพ็กไม่อั้น · ดูได้ไม่จำกัด',   9999, 79900, 3)
on conflict (id) do nothing;

-- Per-reading credit-cost overrides (admin-editable). Server enforces these;
-- the static defaults in creditCost.ts are the fallback.
create table if not exists public.service_costs (
  reading_type text primary key,
  label        text not null,
  cost_credits integer not null
);

insert into public.service_costs (reading_type, label, cost_credits) values
  ('tarot',           'ไพ่ทาโรต์',        1),
  ('spirit_card',     'ไพ่จิตวิญญาณ',     1),
  ('numerology',      'เลขศาสตร์',        1),
  ('daily_card',      'ไพ่รายวัน',        1),
  ('horoscope',       'ดวงรายวัน',        1),
  ('compatibility',   'ความเข้ากันคู่รัก', 2),
  ('chinese_zodiac',  '12 นักษัตร',       1),
  ('name_numerology', 'เลขศาสตร์ชื่อ',    2)
on conflict (reading_type) do nothing;

alter table public.subscription_plans enable row level security;
alter table public.service_costs enable row level security;
