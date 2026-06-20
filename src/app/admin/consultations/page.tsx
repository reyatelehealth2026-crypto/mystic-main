import { redirect } from "next/navigation";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { ConsultationsClient } from "./ConsultationsClient";

export const dynamic = "force-dynamic";

export default async function ConsultationsPage() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) redirect("/login?returnTo=/admin/consultations");
    if (err instanceof ForbiddenError) redirect("/");
    throw err;
  }
  return <ConsultationsClient />;
}
