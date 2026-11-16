import { Buffer } from "buffer";
import { TransactionBuilder, xdr } from "@stellar/stellar-sdk";

/** Keep distinct signatures, including signers whose four-byte hints collide. */
export const mergeTransactionSignatures = (
  ...groups: xdr.DecoratedSignature[][]
): xdr.DecoratedSignature[] => {
  const seen = new Set<string>();
  return groups.flat().filter((signature) => {
    const encoded = signature.toXDR("base64");
    if (seen.has(encoded)) {
      return false;
    }
    seen.add(encoded);
    return true;
  });
};

/** Extract every new wallet signature without re-adding imported signatures. */
export const getWalletSignatures = (
  originalXdr: string,
  signedXdr: string,
  networkPassphrase: string,
): xdr.DecoratedSignature[] => {
  const original = TransactionBuilder.fromXdr(originalXdr, networkPassphrase);
  const signed = TransactionBuilder.fromXdr(signedXdr, networkPassphrase);
  if (!Buffer.from(original.hash()).equals(Buffer.from(signed.hash()))) {
    throw new Error(
      "The wallet changed the transaction. Its signatures weren’t added because they would not match the other signers. Please sign the original transaction.",
    );
  }

  const existing = new Set(
    original.signatures.map((sig) => sig.toXDR("base64")),
  );
  const added = signed.signatures.filter(
    (sig) => !existing.has(sig.toXDR("base64")),
  );
  if (!added.length) {
    throw new Error(
      "The wallet did not add a signature. Please choose another signer.",
    );
  }
  return added;
};
