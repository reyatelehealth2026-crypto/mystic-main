import { getServiceClient } from "@/lib/supabase/server";

// ── Subscription plans (A) ───────────────────────────────────────────────────
export interface PlanRow {
  id: string;
  name: string;
  monthly_quota: number;
  price_cents: number;
  active: boolean;
  sort: number;
}

export async function listPlans(activeOnly = false): Promise<PlanRow[]> {
  const db = getServiceClient();
  let q = db.from("subscription_plans").select("*").order("sort", { ascending: true });
  if (activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data as PlanRow[]) ?? [];
}

export async function upsertPlan(p: PlanRow): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("subscription_plans").upsert(p);
  if (error) throw error;
}

export async function deletePlan(id: string): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("subscription_plans").delete().eq("id", id);
  if (error) throw error;
}

// ── Service costs (B) ────────────────────────────────────────────────────────
export interface ServiceCostRow {
  reading_type: string;
  label: string;
  cost_credits: number;
}

export async function listServiceCosts(): Promise<ServiceCostRow[]> {
  const db = getServiceClient();
  const { data, error } = await db.from("service_costs").select("*").order("label", { ascending: true });
  if (error) throw error;
  return (data as ServiceCostRow[]) ?? [];
}

export async function getServiceCost(readingType: string): Promise<number | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("service_costs")
    .select("cost_credits")
    .eq("reading_type", readingType)
    .maybeSingle();
  if (error) throw error;
  return data ? (data as { cost_credits: number }).cost_credits : null;
}

export async function upsertServiceCost(row: ServiceCostRow): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("service_costs").upsert(row);
  if (error) throw error;
}

// ── Rewards admin (C) — reuse public.rewards ─────────────────────────────────
export interface RewardAdminRow {
  id?: string;
  name: string;
  description: string | null;
  cost_credits: number;
  active: boolean;
}

export async function listAllRewards(): Promise<Required<RewardAdminRow>[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("rewards")
    .select("id, name, description, cost_credits, active")
    .order("cost_credits", { ascending: true });
  if (error) throw error;
  return (data as Required<RewardAdminRow>[]) ?? [];
}

export async function upsertReward(row: RewardAdminRow): Promise<void> {
  const db = getServiceClient();
  const payload = row.id ? row : { name: row.name, description: row.description, cost_credits: row.cost_credits, active: row.active };
  const { error } = await db.from("rewards").upsert(payload);
  if (error) throw error;
}

export async function deleteReward(id: string): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("rewards").delete().eq("id", id);
  if (error) throw error;
}

// ── Credit packs (D) — reuse public.packages ─────────────────────────────────
export interface PackRow {
  id: string;
  name: string;
  credit_amount: number;
  price_cents: number;
  active: boolean;
}

export async function listPacks(): Promise<PackRow[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("packages")
    .select("id, name, credit_amount, price_cents, active")
    .order("price_cents", { ascending: true });
  if (error) throw error;
  return (data as PackRow[]) ?? [];
}

export async function upsertPack(row: PackRow): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("packages").upsert(row);
  if (error) throw error;
}

export async function deletePack(id: string): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("packages").delete().eq("id", id);
  if (error) throw error;
}
