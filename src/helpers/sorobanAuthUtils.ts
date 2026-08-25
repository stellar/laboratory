import { Transaction, xdr } from "@stellar/stellar-sdk";

type SimulationResponse = Record<string, any>;

/**
 * Credential types that bind to an address and therefore require an explicit
 * authorization signature (via `authorizeEntry`), as opposed to source-account
 * credentials, which are covered by the transaction envelope signature.
 *
 * Covers the legacy `SOROBAN_CREDENTIALS_ADDRESS` plus the CAP-71 (protocol 27)
 * additions: `SOROBAN_CREDENTIALS_ADDRESS_V2` and
 * `SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES`.
 */
const ADDRESS_CREDENTIAL_TYPE_NAMES = new Set([
  "sorobanCredentialsAddress",
  "sorobanCredentialsAddressV2",
  "sorobanCredentialsAddressWithDelegates",
]);

/**
 * Returns true if the entry's credentials require an address signature.
 *
 * Only `SOROBAN_CREDENTIALS_SOURCE_ACCOUNT` entries return false — those are
 * authorized by the transaction envelope signature and need no separate auth
 * signature.
 */
export const isAddressAuthEntry = (
  entry: xdr.SorobanAuthorizationEntry,
): boolean => ADDRESS_CREDENTIAL_TYPE_NAMES.has(entry.credentials.type);

/**
 * Extracts auth entries from the simulation response.
 * Auth entries live in result.results[].auth[] in the RPC response.
 */
export const extractAuthEntries = (
  responseData: SimulationResponse,
): string[] => {
  const authEntries: string[] = [];
  const results = responseData?.result?.results as
    | Array<{ auth?: string[] }>
    | undefined;

  if (Array.isArray(results)) {
    for (const r of results) {
      if (Array.isArray(r.auth)) {
        authEntries.push(...r.auth);
      }
    }
  }

  return authEntries;
};

/**
 * Replaces the auth entries on every `invokeHostFunction` operation with signed
 * versions, returning the base64 transaction envelope XDR.
 *
 * Operates on the envelope from `toEnvelope()`, which is a fresh copy, so the
 * source transaction is left untouched.
 */
export const replaceAuthEntries = (
  transaction: Transaction,
  signedEntriesXdr: string[],
): string => {
  const envelope = transaction.toEnvelope();
  const txEnvelope = xdr.expectUnionVariant(envelope, "envelopeTypeTx");
  const signedAuth = signedEntriesXdr.map((entryBase64) =>
    xdr.SorobanAuthorizationEntry.fromXdr(entryBase64, "base64"),
  );

  for (const op of txEnvelope.v1.tx.operations) {
    if (op.body.type === "invokeHostFunction") {
      const ihf = op.body.invokeHostFunctionOp;
      // `auth` is readonly-typed but the array itself is live, and `envelope`
      // is the object serialized below — so replacing the contents in place is
      // what lands the signed entries in the XDR. Assigning to `ihf.auth`, or
      // reassigning a copy, would silently drop them.
      ihf.auth.splice(0, ihf.auth.length, ...signedAuth);
    }
  }

  return envelope.toXdr("base64");
};
