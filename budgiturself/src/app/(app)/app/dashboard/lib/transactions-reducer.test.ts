import { describe, expect, it } from "vitest";
import type { Transaction } from "@/lib/budget/types";
import { transactionsReducer } from "./transactions-reducer";

const entry = (id: string): Transaction => ({
  id,
  kind: "cardCharge",
  label: "Amex",
  amount: 10,
  occurredAt: new Date("2026-11-02T15:00:00Z"),
});

describe("transactionsReducer", () => {
  it("drops only the entry removed", () => {
    const result = transactionsReducer([entry("a"), entry("b")], {
      type: "removeTransaction",
      id: "a",
    });

    expect(result.map((t) => t.id)).toEqual(["b"]);
  });

  it("leaves the list alone when the id is unknown", () => {
    const transactions = [entry("a")];

    expect(transactionsReducer(transactions, { type: "removeTransaction", id: "z" })).toEqual(
      transactions,
    );
  });

  it("empties the list on clear", () => {
    expect(transactionsReducer([entry("a"), entry("b")], { type: "clearTransactions" })).toEqual(
      [],
    );
  });
});
