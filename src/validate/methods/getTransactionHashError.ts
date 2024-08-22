export const getTransactionHashError = (hash: string | undefined) => {
  if (!hash) {
    return false;
  }

  if (hash.match(/^[0-9a-f]{64}$/g) === null) {
    return "Transaction hash is invalid.";
  }

  return false;
};
