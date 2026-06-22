-- REFFORTUNE — make the live-consultation cost admin-editable (จัดการแพ็กเกจ → B)
insert into public.service_costs (reading_type, label, cost_credits) values
  ('consultation', 'ปรึกษาหมอดูสด (ต่อรอบ)', 1)
on conflict (reading_type) do nothing;
