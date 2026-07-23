// Jest globals (describe, expect, it) are available globally
import {
  tokenAmountToBaseUnits,
  baseUnitsToTokenAmount,
} from "../../src/helpers/tokenAmount";

describe("tokenAmountToBaseUnits", () => {
  it("scales a whole number", () => {
    expect(tokenAmountToBaseUnits("5", 7)).toBe("50000000");
    expect(tokenAmountToBaseUnits("5", 8)).toBe("500000000"); // SolvBTC
    expect(tokenAmountToBaseUnits("5", 18)).toBe("5000000000000000000"); // deJAAA
  });

  it("scales a fractional number", () => {
    expect(tokenAmountToBaseUnits("5.5", 7)).toBe("55000000");
    expect(tokenAmountToBaseUnits("0.5", 7)).toBe("5000000");
    expect(tokenAmountToBaseUnits("0.0000001", 7)).toBe("1");
  });

  it("handles zero and zero-ish values", () => {
    expect(tokenAmountToBaseUnits("0", 7)).toBe("0");
    expect(tokenAmountToBaseUnits("0.0", 7)).toBe("0");
    expect(tokenAmountToBaseUnits("-0", 7)).toBe("0");
    expect(tokenAmountToBaseUnits("0", 0)).toBe("0");
  });

  it("preserves negatives (i128 amounts)", () => {
    expect(tokenAmountToBaseUnits("-5.5", 7)).toBe("-55000000");
    expect(tokenAmountToBaseUnits("-0.0000001", 7)).toBe("-1");
  });

  it("handles 0 and 38 decimals", () => {
    expect(tokenAmountToBaseUnits("5", 0)).toBe("5");
    expect(tokenAmountToBaseUnits("1", 38)).toBe(`1${"0".repeat(38)}`);
  });

  it("throws when fraction digits exceed decimals", () => {
    expect(() => tokenAmountToBaseUnits("0.00000001", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits("5.5", 0)).toThrow();
  });

  it("rejects malformed input (no exponent/hex/empty)", () => {
    expect(() => tokenAmountToBaseUnits("1e5", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits("0x10", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits("", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits(".", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits("5.", 7)).toThrow();
    expect(() => tokenAmountToBaseUnits("abc", 7)).toThrow();
  });

  it("rejects out-of-range decimals", () => {
    expect(() => tokenAmountToBaseUnits("5", -1)).toThrow();
    expect(() => tokenAmountToBaseUnits("5", 39)).toThrow();
  });
});

describe("baseUnitsToTokenAmount", () => {
  it("converts whole token values", () => {
    expect(baseUnitsToTokenAmount("50000000", 7)).toBe("5");
    expect(baseUnitsToTokenAmount("500000000", 8)).toBe("5");
    expect(baseUnitsToTokenAmount("5000000000000000000", 18)).toBe("5");
  });

  it("converts fractional values and trims trailing zeros", () => {
    expect(baseUnitsToTokenAmount("55000000", 7)).toBe("5.5");
    expect(baseUnitsToTokenAmount("5000000", 7)).toBe("0.5");
    expect(baseUnitsToTokenAmount("1", 7)).toBe("0.0000001");
  });

  it("handles zero", () => {
    expect(baseUnitsToTokenAmount("0", 7)).toBe("0");
    expect(baseUnitsToTokenAmount("0", 0)).toBe("0");
  });

  it("handles negatives", () => {
    expect(baseUnitsToTokenAmount("-55000000", 7)).toBe("-5.5");
    expect(baseUnitsToTokenAmount("-1", 7)).toBe("-0.0000001");
  });

  it("handles 0 decimals as identity", () => {
    expect(baseUnitsToTokenAmount("500", 0)).toBe("500");
  });

  it("round-trips with tokenAmountToBaseUnits", () => {
    const cases: Array<[string, number]> = [
      ["5.5", 7],
      ["0.0000001", 7],
      ["12345.6789", 18],
      ["-9.99", 8],
      ["1000000", 6],
    ];
    for (const [amount, decimals] of cases) {
      const raw = tokenAmountToBaseUnits(amount, decimals);
      expect(baseUnitsToTokenAmount(raw, decimals)).toBe(amount);
    }
  });

  it("rejects malformed base-unit input", () => {
    expect(() => baseUnitsToTokenAmount("5.5", 7)).toThrow();
    expect(() => baseUnitsToTokenAmount("abc", 7)).toThrow();
    expect(() => baseUnitsToTokenAmount("", 7)).toThrow();
  });
});
