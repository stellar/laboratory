import { validate } from "@/validate";

// Primitive Definition U32 comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L100-L104
const MAX_U32 = BigInt("4294967295");

export const getU32Error = (value: string, isRequired?: boolean) => {
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

  const num = BigInt(value);

  if (num < 0 || num > MAX_U32) {
    return "Value must be a valid u32 integer (0 to 4294967295)";
  }

  return false;
};
