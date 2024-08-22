export const getClaimableBalanceIdError = (value: string) => {
  // 8b discriminant + 64b string
  if (value && value.length !== 8 + 64) {
    return "Claimable Balance ID is invalid.";
  }

  return false;
};
