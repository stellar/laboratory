import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

/**
 * Parse a transaction envelope XDR, returning `null` instead of throwing when
 * it's empty or malformed.
 *
 * `TransactionBuilder.fromXdr` throws on unusable input, which is fatal when
 * it runs during render. Both failure cases are routine in the transaction
 * flows: the XDR is empty before anything has been built or imported, and it
 * can be malformed while the user is pasting an envelope.
 *
 * For the import flow's richer needs — validation messages and derived tx
 * metadata — use `parseImportXdr` instead.
 *
 * @param xdr - Base64 transaction envelope XDR
 * @param networkPassphrase - Passphrase of the currently selected network
 * @returns The parsed transaction, or `null` if it can't be parsed
 */
export const parseTxXdr = (
  xdr: string | null | undefined,
  networkPassphrase: string,
): Transaction | FeeBumpTransaction | null => {
  if (!xdr) {
    return null;
  }

  try {
    return TransactionBuilder.fromXdr(xdr, networkPassphrase);
  } catch {
    return null;
  }
};
