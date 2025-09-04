export const sanitizeUrl = (unsafeUrl: string): string => {
  // We can move these to options param if needed
  const allowedProtocols = ["http:", "https:"];
  const allowLocalhost = true;

  try {
    const url = new URL(unsafeUrl);

    // Allowed protocols
    if (!allowedProtocols.includes(url.protocol)) {
      return "";
    }

    // Check if localhost is allowed
    if (url.hostname === "localhost" && !allowLocalhost) {
      return "";
    }

    // Sanitize search params to prevent XSS
    const sanitizedParams = new URLSearchParams();

    url.searchParams.forEach((value, key) => {
      sanitizedParams.append(key, stripHtml(value));
    });

    url.search = sanitizedParams.toString();

    // Return sanitized URL
    let path = url.pathname;

    // Remove the trailing slash for consistency
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    } else if (path === "/" && !url.search && !url.hash) {
      path = "";
    }

    return `${url.origin}${path}${url.search}${url.hash}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Return empty string if URL is invalid
    return "";
  }
};

const stripHtml = (str: string): string => {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
