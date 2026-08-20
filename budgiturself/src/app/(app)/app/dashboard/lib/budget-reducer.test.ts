import { describe, expect, it } from "vitest";
import { budgetReducer } from "./budget-reducer";
import type { Budget } from "@/lib/budget/types";

const budget: Budget = {
  bankBalance: 1000,
  monthlyIncome: 4000,
  creditCards: [{ id: "a", name: "A", balance: 200, limit: 1000 }],
  monthlyExpenses: [{ id: "m1", name: "Rent", amount: 1200, icon: "home" }],
  bills: [{ id: "b1", name: "Gym", amount: 20, chargeDate: 5, type: "personal", owedTo: "Dad" }],
};

describe("budgetReducer", () => {
  it("sets bank balance and monthly income", () => {
    expect(budgetReducer(budget, { type: "setBankBalance", bankBalance: 500 }).bankBalance).toBe(
      500,
    );
    expect(
      budgetReducer(budget, { type: "setMonthlyIncome", monthlyIncome: 5000 }).monthlyIncome,
    ).toBe(5000);
  });

  it("adds, updates, charges and removes a credit card", () => {
    const added = budgetReducer(budget, {
      type: "addCreditCard",
      id: "new",
      input: { name: "B", balance: 0, limit: 500 },
    });
    expect(added.creditCards.map((c) => c.id)).toEqual(["a", "new"]);

    const updated = budgetReducer(budget, {
      type: "updateCreditCard",
      input: { id: "a", name: "A", balance: 999, limit: 1000 },
    });
    expect(updated.creditCards[0]?.balance).toBe(999);

    const charged = budgetReducer(budget, {
      type: "addCreditCardCharge",
      id: "a",
      amount: 50,
    });
    expect(charged.creditCards[0]?.balance).toBe(250);

    const removed = budgetReducer(budget, { type: "removeCreditCard", id: "a" });
    expect(removed.creditCards).toEqual([]);
  });

  it("adds, updates and removes a monthly expense", () => {
    const added = budgetReducer(budget, {
      type: "addMonthlyExpense",
      id: "new",
      input: { name: "Groceries", amount: 300, icon: "shopping-bag" },
    });
    expect(added.monthlyExpenses.map((e) => e.id)).toEqual(["m1", "new"]);

    const updated = budgetReducer(budget, {
      type: "updateMonthlyExpense",
      input: { id: "m1", name: "Rent", amount: 1250, icon: "home" },
    });
    expect(updated.monthlyExpenses[0]?.amount).toBe(1250);

    const removed = budgetReducer(budget, { type: "removeMonthlyExpense", id: "m1" });
    expect(removed.monthlyExpenses).toEqual([]);
  });

  it("adds, updates and removes a bill", () => {
    const added = budgetReducer(budget, {
      type: "addBill",
      id: "new",
      input: {
        name: "Netflix",
        amount: 15,
        chargeDate: 10,
        type: "digital",
        card: "A",
        category: "Entertainment",
      },
    });
    expect(added.bills.map((b) => b.id)).toEqual(["b1", "new"]);

    const updated = budgetReducer(budget, {
      type: "updateBill",
      input: { id: "b1", name: "Gym", amount: 25, chargeDate: 5, type: "personal", owedTo: "Dad" },
    });
    expect(updated.bills[0]?.amount).toBe(25);

    const removed = budgetReducer(budget, { type: "removeBill", id: "b1" });
    expect(removed.bills).toEqual([]);
  });

  it("leaves the rest of the budget untouched", () => {
    const result = budgetReducer(budget, { type: "setBankBalance", bankBalance: 1 });
    expect(result.creditCards).toBe(budget.creditCards);
    expect(result.monthlyExpenses).toBe(budget.monthlyExpenses);
    expect(result.bills).toBe(budget.bills);
  });
});
