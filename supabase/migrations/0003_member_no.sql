-- REFFORTUNE — membership numbers (บัตรสมาชิก)
-- Sequential, human-friendly member id shown on the membership card (e.g. 000667).

create sequence if not exists public.member_no_seq;

alter table public.users add column if not exists member_no bigint;

-- Backfill existing users in creation order.
update public.users
   set member_no = nextval('public.member_no_seq')
 where member_no is null;

-- New users get the next number automatically.
alter table public.users
  alter column member_no set default nextval('public.member_no_seq');
