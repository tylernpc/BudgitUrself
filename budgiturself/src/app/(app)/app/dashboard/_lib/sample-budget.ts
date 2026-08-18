import type { Budget } from "@/lib/budget/types";

/**
 * Placeholder data until budgets are persisted. Replace this with a domain
 * query (`lib/budget/queries.ts`) scoped to the signed-in user.
 */
export const sampleBudget: Budget = {
  bankBalance: 3250,
  monthlyIncome: 5200,
  creditCards: [
    { id: "card-chase", name: "Chase Sapphire", balance: 850, limit: 10_000 },
    { id: "card-amex", name: "AmEx Gold", balance: 425.5, limit: 5_000 },
    { id: "card-discover", name: "Discover It", balance: 215.75, limit: 3_000 },
  ],
  oneOffExpenses: [
    { id: "one-off-medical", name: "Medical Co-Pay", amount: 75, date: "2026-02-20" },
    { id: "one-off-car", name: "Car Maintenance", amount: 350, date: "2026-02-15" },
  ],
  monthlyExpenses: [
    { id: "monthly-housing", name: "Housing", amount: 1800 },
    { id: "monthly-utilities", name: "Utilities", amount: 150 },
  ],
  bills: [
    {
      id: "bill-netflix",
      name: "Netflix",
      amount: 15.99,
      chargeDate: 1,
      type: "digital",
      card: "Chase Sapphire",
      category: "Entertainment",
    },
    {
      id: "bill-spotify",
      name: "Spotify",
      amount: 10.99,
      chargeDate: 5,
      type: "digital",
      card: "Chase Sapphire",
      category: "Entertainment",
    },
    {
      id: "bill-adobe",
      name: "Adobe Creative Cloud",
      amount: 54.99,
      chargeDate: 10,
      type: "digital",
      card: "AmEx Gold",
      category: "Software",
    },
    {
      id: "bill-gym",
      name: "Planet Fitness",
      amount: 24.99,
      chargeDate: 15,
      type: "digital",
      card: "Discover It",
      category: "Health",
    },
    {
      id: "bill-prime",
      name: "Amazon Prime",
      amount: 14.99,
      chargeDate: 20,
      type: "digital",
      card: "Chase Sapphire",
      category: "Shopping",
    },
    {
      id: "bill-icloud",
      name: "iCloud Storage",
      amount: 2.99,
      chargeDate: 8,
      type: "digital",
      card: "Chase Sapphire",
      category: "Software",
    },
    {
      id: "bill-ymca",
      name: "YMCA Membership",
      amount: 20,
      chargeDate: 1,
      type: "personal",
      owedTo: "Dad",
    },
  ],
};
