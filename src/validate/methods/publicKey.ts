import { StrKey } from "@stellar/stellar-sdk";

export const publicKey = (publicKey: string, isRequired?: boolean) => {
  if (!publicKey) {
    if (isRequired) {
      return "Asset issuer is required.";
    } else {
      return false;
    }
  }

  if (publicKey.startsWith("M")) {
    if (!StrKey.isValidMed25519PublicKey(publicKey)) {
      return "Muxed account address is invalid.";
    }
  } else if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    return "Public key is invalid.";
  }

  return false;
};
