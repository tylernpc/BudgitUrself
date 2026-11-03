import { describe, expect, it } from "vitest";
import { TRANSACTION_KIND_LABELS, transactionAmount } from "@/lib/budget/transaction-log";
import { TRANSACTION_KINDS } from "@/lib/budget/types";

describe("transactionAmount", () => {
  it("signs the kinds where cash actually moved", () => {
    expect(transactionAmount("cardCharge")).toEqual({ tone: "spend", prefix: "−" });
    expect(transactionAmount("expenseSpend")).toEqual({ tone: "spend", prefix: "−" });
  });

  /**
   * These two store the new absolute figure, so a sign would assert a delta
   * the app never computed — "+$2,400.00" on a balance correction reads as
   * income arriving.
   */
  it("leaves restatements unsigned and untinted", () => {
    expect(transactionAmount("bankAdjust")).toEqual({ tone: "neutral", prefix: "" });
    expect(transactionAmount("incomeAdjust")).toEqual({ tone: "neutral", prefix: "" });
  });

  it("tints obligations by direction but does not sign them", () => {
    expect(transactionAmount("billAdded")).toEqual({ tone: "spend", prefix: "" });
    expect(transactionAmount("billRemoved")).toEqual({ tone: "credit", prefix: "" });
  });

  it("covers every kind", () => {
    for (const kind of TRANSACTION_KINDS) {
      expect(TRANSACTION_KIND_LABELS[kind]).toBeTruthy();
      expect(transactionAmount(kind)).toBeDefined();
    }
  });
});
