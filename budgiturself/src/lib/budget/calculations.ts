import type { Bill, Budget, DigitalBill, PersonalBill } from "@/lib/budget/types";

export interface BudgetSummary {
  creditCardDebt: number;
  digitalBills: DigitalBill[];
  personalBills: PersonalBill[];
  digitalBillsTotal: number;
  personalBillsTotal: number;
  monthlyBillsTotal: number;
  monthlyExpensesTotal: number;
  fixedExpensesTotal: number;
  safeToSpend: number;
  trueLiquidWealth: number;
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

export function byChargeDate<T extends Bill>(bills: readonly T[]): T[] {
  return [...bills].sort((a, b) => a.chargeDate - b.chargeDate);
}

export function summarizeBudget(budget: Budget): BudgetSummary {
  const creditCardDebt = budget.creditCards.reduce((total, card) => total + card.balance, 0);

  const digitalBills = byChargeDate(budget.bills.filter(isDigitalBill));
  const personalBills = byChargeDate(budget.bills.filter(isPersonalBill));
  const digitalBillsTotal = sum(digitalBills);
  const personalBillsTotal = sum(personalBills);
  const monthlyBillsTotal = digitalBillsTotal + personalBillsTotal;

  const monthlyExpensesTotal = sum(budget.monthlyExpenses);
  const fixedExpensesTotal = monthlyExpensesTotal + monthlyBillsTotal;

  return {
    creditCardDebt,
    digitalBills,
    personalBills,
    digitalBillsTotal,
    personalBillsTotal,
    monthlyBillsTotal,
    monthlyExpensesTotal,
    fixedExpensesTotal,
    safeToSpend: budget.monthlyIncome - fixedExpensesTotal,
    trueLiquidWealth: budget.bankBalance - creditCardDebt,
    horizonView: budget.bankBalance + budget.monthlyIncome - creditCardDebt - fixedExpensesTotal,
  };
}

export function creditUtilization(card: { balance: number; limit: number }): number {
  if (card.limit <= 0) return 0;
  return Math.min(card.balance / card.limit, 1);
}
