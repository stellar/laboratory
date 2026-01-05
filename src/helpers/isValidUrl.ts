export const isValidUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    // Disallow wallet domains to protect users from potential transaction scams
    const notAllowedDomains = ["albedo.link", "wallet.xbull.app"];

    if (notAllowedDomains.includes(parsedUrl.hostname)) {
      return false;
    }

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};
