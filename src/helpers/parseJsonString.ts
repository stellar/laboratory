export const parseJsonString = <T>(value: any | undefined) => {
  if (value) {
    try {
      return JSON.parse(value) as T;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return value;
    }
  }

  return value;
};
