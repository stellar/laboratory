import { validate } from "@/validate";
import { tokenAmountToBaseUnits } from "@/helpers/tokenAmount";

/**
 * Validate a human-readable token amount (as typed in "token units" mode of a
 * decimals-aware i128/u128 field) and, when valid, confirm the scaled base-unit
 * integer still satisfies the underlying i128/u128 range checks.
 *
 * Follows the `get*Error()` convention: returns an error message string, or
 * `false` when the value is valid.
 *
 * @param value - The decimal string the user typed, e.g. `"5.5"`.
 * @param decimals - The token's decimals (0–38).
 * @param isSigned - `true` for i128 amounts (negatives allowed), `false` for u128.
 * @param isRequired - Whether an empty value is an error.
 */
export const getTokenAmountError = ({
  value,
  decimals,
  isSigned,
  isRequired,
}: {
  value: string;
  decimals: number;
  isSigned: boolean;
  isRequired?: boolean;
}): string | false => {
  if (!value) {
    return isRequired ? "This field is required." : false;
  }

  const trimmed = value.trim();
  const pattern = isSigned ? /^-?(\d+)(\.\d+)?$/ : /^(\d+)(\.\d+)?$/;

  if (!pattern.test(trimmed)) {
    return isSigned
      ? "Enter a valid decimal amount (e.g. 5.5)."
      : "Enter a valid positive decimal amount (e.g. 5.5).";
  }

  const unsigned = trimmed.startsWith("-") ? trimmed.slice(1) : trimmed;
  const fraction = unsigned.split(".")[1] ?? "";

  if (fraction.length > decimals) {
    return `This token supports at most ${decimals} decimal ${
      decimals === 1 ? "place" : "places"
    }.`;
  }

  let raw: string;

  try {
    raw = tokenAmountToBaseUnits(trimmed, decimals);
  } catch {
    return "Enter a valid decimal amount (e.g. 5.5).";
  }

  // Reuse the existing range/length checks on the scaled base-unit integer.
  return isSigned ? validate.getI128Error(raw) : validate.getU128Error(raw);
};
