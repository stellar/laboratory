import { validate } from "@/validate";

// Primitive Definition U256 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L134-L139
export const getU256Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }

  const error = validate.getPositiveIntError(value);

  if (error) {
    return error;
  }

  // Check pattern for U256
  const u256Pattern = /^([1-9][0-9]*|0)$/;
  if (!u256Pattern.test(value)) {
    return "Value must be a valid u256 integer";
  }

  // Check length constraints
  if (value.length < 1 || value.length > 78) {
    return "Value must be between 1 and 78 characters long";
  }

  try {
    // Ensure it can be parsed as a BigInt
    BigInt(value);
  } catch {
    return "Value must be a valid u256 integer";
  }

  return false;
};
