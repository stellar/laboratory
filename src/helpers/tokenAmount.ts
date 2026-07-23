/**
 * Pure BigInt string math for converting between human-readable token amounts
 * and raw base-unit integers, given a token's `decimals`.
 *
 * No floats are used anywhere — `parseFloat`/`Number` would lose precision on
 * large values (e.g. an 18-decimal token), so everything is string/BigInt math.
 *
 * Example: a token with 7 decimals represents 5 tokens as the base-unit integer
 * `50000000` (5 × 10^7). SolvBTC (8 decimals) → `500000000`; an 18-decimal
 * token → `5000000000000000000`.
 */

const DECIMAL_STRING_PATTERN = /^-?(\d+)(\.\d+)?$/;

/**
 * Convert a human-readable decimal token amount into its raw base-unit integer
 * string.
 *
 * @param amount - Decimal string as typed by the user, e.g. `"5.5"`. May be
 *   negative (for i128 amounts). Must not use exponent/hex notation.
 * @param decimals - Number of decimals the token uses (0–38).
 * @returns The raw base-unit integer as a string, e.g. `tokenAmountToBaseUnits("5.5", 7)` → `"55000000"`.
 * @throws If `amount` is not a plain decimal string, if it has more fraction
 *   digits than `decimals`, or if `decimals` is out of range.
 */
export const tokenAmountToBaseUnits = (
  amount: string,
  decimals: number,
): string => {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 38) {
    throw new Error(`Invalid decimals: ${decimals}`);
  }

  const trimmed = amount.trim();

  if (!DECIMAL_STRING_PATTERN.test(trimmed)) {
    throw new Error(`Invalid token amount: ${amount}`);
  }

  const isNegative = trimmed.startsWith("-");
  const unsigned = isNegative ? trimmed.slice(1) : trimmed;

  const [intPart, fracPart = ""] = unsigned.split(".");

  if (fracPart.length > decimals) {
    throw new Error(
      `This token supports at most ${decimals} decimal ${
        decimals === 1 ? "place" : "places"
      }.`,
    );
  }

  // Right-pad the fraction to exactly `decimals` digits, then concatenate.
  const paddedFraction = fracPart.padEnd(decimals, "0");
  const combined = `${intPart}${paddedFraction}`;

  // Strip leading zeros without using Number (keeps precision). BigInt
  // normalizes "007" → "7" and "000" → "0".
  const normalized = BigInt(combined).toString();

  // BigInt() already dropped the sign via the unsigned combined string, so
  // "-0" collapses to "0".
  return isNegative && normalized !== "0" ? `-${normalized}` : normalized;
};

/**
 * Convert a raw base-unit integer string back into a human-readable decimal
 * token amount, trimming trailing zeros.
 *
 * @param raw - Raw base-unit integer string, e.g. `"55000000"`. May be negative.
 * @param decimals - Number of decimals the token uses (0–38).
 * @returns The human-readable amount, e.g. `baseUnitsToTokenAmount("55000000", 7)` → `"5.5"`.
 * @throws If `raw` is not a plain integer string or `decimals` is out of range.
 */
export const baseUnitsToTokenAmount = (
  raw: string,
  decimals: number,
): string => {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 38) {
    throw new Error(`Invalid decimals: ${decimals}`);
  }

  const trimmed = raw.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error(`Invalid base-unit value: ${raw}`);
  }

  const isNegative = trimmed.startsWith("-");
  const unsigned = (isNegative ? trimmed.slice(1) : trimmed).replace(
    /^0+(?=\d)/,
    "",
  );

  if (decimals === 0) {
    const normalized = unsigned === "0" ? "0" : unsigned;
    return isNegative && normalized !== "0" ? `-${normalized}` : normalized;
  }

  // Left-pad so there is at least one integer digit before the fraction.
  const padded = unsigned.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals);
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, "");

  const result = fracPart ? `${intPart}.${fracPart}` : intPart;

  return isNegative && BigInt(unsigned) !== BigInt(0) ? `-${result}` : result;
};
