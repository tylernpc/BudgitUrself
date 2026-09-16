import type { Bill, Budget, DigitalBill, PersonalBill, RecurringBill } from "@/lib/budget/types";

export interface BudgetSummary {
  creditCardDebt: number;
  digitalBills: DigitalBill[];
  personalBills: PersonalBill[];
  recurringBills: RecurringBill[];
  digitalBillsTotal: number;
  personalBillsTotal: number;
  recurringBillsTotal: number;
  monthlyBillsTotal: number;
  monthlyExpensesTotal: number;
  fixedExpensesTotal: number;
  safeToSpend: number;
  horizonView: number;
}

const sum = (values: readonly { amount: number }[]) =>
  values.reduce((total, value) => total + value.amount, 0);

export function isDigitalBill(bill: Bill): bill is DigitalBill {
  return bill.type === "digital";
}

export function isPersonalBill(bill: Bill): bill is PersonalBill {
  return bill.type === "personal";
}

export function isRecurringBill(bill: Bill): bill is RecurringBill {
  return bill.type === "recurring";
}

export function byChargeDate<T extends Bill>(bills: readonly T[]): T[] {
  return [...bills].sort((a, b) => a.chargeDate - b.chargeDate);
}

export function summarizeBudget(budget: Budget): BudgetSummary {
  const creditCardDebt = budget.creditCards.reduce((total, card) => total + card.balance, 0);

  const digitalBills = byChargeDate(budget.bills.filter(isDigitalBill));
  const personalBills = byChargeDate(budget.bills.filter(isPersonalBill));
  const recurringBills = byChargeDate(budget.bills.filter(isRecurringBill));
  const digitalBillsTotal = sum(digitalBills);
  const personalBillsTotal = sum(personalBills);
  const recurringBillsTotal = sum(recurringBills);
  const monthlyBillsTotal = digitalBillsTotal + personalBillsTotal + recurringBillsTotal;

  const monthlyExpensesTotal = sum(budget.monthlyExpenses);
  const fixedExpensesTotal = monthlyExpensesTotal + monthlyBillsTotal;

  return {
    creditCardDebt,
    digitalBills,
    personalBills,
    recurringBills,
    digitalBillsTotal,
    personalBillsTotal,
    recurringBillsTotal,
    monthlyBillsTotal,
    monthlyExpensesTotal,
    fixedExpensesTotal,
    safeToSpend: budget.monthlyIncome - fixedExpensesTotal,
    horizonView: budget.bankBalance + budget.monthlyIncome - creditCardDebt - fixedExpensesTotal,
  };
}

/** Shared by credit card usage and expense-contribution tracking — both are "used out of a cap." */
export function utilization(used: number, limit: number): number {
  if (limit <= 0) {
    return 0;
  }

  return Math.min(used / limit, 1);
}
