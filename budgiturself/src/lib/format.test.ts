import { describe, expect, it } from "vitest";
import { formatCurrency, formatDayOfMonth, formatIsoDate, formatPercent } from "./format";

describe("formatCurrency", () => {
  it("formats to two decimal places with a symbol", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(-20)).toBe("-$20.00");
  });
});

describe("formatDayOfMonth", () => {
  it("uses the correct ordinal suffix", () => {
    expect(formatDayOfMonth(1)).toBe("1st");
    expect(formatDayOfMonth(2)).toBe("2nd");
    expect(formatDayOfMonth(3)).toBe("3rd");
    expect(formatDayOfMonth(4)).toBe("4th");
  });

  it("handles the teens and the second decade", () => {
    expect(formatDayOfMonth(11)).toBe("11th");
    expect(formatDayOfMonth(12)).toBe("12th");
    expect(formatDayOfMonth(13)).toBe("13th");
    expect(formatDayOfMonth(21)).toBe("21st");
    expect(formatDayOfMonth(22)).toBe("22nd");
    expect(formatDayOfMonth(23)).toBe("23rd");
    expect(formatDayOfMonth(31)).toBe("31st");
  });
});

describe("formatIsoDate", () => {
  it("keeps the calendar date regardless of local timezone", () => {
    expect(formatIsoDate("2026-02-20")).toBe("Feb 20, 2026");
  });

  it("passes through values it cannot parse", () => {
    expect(formatIsoDate("not-a-date")).toBe("not-a-date");
  });
});

describe("formatPercent", () => {
  it("rounds a fraction to a whole percentage", () => {
    expect(formatPercent(0.256)).toBe("26%");
  });
});
