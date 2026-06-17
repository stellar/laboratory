import { Keypair, hash } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

/**
 * SEP-53 domain-separation prefix. Prepended to every message before hashing so
 * a message signature can never be mistaken for (or replayed as) a transaction
 * signature.
 * https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md
 */
export const SEP53_PREFIX = "Stellar Signed Message:\n";

export type SignedMessage = {
  publicKey: string;
  message: string;
  /** base64-encoded 64-byte ed25519 signature */
  signature: string;
};

/**
 * Build the SEP-53 signing payload and hash it: SHA-256(prefix || utf8(message)).
 * The message is treated as UTF-8 text. ed25519 signing/verification operates on
 * this 32-byte hash, never on the raw message.
 */
const sep53PayloadHash = (message: string): Buffer => {
  const payload = Buffer.concat([
    Buffer.from(SEP53_PREFIX, "utf8"),
    Buffer.from(message, "utf8"),
  ]);

  return hash(payload);
};

/**
 * Sign a message per SEP-53 using a secret key. Mirrors what a wallet's
 * `signMessage` does internally, so the resulting signature is interoperable.
 * Throws if the secret key is invalid.
 */
export const signMessageWithSecretKey = ({
  secretKey,
  message,
}: {
  secretKey: string;
  message: string;
}): SignedMessage => {
  const keypair = Keypair.fromSecret(secretKey);
  const signature = keypair.sign(sep53PayloadHash(message));

  return {
    publicKey: keypair.publicKey(),
    message,
    signature: signature.toString("base64"),
  };
};

/**
 * Verify a SEP-53 message signature against a public key. Reconstructs the
 * identical payload hash and checks the ed25519 signature. Returns `true` only
 * if the holder of `publicKey` signed this exact message.
 */
export const verifyMessage = ({
  publicKey,
  message,
  signature,
}: {
  publicKey: string;
  message: string;
  signature: string;
}): boolean => {
  const keypair = Keypair.fromPublicKey(publicKey);

  return keypair.verify(
    sep53PayloadHash(message),
    Buffer.from(signature, "base64"),
  );
};
