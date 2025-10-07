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
