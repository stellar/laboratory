export const sanitizeArray = (array: any[]) => {
  return array.filter((i) => Boolean(i));
};
