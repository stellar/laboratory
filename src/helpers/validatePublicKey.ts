import { StrKey } from "stellar-sdk";

export const validatePublicKey = (issuer: string) => {
  if (!issuer) {
    return "Asset issuer is required.";
  }

  if (issuer.startsWith("M")) {
    if (!StrKey.isValidMed25519PublicKey(issuer)) {
      return "Muxed account address is invalid.";
    }
  } else if (!StrKey.isValidEd25519PublicKey(issuer)) {
    return "Public key is invalid.";
  }

  return "";
};
