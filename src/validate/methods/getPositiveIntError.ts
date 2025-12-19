export const getPositiveIntError = (value: string) => {
  if (value.toString().charAt(0) === "-") {
    return "Expected a positive number or zero.";
  }

  const positiveIntPattern = /^([1-9][0-9]*|0)$/;

  if (!positiveIntPattern.test(value)) {
    return "Expected a whole number.";
  }

  return false;
};
