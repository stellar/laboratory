// Jest globals (describe, expect, it) are available globally
import { getTokenAmountError } from "../../src/validate/methods/getTokenAmountError";

describe("getTokenAmountError", () => {
  it("accepts valid amounts", () => {
    expect(
      getTokenAmountError({ value: "5", decimals: 7, isSigned: false }),
    ).toBe(false);
    expect(
      getTokenAmountError({ value: "5.5", decimals: 7, isSigned: false }),
    ).toBe(false);
    expect(
      getTokenAmountError({ value: "0.0000001", decimals: 7, isSigned: false }),
    ).toBe(false);
    expect(
      getTokenAmountError({ value: "-5.5", decimals: 7, isSigned: true }),
    ).toBe(false);
  });

  it("treats empty as required/optional", () => {
    expect(
      getTokenAmountError({ value: "", decimals: 7, isSigned: false }),
    ).toBe(false);
    expect(
      getTokenAmountError({
        value: "",
        decimals: 7,
        isSigned: false,
        isRequired: true,
      }),
    ).toBe("This field is required.");
  });

  it("rejects negatives for unsigned (u128)", () => {
    expect(
      getTokenAmountError({ value: "-5", decimals: 7, isSigned: false }),
    ).toBeTruthy();
  });

  it("rejects too many fraction digits", () => {
    expect(
      getTokenAmountError({ value: "0.00000001", decimals: 7, isSigned: false }),
    ).toBe("This token supports at most 7 decimal places.");
    expect(
      getTokenAmountError({ value: "5.5", decimals: 0, isSigned: false }),
    ).toBe("This token supports at most 0 decimal places.");
  });

  it("uses singular copy for 1 decimal", () => {
    expect(
      getTokenAmountError({ value: "5.55", decimals: 1, isSigned: false }),
    ).toBe("This token supports at most 1 decimal place.");
  });

  it("rejects malformed input", () => {
    expect(
      getTokenAmountError({ value: "1e5", decimals: 7, isSigned: false }),
    ).toBeTruthy();
    expect(
      getTokenAmountError({ value: "abc", decimals: 7, isSigned: false }),
    ).toBeTruthy();
    expect(
      getTokenAmountError({ value: "5.", decimals: 7, isSigned: false }),
    ).toBeTruthy();
  });

  it("enforces the underlying u128 range after scaling", () => {
    // 10^39 tokens at 0 decimals exceeds u128 max (~3.4 × 10^38).
    const tooBig = "1" + "0".repeat(39);
    expect(
      getTokenAmountError({ value: tooBig, decimals: 0, isSigned: false }),
    ).toBeTruthy();
  });
});
