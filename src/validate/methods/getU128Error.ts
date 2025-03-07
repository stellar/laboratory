import { validate } from "@/validate";

// Primitive Definition U128 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L122-L127
export const getU128Error = (value: string) => {
  const error = validate.getPositiveIntError(value);

  if (error) {
    return error;
  }

  // Check pattern for U128
  const u128Pattern = /^([1-9][0-9]*|0)$/;
  if (!u128Pattern.test(value)) {
    return "Value must be a valid u128 integer";
  }

  // Check length constraints
  if (value.length < 1 || value.length > 39) {
    return "Value must be between 1 and 39 characters long";
  }

  try {
    // Ensure it can be parsed as a BigInt
    BigInt(value);
  } catch {
    return "Value must be a valid u128 integer";
  }

  return false;
};
