import { StrKey } from "@stellar/stellar-sdk";

/**
 * Returns `true` if the given value is a Stellar asset string in the form
 * `code:issuer`, where `code` is 1–12 characters and `issuer` is a valid
 * ed25519 / muxed public key or contract ID.
 *
 * Only used by the CallStackTrace component to detect and format asset values.
 *
 * @param value - The value to test.
 * @returns Whether the value is a valid `code:issuer` asset string.
 */
export const isAsset = (value: unknown) => {
  if (typeof value !== "string" || !value.includes(":")) {
    return false;
  }

  const parts = value.split(":");
  if (parts.length !== 2) {
    return false;
  }

  const [code, issuer] = parts;
  // Asset code should be 1-12 characters, issuer must be valid G or M address or contract ID
  return (
    code.length > 0 &&
    code.length <= 12 &&
    (StrKey.isValidEd25519PublicKey(issuer) ||
      StrKey.isValidMed25519PublicKey(issuer) ||
      StrKey.isValidContract(issuer))
  );
};
