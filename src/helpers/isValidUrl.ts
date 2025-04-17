export const isValidUrl = (url: string) => {
  if (!url.startsWith("http")) {
    return false;
  }

  try {
    new URL(url);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};
