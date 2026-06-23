export type AllSigsCount = {
  secretKey: number;
  extensionWallet: number;
  hardwareWallet: number;
  signature: number;
};

/**
 * Builds a human-readable summary of the signatures added to a transaction,
 * grouped by signature source.
 *
 * @example
 * getAllSigsMessage({ secretKey: 1, hardwareWallet: 2, extensionWallet: 0, signature: 0 })
 * // => "1 secret key signature, 2 hardware wallet signatures added"
 *
 * @returns the summary string, or an empty string when no signatures were added
 */
export const getAllSigsMessage = ({
  secretKey,
  extensionWallet,
  hardwareWallet,
  signature,
}: AllSigsCount) => {
  const allMsgs = [];

  const getMsg = (count: number, label: string) =>
    `${count} ${label} signature${count > 1 ? "s" : ""}`;

  if (secretKey > 0) {
    allMsgs.push(getMsg(secretKey, "secret key"));
  }

  if (hardwareWallet > 0) {
    allMsgs.push(getMsg(hardwareWallet, "hardware wallet"));
  }

  if (extensionWallet > 0) {
    allMsgs.push(getMsg(extensionWallet, "extension wallet"));
  }

  if (signature > 0) {
    allMsgs.push(getMsg(signature, ""));
  }

  if (allMsgs.length > 0) {
    return `${allMsgs.join(", ")} added`;
  }

  return "";
};
