// Primitive Definition I256 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L140-L145
export const getI256Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }
  // Check pattern for I256
  const i256Pattern = /^(-?[1-9][0-9]*|0)$/;
  if (!i256Pattern.test(value)) {
    return "Value must be a valid i256 integer";
  }

  // Check length constraints
  if (value.length < 1 || value.length > 79) {
    return "Value must be between 1 and 79 characters long";
  }

  try {
    // Ensure it can be parsed as a BigInt
    BigInt(value);
  } catch {
    return "Value must be a valid i256 integer";
  }

  return false;
};
