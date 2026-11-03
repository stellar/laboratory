import { StrKey } from "@stellar/stellar-sdk";

/**
 * Validates a value for a Soroban `Address` contract parameter, which takes a
 * G... account or C... contract address. Muxed addresses (M... or W...) are
 * only valid for a `MuxedAddress` parameter, and the network rejects them
 * here.
 */
export const getAddressError = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "Address is required.";
    } else {
      return false;
    }
  }

  if (StrKey.isValidEd25519PublicKey(value) || StrKey.isValidContract(value)) {
    return false;
  }

  if (
    StrKey.isValidMed25519PublicKey(value) ||
    StrKey.isValidMuxedContract(value)
  ) {
    return "Muxed addresses (M... or W...) aren’t allowed here. Use the base G... account or C... contract address.";
  }

  return "Invalid public key or contract ID.";
};
