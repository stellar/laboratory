export const getDataValueError = (value: string) => {
  const valueSize = Buffer.from(value).length;

  if (valueSize > 64) {
    return `Entry value can only contain a maximum of 64 bytes. ${valueSize} bytes entered.`;
  }

  return false;
};
