-- REFFORTUNE — readings should consume the monthly subscription quota BEFORE
-- charging credits (previously quota only applied to live consultations, so a
-- subscriber's readings still deducted credits — the package did nothing).
--
-- Priority: free re-view (dedupe) > subscription quota > credits.
-- Atomic: dedupe insert + quota decrement + credit debit in one transaction.

-- Return type gains via_subscription, so the old function must be dropped first.
drop function if exists public.charge_reading_once(uuid, text, text, integer);

create or replace function public.charge_reading_once(
  p_user_id   uuid,
  p_client_id text,
  p_type      text,
  p_cost      integer
) returns table(charged boolean, balance integer, insufficient boolean, via_subscription boolean)
language plpgsql
as $$
declare
  v_balance integer;
begin
  insert into public.reading_history (user_id, type, client_id)
  values (p_user_id, p_type, p_client_id)
  on conflict (user_id, client_id) do nothing;

  if not found then
    -- already recorded → free re-view
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), false, false;
    return;
  end if;

  if p_cost <= 0 then
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), false, false;
    return;
  end if;

  -- Try the monthly subscription quota first (one active, in-period plan).
  update public.subscriptions
     set used_count = used_count + 1
   where id = (
     select s.id from public.subscriptions s
      where s.user_id = p_user_id
        and s.status = 'active'
        and s.period_end > now()
        and s.used_count < s.monthly_quota
      order by s.created_at desc
      limit 1
   );
  if found then
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), false, true; -- covered by package
    return;
  end if;

  -- Otherwise charge credits.
  update public.users
     set credits = credits - p_cost
   where id = p_user_id and credits >= p_cost
   returning credits into v_balance;

  if not found then
    delete from public.reading_history where user_id = p_user_id and client_id = p_client_id;
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), true, false; -- insufficient
    return;
  end if;

  insert into public.credit_transactions (user_id, delta, reason, reading_type, balance_after)
  values (p_user_id, -p_cost, 'reading_spend', p_type, v_balance);

  return query select true, v_balance, false, false;
end;
$$;
