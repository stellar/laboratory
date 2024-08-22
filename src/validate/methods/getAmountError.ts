export const getAmountError = (value: string) => {
  if (value.toString().charAt(0) === "-") {
    return "Amount can only be a positive number.";
  } else if (!value.toString().match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
    return "Amount can only contain numbers and a period for the decimal point.";
  } else if (value.toString().match(/\.([0-9]){8,}$/g)) {
    return "Amount can only support a precision of 7 decimals.";
  }

  return false;
};
