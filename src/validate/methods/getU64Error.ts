import { validate } from "@/validate";

// Primitive Definition U64 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L110-L115
const MAX_U64 = BigInt("18446744073709551615");

export const getU64Error = (value: string) => {
  const error = validate.getPositiveIntError(value);

  if (error) {
    return error;
  }

  // Use the original regex pattern
  const u64Pattern = /^([1-9][0-9]*|0)$/;

  // Check if the value matches the U64 pattern
  if (!u64Pattern.test(value)) {
    return "Value must be a valid u64 integer (0 to 18446744073709551615)";
  }

  try {
    const num = BigInt(value);
    if (num < 0 || num > MAX_U64) {
      return "Value must be a valid u64 integer (0 to 18446744073709551615)";
    }
  } catch {
    return "Value must be a valid u64 integer (0 to 18446744073709551615)";
  }

  return false;
};
