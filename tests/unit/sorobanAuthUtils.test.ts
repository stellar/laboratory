import {
  Account,
  Address,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  authorizeInvocation,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk";
import {
  extractAuthEntries,
  isAddressAuthEntry,
  replaceAuthEntries,
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

    expect(entry.credentials.type).toBe("sorobanCredentialsAddress");
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

    expect(entry.credentials.type).toBe("sorobanCredentialsAddressV2");
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

describe("replaceAuthEntries", () => {
  /** A transaction with a single invokeHostFunction op carrying `auth`. */
  const buildTx = (auth: xdr.SorobanAuthorizationEntry[]) =>
    new TransactionBuilder(new Account(Keypair.random().publicKey(), "0"), {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    })
      .addOperation(
        Operation.invokeHostFunction({
          func: xdr.HostFunction.hostFunctionTypeInvokeContract(
            new xdr.InvokeContractArgs({
              contractAddress: new Address(
                "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
              ).toScAddress(),
              functionName: "transfer",
              args: [nativeToScVal("1", { type: "i128" })],
            }),
          ),
          auth,
        }),
      )
      .setTimeout(30)
      .build();

  const unsignedEntry = () =>
    new xdr.SorobanAuthorizationEntry({
      credentials: xdr.SorobanCredentials.sorobanCredentialsSourceAccount(),
      rootInvocation: buildInvocation(),
    });

  /** Auth entries of the first operation of an encoded envelope. */
  const authOf = (envelopeXdr: string) => {
    const envelope = xdr.TransactionEnvelope.fromXdr(envelopeXdr, "base64");
    const op = xdr.expectUnionVariant(envelope, "envelopeTypeTx").v1.tx
      .operations[0];

    return xdr.expectUnionVariant(op.body, "invokeHostFunction")
      .invokeHostFunctionOp.auth;
  };

  it("puts the signed entries into the resulting XDR", async () => {
    const signed = await authorizeInvocation({
      signer: Keypair.random(),
      validUntilLedgerSeq: 1_000_000,
      invocation: buildInvocation(),
      networkPassphrase: NETWORK,
      authV2: false,
    });

    const result = replaceAuthEntries(buildTx([unsignedEntry()]), [
      signed.toXdr("base64"),
    ]);

    expect(authOf(result).map((entry) => entry.toXdr("base64"))).toEqual([
      signed.toXdr("base64"),
    ]);
  });

  it("replaces the existing entries rather than appending to them", async () => {
    const signed = await authorizeInvocation({
      signer: Keypair.random(),
      validUntilLedgerSeq: 1_000_000,
      invocation: buildInvocation(),
      networkPassphrase: NETWORK,
      authV2: false,
    });

    const result = replaceAuthEntries(buildTx([unsignedEntry()]), [
      signed.toXdr("base64"),
    ]);

    expect(authOf(result)).toHaveLength(1);
    expect(isAddressAuthEntry(authOf(result)[0])).toBe(true);
  });

  it("leaves the source transaction untouched", async () => {
    const signed = await authorizeInvocation({
      signer: Keypair.random(),
      validUntilLedgerSeq: 1_000_000,
      invocation: buildInvocation(),
      networkPassphrase: NETWORK,
      authV2: false,
    });
    const transaction = buildTx([unsignedEntry()]);
    const before = transaction.toXdr();

    replaceAuthEntries(transaction, [signed.toXdr("base64")]);

    expect(transaction.toXdr()).toBe(before);
    expect(authOf(before).map((entry) => entry.credentials.type)).toEqual([
      "sorobanCredentialsSourceAccount",
    ]);
  });
});
