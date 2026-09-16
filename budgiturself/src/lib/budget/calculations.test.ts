import { describe, expect, it } from "vitest";
import { byChargeDate, summarizeBudget, utilization } from "./calculations";
import type { Budget } from "./types";

const budget: Budget = {
  bankBalance: 1000,
  monthlyIncome: 4000,
  creditCards: [
    { id: "a", name: "A", balance: 200, limit: 1000 },
    { id: "b", name: "B", balance: 300, limit: 2000 },
  ],
  monthlyExpenses: [
    { id: "m1", name: "Rent", amount: 1200, spent: 0, icon: "home", color: "violet" },
  ],
  bills: [
    {
      id: "b1",
      name: "Late",
      amount: 20,
      chargeDate: 20,
      type: "digital",
      cardId: "a",
      category: "Software",
    },
    {
      id: "b2",
      name: "Early",
      amount: 10,
      chargeDate: 3,
      type: "digital",
      cardId: "a",
      category: "Health",
    },
    { id: "b3", name: "Gym", amount: 30, chargeDate: 5, type: "personal", owedTo: "Dad" },
    { id: "b4", name: "Rent", amount: 500, chargeDate: 1, type: "recurring" },
  ],
};

describe("summarizeBudget", () => {
  const summary = summarizeBudget(budget);

  it("totals credit card debt", () => {
    expect(summary.creditCardDebt).toBe(500);
  });

  it("splits bills by type and totals them", () => {
    expect(summary.digitalBills.map((bill) => bill.id)).toEqual(["b2", "b1"]);
    expect(summary.personalBills.map((bill) => bill.id)).toEqual(["b3"]);
    expect(summary.recurringBills.map((bill) => bill.id)).toEqual(["b4"]);
    expect(summary.digitalBillsTotal).toBe(30);
    expect(summary.personalBillsTotal).toBe(30);
    expect(summary.recurringBillsTotal).toBe(500);
    expect(summary.monthlyBillsTotal).toBe(560);
  });

  it("treats monthly expenses plus bills as fixed expenses", () => {
    expect(summary.fixedExpensesTotal).toBe(1760);
    expect(summary.safeToSpend).toBe(2240);
  });

  it("derives the horizon view", () => {
    expect(summary.horizonView).toBe(1000 + 4000 - 500 - 1760);
  });

  it("reports a negative horizon when obligations exceed resources", () => {
    const broke = summarizeBudget({ ...budget, bankBalance: 0, monthlyIncome: 100 });
    expect(broke.horizonView).toBeLessThan(0);
  });
});

describe("byChargeDate", () => {
  it("sorts a copy without mutating the input", () => {
    const bills = budget.bills;
    expect(byChargeDate(bills).map((bill) => bill.chargeDate)).toEqual([1, 3, 5, 20]);
    expect(bills.map((bill) => bill.chargeDate)).toEqual([20, 3, 5, 1]);
  });
});

describe("utilization", () => {
  it("returns the used fraction of the limit", () => {
    expect(utilization(250, 1000)).toBe(0.25);
  });

  it("caps at 100% and handles a missing limit", () => {
    expect(utilization(2000, 1000)).toBe(1);
    expect(utilization(100, 0)).toBe(0);
  });
});
