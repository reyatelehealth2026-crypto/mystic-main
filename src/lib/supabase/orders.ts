import { getServiceClient } from "@/lib/supabase/server";
import { grantCredits } from "@/lib/supabase/credits";
import { getUserById } from "@/lib/supabase/users";
import { sendPurchaseConfirmation } from "@/lib/line/messaging";
import type { OrderRow, PackageRow } from "@/lib/supabase/types";

export async function listPackages(activeOnly = true): Promise<PackageRow[]> {
  const db = getServiceClient();
  let query = db.from("packages").select("*").order("price_cents", { ascending: true });
  if (activeOnly) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as PackageRow[]) ?? [];
}

export async function createOrder(params: {
  userId: string;
  packageId: string;
  provider?: string;
  providerRef?: string;
}): Promise<OrderRow> {
  const db = getServiceClient();
  const { data: pkg, error: pkgErr } = await db
    .from("packages")
    .select("*")
    .eq("id", params.packageId)
    .eq("active", true)
    .single();
  if (pkgErr) throw pkgErr;
  const pack = pkg as PackageRow;

  const { data, error } = await db
    .from("orders")
    .insert({
      user_id: params.userId,
      package_id: pack.id,
      credit_amount: pack.credit_amount,
      price_cents: pack.price_cents,
      status: "pending",
      provider: params.provider ?? null,
      provider_ref: params.providerRef ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as OrderRow;
}

/**
 * Mark an order paid: grants credits via the ledger and fires a LINE push
 * confirmation. Idempotent — a non-pending order is returned unchanged.
 */
export async function markOrderPaid(orderId: string): Promise<OrderRow> {
  const db = getServiceClient();
  const { data: order, error } = await db.from("orders").select("*").eq("id", orderId).single();
  if (error) throw error;
  const row = order as OrderRow;
  if (row.status === "paid") return row;

  const { data: updated, error: updErr } = await db
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("*")
    .single();
  if (updErr) throw updErr;
  const paid = updated as OrderRow;

  await grantCredits(paid.user_id, paid.credit_amount, "purchase", paid.id);

  const user = await getUserById(paid.user_id);
  if (user) {
    await sendPurchaseConfirmation(user.line_user_id, paid.credit_amount, user.id);
  }
  return paid;
}
