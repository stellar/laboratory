import { getPositiveIntError } from "./getPositiveIntError";

export const getAccountThresholdError = (value: string) => {
  const intError = getPositiveIntError(value);

  if (intError) {
    return intError;
  }

  if (Number(value) > 255) {
    return "Expected an integer between 0 and 255 (inclusive).";
  }

  return false;
};
