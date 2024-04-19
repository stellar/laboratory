export const inputNumberValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  return isNaN(Number(value)) ? undefined : Number(value);
};
