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

export interface Bill {
  id: string;
  name: string;
  amount: number;
  chargeDate: number;
  card: string;
  category: string;
}
