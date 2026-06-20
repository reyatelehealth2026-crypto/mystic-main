import { getServiceClient } from "@/lib/supabase/server";
import type { ReadingHistoryRow } from "@/lib/supabase/types";

export interface ReadingHistoryInput {
  type: string;
  summary?: string | null;
  details?: Record<string, unknown> | null;
  clientId?: string | null;
  createdAt?: string | null;
}

/**
 * Idempotent upsert of reading-history items for a user. Dedup key is
 * `(user_id, client_id)` so re-running the localStorage sync never duplicates.
 */
export async function syncReadingHistory(
  userId: string,
  items: ReadingHistoryInput[],
): Promise<number> {
  if (!items.length) return 0;
  const db = getServiceClient();
  const rows = items.map((item) => ({
    user_id: userId,
    type: item.type,
    summary: item.summary ?? null,
    details: item.details ?? null,
    client_id: item.clientId ?? null,
    ...(item.createdAt ? { created_at: item.createdAt } : {}),
  }));

  const { data, error } = await db
    .from("reading_history")
    .upsert(rows, { onConflict: "user_id,client_id", ignoreDuplicates: true })
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function recordReading(
  userId: string,
  item: ReadingHistoryInput,
): Promise<void> {
  const db = getServiceClient();
  const { error } = await db.from("reading_history").insert({
    user_id: userId,
    type: item.type,
    summary: item.summary ?? null,
    details: item.details ?? null,
    client_id: item.clientId ?? null,
  });
  if (error) throw error;
}

export async function listReadingHistory(
  userId: string,
  limit = 100,
): Promise<ReadingHistoryRow[]> {
  const db = getServiceClient();
  const { data, error } = await db
    .from("reading_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as ReadingHistoryRow[]) ?? [];
}
