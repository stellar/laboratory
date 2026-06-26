/**
 * Extracts a human-readable message from an unknown error value.
 *
 * Handles `Error` instances, raw strings, and arbitrary objects (falling back
 * to `JSON.stringify`, then `String`).
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

export const isExternalError = (error: Error) => {
  const stack = error.stack || "";

  if (
    stack.includes("stellar-wallets-kit") ||
    stack.includes("@creit.tech/stellar-wallets-kit") ||
    stack.includes("@ledgerhq/") ||
    stack.includes("@trezor/")
  ) {
    return true;
  }

  return false;
};
