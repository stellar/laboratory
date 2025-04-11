// Primitive Definition I128 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L128-L133
export const getI128Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }
  // Check pattern for I128
  const i128Pattern = /^(-?[1-9][0-9]*|0)$/;
  if (!i128Pattern.test(value)) {
    return "Value must be a valid i128 integer";
  }

  // Check length constraints
  if (value.length < 1 || value.length > 40) {
    return "Value must be between 1 and 40 characters long";
  }

  try {
    const num = BigInt(value);
    const MIN_I128 = BigInt("-170141183460469231731687303715884105728");
    const MAX_I128 = BigInt("170141183460469231731687303715884105727");

    if (num < MIN_I128 || num > MAX_I128) {
      return "Value must be a valid i128 integer (-170141183460469231731687303715884105728 to 170141183460469231731687303715884105727)";
    }
  } catch {
    return "Value must be a valid i128 integer";
  }

  return false;
};
