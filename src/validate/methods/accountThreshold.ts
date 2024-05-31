import { positiveInt } from "./positiveInt";

export const accountThreshold = (value: string) => {
  const intError = positiveInt(value);

  if (intError) {
    return intError;
  }

  if (Number(value) > 255) {
    return "Expected an integer between 0 and 255 (inclusive).";
  }

  return false;
};
