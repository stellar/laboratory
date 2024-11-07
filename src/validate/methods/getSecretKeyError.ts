import { StrKey } from "@stellar/stellar-sdk";

export const getSecretKeyError = (value: string) => {
  if (!StrKey.isValidEd25519SecretSeed(value)) {
    return "Invalid secret key. Please check your secret key and try again.";
  }

  return false;
};
