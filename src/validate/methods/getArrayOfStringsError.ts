export const getArrayOfStringsError = (value: string) => {
  if (typeof value !== "string") {
    return "Expected an array of strings.";
  }

  try {
    if (value.length > 0) {
      const parsedValue = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        for (const item of parsedValue) {
          if (typeof item !== "string") {
            return "All values in the array must be a string.";
          }
        }
      }
    }
  } catch (e) {
    return "Expected an array.";
  }
  return false;
};
