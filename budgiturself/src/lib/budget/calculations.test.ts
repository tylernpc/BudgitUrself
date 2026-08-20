import { describe, expect, it } from "vitest";
import { byChargeDate, creditUtilization, summarizeBudget } from "./calculations";
import type { Budget } from "./types";

const budget: Budget = {
  bankBalance: 1000,
  monthlyIncome: 4000,
  creditCards: [
    { id: "a", name: "A", balance: 200, limit: 1000 },
    { id: "b", name: "B", balance: 300, limit: 2000 },
  ],
  monthlyExpenses: [{ id: "m1", name: "Rent", amount: 1200 }],
  bills: [
    {
      id: "b1",
      name: "Late",
      amount: 20,
      chargeDate: 20,
      type: "digital",
      card: "A",
      category: "Software",
    },
    {
      id: "b2",
      name: "Early",
      amount: 10,
      chargeDate: 3,
      type: "digital",
      card: "A",
      category: "Health",
    },
    { id: "b3", name: "Gym", amount: 30, chargeDate: 5, type: "personal", owedTo: "Dad" },
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
    expect(summary.digitalBillsTotal).toBe(30);
    expect(summary.personalBillsTotal).toBe(30);
    expect(summary.monthlyBillsTotal).toBe(60);
  });

  it("treats monthly expenses plus bills as fixed expenses", () => {
    expect(summary.fixedExpensesTotal).toBe(1260);
    expect(summary.safeToSpend).toBe(2740);
  });

  it("derives the horizon view", () => {
    expect(summary.horizonView).toBe(1000 + 4000 - 500 - 1260);
  });

  it("reports a negative horizon when obligations exceed resources", () => {
    const broke = summarizeBudget({ ...budget, bankBalance: 0, monthlyIncome: 100 });
    expect(broke.horizonView).toBeLessThan(0);
  });
});

describe("byChargeDate", () => {
  it("sorts a copy without mutating the input", () => {
    const bills = budget.bills;
    expect(byChargeDate(bills).map((bill) => bill.chargeDate)).toEqual([3, 5, 20]);
    expect(bills.map((bill) => bill.chargeDate)).toEqual([20, 3, 5]);
  });
});

describe("creditUtilization", () => {
  it("returns the used fraction of the limit", () => {
    expect(creditUtilization({ balance: 250, limit: 1000 })).toBe(0.25);
  });

  it("caps at 100% and handles a missing limit", () => {
    expect(creditUtilization({ balance: 2000, limit: 1000 })).toBe(1);
    expect(creditUtilization({ balance: 100, limit: 0 })).toBe(0);
  });
});
