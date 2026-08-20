import "server-only";

import type { Prisma } from "@prisma/client";
import type {
  Bill as BillRow,
  BillType as BillTypeRow,
  CreditCard as CreditCardRow,
  MonthlyExpense as MonthlyExpenseRow,
  OneOffExpense as OneOffExpenseRow,
} from "@prisma/client";
import type {
  BillInput,
  BillUpdateInput,
  CreditCardInput,
  CreditCardUpdateInput,
  MonthlyExpenseInput,
  OneOffExpenseInput,
} from "@/lib/budget/schemas";
import type { Bill, Budget, CreditCard, MonthlyExpense, OneOffExpense } from "@/lib/budget/types";

/**
 * Explicit, two-way mapping between Prisma's generated row shapes and the
 * pure domain entities in `@/lib/budget/types`. This is the *only* file (with
 * `prisma-budget-repository.ts`) allowed to import `@prisma/client` types.
 * Nothing here is re-exported, so a schema-generator change can never widen
 * into a breaking change for a Server/Client Component.
 */

// ---------------------------------------------------------------------------
// Database row -> Domain entity
// ---------------------------------------------------------------------------

export function toDomainCreditCard(row: CreditCardRow): CreditCard {
  return {
    id: row.id,
    name: row.name,
    balance: row.balance.toNumber(),
    limit: row.limit.toNumber(),
  };
}

export function toDomainOneOffExpense(row: OneOffExpenseRow): OneOffExpense {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount.toNumber(),
    // `date` is a Postgres DATE column read back as UTC midnight; slicing the
    // ISO string avoids re-deriving it through a local-timezone-sensitive API.
    date: row.date.toISOString().slice(0, 10),
  };
}

export function toDomainMonthlyExpense(row: MonthlyExpenseRow): MonthlyExpense {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount.toNumber(),
  };
}

/**
 * Prisma has no discriminated-union column type, so a `Bill` row carries all
 * of `card` / `category` / `owedTo` as nullable columns. The DB enforces the
 * pairing via a CHECK constraint (see the migration); this function re-checks
 * it at the boundary so a malformed row fails loudly here instead of handing
 * the UI a `Bill` that satisfies neither branch of the domain union.
 */
export function toDomainBill(row: BillRow): Bill {
  const base = {
    id: row.id,
    name: row.name,
    amount: row.amount.toNumber(),
    chargeDate: row.chargeDate,
  };

  if (row.type === "DIGITAL") {
    if (row.card === null || row.category === null) {
      throw new Error(`Bill ${row.id} is DIGITAL but missing card/category`);
    }
    return { ...base, type: "digital", card: row.card, category: row.category };
  }

  if (row.owedTo === null) {
    throw new Error(`Bill ${row.id} is PERSONAL but missing owedTo`);
  }
  return { ...base, type: "personal", owedTo: row.owedTo };
}

/** Shape returned by `db.user.findUniqueOrThrow` with the budget `select`, see prisma-budget-repository.ts. */
export interface BudgetRow {
  bankBalance: Prisma.Decimal;
  monthlyIncome: Prisma.Decimal;
  creditCards: CreditCardRow[];
  oneOffExpenses: OneOffExpenseRow[];
  monthlyExpenses: MonthlyExpenseRow[];
  bills: BillRow[];
}

export function toDomainBudget(row: BudgetRow): Budget {
  return {
    bankBalance: row.bankBalance.toNumber(),
    monthlyIncome: row.monthlyIncome.toNumber(),
    creditCards: row.creditCards.map(toDomainCreditCard),
    oneOffExpenses: row.oneOffExpenses.map(toDomainOneOffExpense),
    monthlyExpenses: row.monthlyExpenses.map(toDomainMonthlyExpense),
    bills: row.bills.map(toDomainBill),
  };
}

// ---------------------------------------------------------------------------
// Domain input -> Prisma write payload
// ---------------------------------------------------------------------------

export function toCreditCardCreateData(
  userId: string,
  input: CreditCardInput,
): Prisma.CreditCardUncheckedCreateInput {
  return { userId, name: input.name, balance: input.balance, limit: input.limit };
}

export function toCreditCardUpdateData(
  input: CreditCardUpdateInput,
): Prisma.CreditCardUncheckedUpdateInput {
  return { balance: input.balance, limit: input.limit };
}

export function toOneOffExpenseCreateData(
  userId: string,
  input: OneOffExpenseInput,
): Prisma.OneOffExpenseUncheckedCreateInput {
  return {
    userId,
    name: input.name,
    amount: input.amount,
    // Mirrors formatIsoDate's convention: pin the date-only string to UTC
    // midnight explicitly so it never drifts a day under a local timezone.
    date: new Date(`${input.date}T00:00:00Z`),
  };
}

export function toMonthlyExpenseCreateData(
  userId: string,
  input: MonthlyExpenseInput,
): Prisma.MonthlyExpenseUncheckedCreateInput {
  return { userId, name: input.name, amount: input.amount };
}

const billTypeToRow: Record<Bill["type"], BillTypeRow> = {
  digital: "DIGITAL",
  personal: "PERSONAL",
};

/**
 * The branch columns are always written as a pair: the active branch set, the
 * other explicitly nulled. `Bill_type_fields_check` rejects any row where a
 * leftover `card` or `owedTo` survives a change of type.
 */
function toBillColumns(input: BillInput) {
  const base = {
    name: input.name,
    amount: input.amount,
    chargeDate: input.chargeDate,
    type: billTypeToRow[input.type],
  };

  return input.type === "digital"
    ? { ...base, card: input.card, category: input.category, owedTo: null }
    : { ...base, owedTo: input.owedTo, card: null, category: null };
}

export function toBillCreateData(
  userId: string,
  input: BillInput,
): Prisma.BillUncheckedCreateInput {
  return { userId, ...toBillColumns(input) };
}

export function toBillUpdateData({
  id: _id,
  ...input
}: BillUpdateInput): Prisma.BillUncheckedUpdateInput {
  return toBillColumns(input);
}
