export const getContractIdError = (value: string) => {
  if (value.charAt(0) !== "C") {
    return "The string must start with 'C'.";
  }

  return false;
};
