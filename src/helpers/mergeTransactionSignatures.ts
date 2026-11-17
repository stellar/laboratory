import { Buffer } from "buffer";
import {
  FeeBumpTransaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

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

/** Adopt wallet edits only while no collected signature would be invalidated. */
export const getWalletSigningResult = (
  originalXdr: string,
  signedXdr: string,
  networkPassphrase: string,
  preservedSignatures: xdr.DecoratedSignature[] = [],
): { signatures: xdr.DecoratedSignature[]; xdrToSign: string } => {
  const original = TransactionBuilder.fromXdr(originalXdr, networkPassphrase);
  const signed = TransactionBuilder.fromXdr(signedXdr, networkPassphrase);
  const changed = !Buffer.from(original.hash()).equals(
    Buffer.from(signed.hash()),
  );
  const invalidatesInnerSignatures =
    original instanceof FeeBumpTransaction &&
    original.innerTransaction.signatures.length > 0 &&
    (!(signed instanceof FeeBumpTransaction) ||
      !Buffer.from(original.innerTransaction.hash()).equals(
        Buffer.from(signed.innerTransaction.hash()),
      ) ||
      original.innerTransaction.signatures.some(
        (sig) =>
          !signed.innerTransaction.signatures.some(
            (other) => other.toXDR("base64") === sig.toXDR("base64"),
          ),
      ));
  if (
    (changed &&
      (original.signatures.length > 0 || preservedSignatures.length > 0)) ||
    invalidatesInnerSignatures
  ) {
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
  // Keep the adopted transaction body as the base for every later signing
  // method. Collected wallet signatures stay separate so Clear can remove them.
  if (changed) signed.signatures.splice(0, signed.signatures.length);
  return {
    signatures: added,
    xdrToSign: changed ? signed.toXDR() : originalXdr,
  };
};

/** Extract new signatures while applying the same wallet-edit compatibility rules. */
export const getWalletSignatures = (
  originalXdr: string,
  signedXdr: string,
  networkPassphrase: string,
  preservedSignatures: xdr.DecoratedSignature[] = [],
): xdr.DecoratedSignature[] =>
  getWalletSigningResult(
    originalXdr,
    signedXdr,
    networkPassphrase,
    preservedSignatures,
  ).signatures;
