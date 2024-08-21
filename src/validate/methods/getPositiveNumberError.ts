export const getPositiveNumberError = (value: string) => {
  if (value.toString().charAt(0) === "-") {
    return "Expected a positive number or zero.";
  } else if (!value.toString().match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
    return "Expected a positive number with a period for the decimal point.";
  }

  return false;
};
