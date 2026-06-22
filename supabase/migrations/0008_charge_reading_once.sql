-- REFFORTUNE — atomic "charge once per reading" to fix TOCTOU double-charge.
-- Inserts the dedupe row (unique on user_id, client_id) and only debits credits
-- when the insert actually created a new row. Concurrent identical requests can
-- therefore charge AT MOST once. Refunds nothing because it never over-charges.

create or replace function public.charge_reading_once(
  p_user_id   uuid,
  p_client_id text,
  p_type      text,
  p_cost      integer
) returns table(charged boolean, balance integer, insufficient boolean)
language plpgsql
as $$
declare
  v_balance integer;
begin
  insert into public.reading_history (user_id, type, client_id)
  values (p_user_id, p_type, p_client_id)
  on conflict (user_id, client_id) do nothing;

  if not found then
    -- already recorded → free re-view, no charge
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), false;
    return;
  end if;

  if p_cost <= 0 then
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), false;
    return;
  end if;

  update public.users
     set credits = credits - p_cost
   where id = p_user_id and credits >= p_cost
   returning credits into v_balance;

  if not found then
    -- insufficient balance → undo the dedupe insert so it can be retried/paid later
    delete from public.reading_history where user_id = p_user_id and client_id = p_client_id;
    select u.credits into v_balance from public.users u where u.id = p_user_id;
    return query select false, coalesce(v_balance, 0), true;
    return;
  end if;

  insert into public.credit_transactions (user_id, delta, reason, reading_type, balance_after)
  values (p_user_id, -p_cost, 'reading_spend', p_type, v_balance);

  return query select true, v_balance, false;
end;
$$;
