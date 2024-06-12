import { FractionValue, NumberFractionValue } from "@/types/types";
import { amount } from "./amount";
import { positiveInt } from "./positiveInt";
import { sanitizeArray } from "@/helpers/sanitizeArray";

export const numberFraction = (value: NumberFractionValue) => {
  if (!value.type || !value.value) {
    return false;
  }

  if (value.type === "number") {
    return amount(value.value as string);
  }

  if (value.type === "fraction") {
    const val = value.value as FractionValue;
    const numValid = val.n ? positiveInt(val.n) : false;
    const denValid = val.d ? positiveInt(val.d) : false;

    const numError = numValid ? `Numerator: ${numValid}` : false;
    const denError = denValid ? `Denominator: ${denValid}` : false;

    return sanitizeArray([numError, denError]).join(" ") ?? false;
  }

  return false;
};
