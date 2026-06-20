import { describe, it, expect } from "vitest";
import { CONSULTATION_CREDIT_COST, decideConsultationStart } from "./policy";

describe("decideConsultationStart", () => {
  it("reuses an existing open round without charging", () => {
    expect(decideConsultationStart({ hasOpenRound: true, currentCredits: 0 })).toEqual({
      action: "reuse",
    });
  });

  it("charges when no open round and enough credits", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 5 })).toEqual({
      action: "charge",
      cost: CONSULTATION_CREDIT_COST,
    });
  });

  it("blocks when credits are below cost", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 0 })).toEqual({
      action: "insufficient",
      requiredCredits: CONSULTATION_CREDIT_COST,
      currentCredits: 0,
    });
  });

  it("honors a custom cost", () => {
    expect(decideConsultationStart({ hasOpenRound: false, currentCredits: 2, cost: 3 })).toEqual({
      action: "insufficient",
      requiredCredits: 3,
      currentCredits: 2,
    });
  });
});
