const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

export const isValidUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    // Disallow wallet domains to protect users from potential transaction scams
    const notAllowedDomains = [
      "albedo.link",
      "mycactus.com",
      "xbull.app",
      "freighter.app",
      "lobstr.co",
      "rabet.io",
      "hanawallet.io",
      "ledger.com",
      "hot-labs.org",
    ];
    const hostname = parsedUrl.hostname.replace(/\.+$/, "");

    if (
      notAllowedDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      )
    ) {
      return false;
    }

    if (parsedUrl.protocol === "https:") {
      return true;
    }

    // Plain http is only trustworthy for local dev endpoints (e.g. a local
    // Horizon/RPC node); anywhere else it's not something we want to
    // render as a clickable link.
    if (parsedUrl.protocol === "http:") {
      return LOCAL_HOSTNAMES.includes(hostname);
    }

    return false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};
