import {
  Address,
  Keypair,
  Networks,
  authorizeInvocation,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk";
import {
  extractAuthEntries,
  isAddressAuthEntry,
} from "../../src/helpers/sorobanAuthUtils";

const NETWORK = Networks.TESTNET;

/** A minimal invocation tree for building authorization entries. */
const buildInvocation = (): xdr.SorobanAuthorizedInvocation =>
  new xdr.SorobanAuthorizedInvocation({
    function:
      xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
        new xdr.InvokeContractArgs({
          contractAddress: new Address(
            "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
          ).toScAddress(),
          functionName: "transfer",
          args: [nativeToScVal("1", { type: "i128" })],
        }),
      ),
    subInvocations: [],
  });

describe("isAddressAuthEntry", () => {
  const keypair = Keypair.random();

  it("returns false for source-account credentials", () => {
    const entry = new xdr.SorobanAuthorizationEntry({
      credentials: xdr.SorobanCredentials.sorobanCredentialsSourceAccount(),
      rootInvocation: buildInvocation(),
    });

    expect(isAddressAuthEntry(entry)).toBe(false);
  });

  it("returns true for legacy address credentials (SOROBAN_CREDENTIALS_ADDRESS)", async () => {
    const entry = await authorizeInvocation({
      signer: keypair,
      validUntilLedgerSeq: 1_000_000,
      invocation: buildInvocation(),
      networkPassphrase: NETWORK,
      authV2: false,
    });

    expect(entry.credentials().switch().name).toBe("sorobanCredentialsAddress");
    expect(isAddressAuthEntry(entry)).toBe(true);
  });

  it("returns true for CAP-71 V2 address credentials (SOROBAN_CREDENTIALS_ADDRESS_V2)", async () => {
    const entry = await authorizeInvocation({
      signer: keypair,
      validUntilLedgerSeq: 1_000_000,
      invocation: buildInvocation(),
      networkPassphrase: NETWORK,
      authV2: true,
    });

    expect(entry.credentials().switch().name).toBe(
      "sorobanCredentialsAddressV2",
    );
    expect(isAddressAuthEntry(entry)).toBe(true);
  });
});

describe("extractAuthEntries", () => {
  it("collects auth entries across all results", () => {
    const response = {
      result: {
        results: [
          { auth: ["entryA", "entryB"] },
          { auth: ["entryC"] },
          { auth: [] },
          {},
        ],
      },
    };

    expect(extractAuthEntries(response)).toEqual([
      "entryA",
      "entryB",
      "entryC",
    ]);
  });

  it("returns an empty array when there are no results", () => {
    expect(extractAuthEntries({})).toEqual([]);
    expect(extractAuthEntries({ result: {} })).toEqual([]);
  });
});
