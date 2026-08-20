import { describe, expect, it } from "vitest";
import { toBillCreateData, toBillUpdateData } from "@/lib/budget/mappers";

/**
 * `Bill_type_fields_check` rejects any row that carries columns from both
 * branches, so changing a bill's type has to null the branch it left behind.
 */
describe("bill column mapping", () => {
  it("writes the digital branch and clears the personal one", () => {
    const data = toBillUpdateData({
      id: "bill-1",
      type: "digital",
      name: "Apple One",
      amount: 25.95,
      chargeDate: 12,
      card: "Amex Gold",
      category: "Entertainment",
    });

    expect(data).toEqual({
      type: "DIGITAL",
      name: "Apple One",
      amount: 25.95,
      chargeDate: 12,
      card: "Amex Gold",
      category: "Entertainment",
      owedTo: null,
    });
  });

  it("writes the personal branch and clears the digital one", () => {
    const data = toBillUpdateData({
      id: "bill-2",
      type: "personal",
      name: "YMCA",
      amount: 20,
      chargeDate: 1,
      owedTo: "Dad",
    });

    expect(data).toEqual({
      type: "PERSONAL",
      name: "YMCA",
      amount: 20,
      chargeDate: 1,
      owedTo: "Dad",
      card: null,
      category: null,
    });
  });

  it("never writes the row id as a column", () => {
    const data = toBillUpdateData({
      id: "bill-3",
      type: "personal",
      name: "Phone",
      amount: 35,
      chargeDate: 8,
      owedTo: "Mom",
    });

    expect(data).not.toHaveProperty("id");
  });

  it("creates and updates through the same column mapping", () => {
    const bill = {
      type: "digital",
      name: "Spotify",
      amount: 11.99,
      chargeDate: 3,
      card: "Amex Gold",
      category: "Entertainment",
    } as const;

    const { userId, ...created } = toBillCreateData("user-1", bill);
    expect(userId).toBe("user-1");
    expect(created).toEqual(toBillUpdateData({ ...bill, id: "bill-4" }));
  });
});
