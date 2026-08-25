import { xdr } from "@stellar/stellar-sdk";

import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";

export type MatchStatus = "valid" | "invalid" | "unknown";

export type ResolvedSignatureRow = {
  hint: string;
  signature: string;
  signerPubKey?: string;
  matchStatus: MatchStatus;
};

export const resolveSignatureRows = (
  signatures: xdr.DecoratedSignature[],
  signers: string[],
  hash: Uint8Array,
): ResolvedSignatureRow[] => {
  const hashHex = Buffer.from(hash).toString("hex");

  return signatures.map((sig) => {
    const hint = Buffer.from(sig.hint.toBytes()).toString("hex");
    const signature = Buffer.from(sig.signature.toBytes()).toString("hex");
    const signerPubKey = findKeyBySignatureHint(hint, signers);

    let matchStatus: MatchStatus;
    if (!signerPubKey) {
      matchStatus = "unknown";
    } else if (verifySignature({ hint, signature }, signerPubKey, hashHex)) {
      matchStatus = "valid";
    } else {
      matchStatus = "invalid";
    }

    return { hint, signature, signerPubKey, matchStatus };
  });
};