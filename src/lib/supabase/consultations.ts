import { getServiceClient } from "@/lib/supabase/server";
import type { ConsultationRow } from "@/lib/supabase/types";

export async function getOpenConsultationForUser(userId: string): Promise<ConsultationRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "open")
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as ConsultationRow) ?? null;
}

export async function openConsultation(userId: string, cost: number): Promise<ConsultationRow> {
  const db = getServiceClient();
  // Atomic deduct first; raises 'insufficient_credits' if balance would go negative.
  const { error: rpcError } = await db.rpc("apply_credit_delta", {
    p_user_id: userId,
    p_delta: -cost,
    p_reason: "consultation_spend",
  });
  if (rpcError) throw rpcError;

  const { data, error } = await db
    .from("consultations")
    .insert({ user_id: userId, credits_spent: cost, status: "open" })
    .select("*")
    .single();
  if (error) throw error;
  return data as ConsultationRow;
}

export interface OpenConsultationView {
  id: string;
  credits_spent: number;
  opened_at: string;
  user: { id: string; display_name: string | null; line_user_id: string; picture_url: string | null };
}

export async function listOpenConsultations(): Promise<OpenConsultationView[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .select("id, credits_spent, opened_at, users:user_id (id, display_name, line_user_id, picture_url)")
    .eq("status", "open")
    .order("opened_at", { ascending: true });
  if (error) throw error;
  return ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => ({
    id: r.id as string,
    credits_spent: r.credits_spent as number,
    opened_at: r.opened_at as string,
    user: r.users as OpenConsultationView["user"],
  }));
}

export async function closeConsultation(
  id: string,
  closedByLineId: string,
): Promise<ConsultationRow | null> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("consultations")
    .update({ status: "closed", closed_at: new Date().toISOString(), closed_by: closedByLineId })
    .eq("id", id)
    .eq("status", "open")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as ConsultationRow) ?? null;
}
