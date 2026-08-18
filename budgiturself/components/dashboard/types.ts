export interface CreditCard {
  id: string;
  name: string;
  balance: number;
  limit: number;
  color: string;
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

export interface Bill {
  id: string;
  name: string;
  amount: number;
  chargeDate: number;
  type: BillType;
  card?: string;
  category?: string;
  owedTo?: string;
}
