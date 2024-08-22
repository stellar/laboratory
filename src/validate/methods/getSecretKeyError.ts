import { StrKey } from "@stellar/stellar-sdk";

export const getSecretKeyError = (value: string) => {
  if (value.startsWith("S")) {
    if (!StrKey.isValidEd25519SecretSeed(value)) {
      return "Invalid secret key.";
    }
  } else {
    if (!value.match(/^[0-9a-f]{2,128}$/gi) || value.length % 2 == 1) {
      return `Invalid hex value. Please provide up to 64 bytes in hexadecimal format.`;
    }
  }

  return false;
};
