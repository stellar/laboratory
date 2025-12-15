export const getPositiveIntError = (value: string) => {
  if (value.toString().charAt(0) === "-") {
    return "Expected a positive number or zero.";
  } else if (value === "" || !value.toString().match(/^[0-9]*$/g)) {
    return "Expected a whole number.";
  } else if (BigInt(value) > Number.MAX_SAFE_INTEGER) {
    return "Number exceeds maximum safe integer.";
  }

  return false;
};
