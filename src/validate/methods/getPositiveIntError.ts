export const getPositiveIntError = (value: string) => {
  if (value.toString().charAt(0) === "-") {
    return "Expected a positive number or zero.";
  } else if (!value.toString().match(/^[0-9]*$/g)) {
    return "Expected a whole number.";
  }

  return false;
};
