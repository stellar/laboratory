import { MuxedAccount, StrKey } from "@stellar/stellar-sdk";

// Helper to decode muxed account to ed25519 public key
export const getPublicKey = (publicKey: string) => {
  let sourceAccount = publicKey;

  if (StrKey.isValidMed25519PublicKey(publicKey)) {
    const muxedAccount = MuxedAccount.fromAddress(publicKey, "0");
    sourceAccount = muxedAccount.baseAccount().accountId();
  }

  return sourceAccount;
};
