import { StrKey } from "@stellar/stellar-sdk";

export const getMuxedAddressError = (
  muxedAddress: string,
  isRequired?: boolean,
) => {
  if (!muxedAddress) {
    if (isRequired) {
      return "Public key is required.";
    } else {
      return false;
    }
  }

  if (!muxedAddress.startsWith("M")) {
    return "Muxed account address must start with 'M'.";
  }

  if (!StrKey.isValidMed25519PublicKey(muxedAddress)) {
    return "Muxed account address is invalid.";
  }

  return false;
};
