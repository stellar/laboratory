export const getDataNameError = (value: string) => {
  if (value.toString().length > 64) {
    return `Entry name can only contain a maximum of 64 characters. ${value.length} entered.`;
  }

  return false;
};
