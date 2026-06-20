/**
 * Pure decision logic for opening a live consultation round. No DB/IO so it is
 * unit-testable and shared by the route handler.
 */
export const CONSULTATION_CREDIT_COST = 1;

export type ConsultationStartDecision =
  | { action: "reuse" }
  | { action: "charge"; cost: number }
  | { action: "insufficient"; requiredCredits: number; currentCredits: number };

export function decideConsultationStart(params: {
  hasOpenRound: boolean;
  currentCredits: number;
  cost?: number;
}): ConsultationStartDecision {
  const cost = params.cost ?? CONSULTATION_CREDIT_COST;
  if (params.hasOpenRound) return { action: "reuse" };
  if (params.currentCredits < cost) {
    return { action: "insufficient", requiredCredits: cost, currentCredits: params.currentCredits };
  }
  return { action: "charge", cost };
}
