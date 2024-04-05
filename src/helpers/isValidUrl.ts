export const isValidUrl = (url: string) => {
  if (!url.startsWith("http")) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
