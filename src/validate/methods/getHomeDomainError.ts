export const getHomeDomainError = (value: string) => {
  const charLen = value.toString().length;

  if (charLen > 32) {
    return `Max length of home domain is 32 characters (got ${charLen}).`;
  }

  return false;
};
