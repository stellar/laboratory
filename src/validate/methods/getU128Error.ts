import { validate } from "@/validate";

const U128_MAX = BigInt("340282366920938463463374607431768211455");
const U128_PATTERN = /^([1-9][0-9]*|0)$/;

// Primitive Definition U128 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L122-L127
export const getU128Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    return isRequired ? "This field is required." : false;
  }

  if (value.length > 39) {
    return "Value must be between 1 and 39 characters long";
  }

  const error = validate.getPositiveIntError(value);

  if (error) {
    return error;
  }

  if (!U128_PATTERN.test(value)) {
    return "Value must be a valid u128 integer";
  }

  try {
    const numValue = BigInt(value); // Parse once

    if (numValue > U128_MAX) {
      return "Value exceeds maximum u128 value (2^128 - 1)";
    }
  } catch {
    return "Value must be a valid u128 integer";
  }

  return false;
};
