/**
 * Monthly subscription plans (แพ็กรายเดือน). Pure config so both the UI and the
 * server read the same source of truth. `monthlyQuota` = free uses per period.
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyQuota: number;
  priceCents: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: "basic", name: "แพ็กพื้นฐาน · 10 ครั้ง/เดือน", monthlyQuota: 10, priceCents: 19900 },
  { id: "premium", name: "แพ็กพรีเมียม · 30 ครั้ง/เดือน", monthlyQuota: 30, priceCents: 39900 },
  { id: "unlimited", name: "แพ็กไม่อั้น · ดูได้ไม่จำกัด", monthlyQuota: 9999, priceCents: 79900 },
];

export function getPlan(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id);
}
