import { FractionValue, NumberFractionValue } from "@/types/types";
import { getAmountError } from "./getAmountError";
import { getPositiveIntError } from "./getPositiveIntError";
import { sanitizeArray } from "@/helpers/sanitizeArray";

export const getNumberFractionError = (value: NumberFractionValue) => {
  if (!value.type || !value.value) {
    return false;
  }

  if (value.type === "number") {
    return getAmountError(value.value as string);
  }

  if (value.type === "fraction") {
    const val = value.value as FractionValue;
    const numValid = val.n ? getPositiveIntError(val.n) : false;
    const denValid = val.d ? getPositiveIntError(val.d) : false;

    const numError = numValid ? `Numerator: ${numValid}` : false;
    const denError = denValid ? `Denominator: ${denValid}` : false;

    return sanitizeArray([numError, denError]).join(" ") ?? false;
  }

  return false;
};
