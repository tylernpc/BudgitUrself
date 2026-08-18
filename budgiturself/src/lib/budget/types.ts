export interface CreditCard {
  id: string;
  name: string;
  balance: number;
  limit: number;
}

export interface OneOffExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
}

export type BillType = "digital" | "personal";

interface BillBase {
  id: string;
  name: string;
  amount: number;
  chargeDate: number;
}

export interface DigitalBill extends BillBase {
  type: "digital";
  card: string;
  category: string;
}

export interface PersonalBill extends BillBase {
  type: "personal";
  owedTo: string;
}

export type Bill = DigitalBill | PersonalBill;

/** `Omit` collapses a union into its common members; this preserves each member. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export interface Budget {
  bankBalance: number;
  monthlyIncome: number;
  creditCards: CreditCard[];
  oneOffExpenses: OneOffExpense[];
  monthlyExpenses: MonthlyExpense[];
  bills: Bill[];
}
