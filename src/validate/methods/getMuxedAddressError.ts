import { StrKey } from "@stellar/stellar-sdk";

/**
 * Validates a value for a Soroban `MuxedAddress` contract parameter, which
 * takes any account or contract address, muxed or not: G..., M..., C..., or
 * W... (CAP-84 muxed contract).
 */
export const getMuxedAddressError = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "Address is required.";
    } else {
      return false;
    }
  }

  if (
    StrKey.isValidEd25519PublicKey(value) ||
    StrKey.isValidMed25519PublicKey(value) ||
    StrKey.isValidContract(value) ||
    StrKey.isValidMuxedContract(value)
  ) {
    return false;
  }

  return "Invalid address. Enter a G... or M... account, or a C... or W... contract address.";
};
