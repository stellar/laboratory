// Primitive Definition I64 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L116C2-L121C5
export const getI64Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }
  // Check pattern for I64
  const i64Pattern = /^(-?[1-9][0-9]*|0)$/;
  if (!i64Pattern.test(value)) {
    return "Value must be a valid i64 integer";
  }

  // Check length constraints
  if (value.length < 1 || value.length > 21) {
    return "Value must be between 1 and 21 characters long";
  }

  try {
    const num = BigInt(value);
    const MIN_I64 = BigInt("-9223372036854775808");
    const MAX_I64 = BigInt("9223372036854775807");

    if (num < MIN_I64 || num > MAX_I64) {
      return "Value must be a valid i64 integer (-9223372036854775808 to 9223372036854775807)";
    }
  } catch {
    return "Value must be a valid i64 integer";
  }

  return false;
};
