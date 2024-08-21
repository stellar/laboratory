export const delay = async (ms: number = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
