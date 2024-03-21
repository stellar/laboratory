export const parseJsonString = <T>(value: any | undefined) => {
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return value;
    }
  }

  return value;
};
