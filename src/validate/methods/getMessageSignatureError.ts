import { Buffer } from "buffer";

/**
 * Validate a base64-encoded SEP-53 message signature. A valid ed25519 signature
 * is exactly 64 bytes. Returns an error string, or `false` when valid.
 */
export const getMessageSignatureError = (
  signature: string,
  isRequired?: boolean,
) => {
  if (!signature) {
    return isRequired ? "Signature is required." : false;
  }

  // Buffer.from never throws on bad input — it silently drops non-base64
  // characters — so validate by confirming the decoded bytes round-trip.
  const decoded = Buffer.from(signature, "base64");

  if (
    decoded.toString("base64").replace(/=+$/, "") !==
    signature.replace(/=+$/, "")
  ) {
    return "Signature must be valid base64.";
  }

  if (decoded.length !== 64) {
    return "Signature must be a 64-byte ed25519 signature.";
  }

  return false;
};
