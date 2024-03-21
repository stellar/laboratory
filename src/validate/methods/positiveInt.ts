export const positiveInt = (value: string) => {
  if (value.charAt(0) === "-") {
    return "Expected a positive number or zero.";
  } else if (!value.match(/^[0-9]*$/g)) {
    return "Expected a whole number.";
  }

  return false;
};
