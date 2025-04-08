// Primitive Definition I32 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L105-L109
export const getI32Error = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }

  try {
    const num = BigInt(value);
    const MIN_I32 = BigInt("-2147483648");
    const MAX_I32 = BigInt("2147483647");

    if (num < MIN_I32 || num > MAX_I32) {
      return "Value must be a valid i32 integer (-2147483648 to 2147483647)";
    }
  } catch {
    return "Value must be a valid i32 integer";
  }

  return false;
};
