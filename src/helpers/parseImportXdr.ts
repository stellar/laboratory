import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { hasSorobanData, isSorobanOperationType } from "@/helpers/sorobanUtils";
import { validate } from "@/validate";

/** Parse-derived state for an imported transaction envelope. */
export type ParsedImportXdr = {
  parsedTxType: "classic" | "soroban" | null;
  hasSignatures: boolean;
  isSimulated: boolean;
  isFeeBump: boolean;
  parseError: string | null;
};

const EMPTY_RESULT: ParsedImportXdr = {
  parsedTxType: null,
  hasSignatures: false,
  isSimulated: false,
  isFeeBump: false,
  parseError: null,
};

const isFeeBumpTransaction = (
  tx: Transaction | FeeBumpTransaction,
): tx is FeeBumpTransaction => "innerTransaction" in tx;

/**
 * Parse a transaction envelope XDR into the fields the import flow stores.
 *
 * For the import page's `onChange` andexternal entry points
 * (e.g. the CLI deep link at `/transaction/cli-sign`)
 * without duplicating the parse logic — keeping the derived state identical
 * regardless of how the XDR arrived.
 *
 * @param value - The transaction envelope XDR (base64).
 * @param networkPassphrase - Network passphrase used to construct the tx.
 * @returns Parsed type, signature presence, simulation/fee-bump flags, and a
 *   parse error message when the XDR can't be decoded.
 */
export const parseImportXdr = (
  value: string,
  networkPassphrase: string,
): ParsedImportXdr => {
  if (!value) {
    return { ...EMPTY_RESULT };
  }

  const xdrValidation = validate.getXdrError(value);

  if (xdrValidation?.result === "error") {
    return {
      ...EMPTY_RESULT,
      parseError: xdrValidation.message ?? "Invalid XDR",
    };
  }

  try {
    const tx = TransactionBuilder.fromXDR(value, networkPassphrase) as
      | Transaction
      | FeeBumpTransaction;

    const operations = isFeeBumpTransaction(tx)
      ? tx.innerTransaction.operations
      : tx.operations;

    const isSoroban = isSorobanOperationType(operations?.[0]?.type ?? "");

    return {
      parsedTxType: isSoroban ? "soroban" : "classic",
      hasSignatures: tx.signatures.length > 0,
      isSimulated: isSoroban && hasSorobanData(tx),
      isFeeBump: isFeeBumpTransaction(tx),
      parseError: null,
    };
  } catch (e) {
    return {
      ...EMPTY_RESULT,
      parseError:
        e instanceof Error
          ? e.message
          : "Unable to parse transaction envelope XDR",
    };
  }
};
