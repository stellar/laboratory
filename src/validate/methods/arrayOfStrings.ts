export const arrayOfStrings = (value: string) => {
  if (typeof value !== "string") {
    return "Expected strings of array.";
  }

  try {
    const parsedValue = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      for (const item of parsedValue) {
        if (typeof item !== "string") {
          return "Expected a string.";
        }
      }
    }
  } catch (e) {
    return "Expected an array.";
  }
  return false;
};
