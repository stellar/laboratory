const CONTRACT_LENGTH = 56;

export const getContractIdError = (value: string) => {
  if (value.charAt(0) !== "C") {
    return "The string must start with 'C'.";
  } else if (value.length !== CONTRACT_LENGTH) {
    return `The string must be exactly ${CONTRACT_LENGTH} characters long.`;
  }

  return false;
};
