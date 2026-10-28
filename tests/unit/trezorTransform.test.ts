import {
  Account,
  Address,
  Asset,
  Keypair,
  LiquidityPoolAsset,
  LiquidityPoolFeeV18,
  Memo,
  MemoText,
  MuxedAccount,
  Networks,
  Operation,
  SorobanDataBuilder,
  StrKey,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk";

import {
  assertTrezorCanSign,
  needsTrezorObjectForm,
  transformTrezorTransaction,
} from "../../src/helpers/trezorTransform";

const SOURCE = Keypair.random().publicKey();
const DESTINATION = Keypair.random().publicKey();
const ISSUER = Keypair.random().publicKey();
const USD = new Asset("USD", ISSUER);
const MUXED = new MuxedAccount(new Account(DESTINATION, "0"), "1").accountId();

const buildTx = ({
  operations,
  memo,
  sorobanData,
  configure,
  timeout = 300,
}: {
  operations: xdr.Operation[];
  memo?: Memo;
  sorobanData?: xdr.SorobanTransactionData;
  configure?: (builder: TransactionBuilder) => void;
  // `null` skips setTimeout so `configure` can set the bounds itself
  timeout?: number | null;
}) => {
  const builder = new TransactionBuilder(new Account(SOURCE, "41"), {
    fee: "250",
    networkPassphrase: Networks.FUTURENET,
    memo,
  });

  operations.forEach((op) => builder.addOperation(op));

  if (sorobanData) {
    builder.setSorobanData(sorobanData);
  }

  configure?.(builder);

  if (timeout !== null) {
    builder.setTimeout(timeout);
  }

  return builder.build();
};

// Round-trip through XDR so the transaction looks exactly like an imported one.
const reparse = (tx: Transaction) =>
  new Transaction(tx.toXdr(), Networks.FUTURENET);

const bump = () => Operation.bumpSequence({ bumpTo: "1" });

// A v1 transaction with no preconditions at all (the builder always sets
// time bounds, so this has to be assembled from XDR).
const withoutPreconditions = (tx: Transaction) => {
  const v1 = tx.tx as xdr.Transaction;
  const envelope = xdr.TransactionEnvelope.envelopeTypeTx(
    new xdr.TransactionV1Envelope({
      tx: new xdr.Transaction({
        sourceAccount: v1.sourceAccount,
        fee: v1.fee,
        seqNum: v1.seqNum,
        cond: xdr.Preconditions.precondNone(),
        memo: v1.memo,
        operations: v1.operations,
        ext: v1.ext,
      }),
      signatures: [],
    }),
  );

  return new Transaction(envelope, Networks.FUTURENET);
};

const signedPayloadSigner = () => {
  const key = Keypair.random();
  const payload = new xdr.SignerKeyEd25519SignedPayload({
    ed25519: new xdr.Uint256Bytes(key.rawPublicKey()),
    payload: Buffer.from("hello"),
  }).toXdr();

  return StrKey.encodeSignedPayload(payload);
};

const contractId = StrKey.encodeContract(Buffer.alloc(32, 9));

const invokeContract = (args: xdr.ScVal[] = []) => {
  const invokeArgs = new xdr.InvokeContractArgs({
    contractAddress: Address.fromString(contractId).toScAddress(),
    functionName: "transfer",
    args,
  });

  return {
    invokeArgs,
    operation: Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(invokeArgs),
      auth: [
        new xdr.SorobanAuthorizationEntry({
          credentials: xdr.SorobanCredentials.sorobanCredentialsSourceAccount(),
          rootInvocation: new xdr.SorobanAuthorizedInvocation({
            function:
              xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                invokeArgs,
              ),
            subInvocations: [],
          }),
        }),
      ],
    }),
  };
};

const sorobanData = new SorobanDataBuilder().setResourceFee(1000).build();

describe("assertTrezorCanSign", () => {
  it.each<[string, () => Transaction]>([
    ["a plain transaction", () => buildTx({ operations: [bump()] })],
    [
      "a multibyte UTF-8 memo",
      () => buildTx({ operations: [bump()], memo: Memo.text("héllo 你好") }),
    ],
    [
      "a Manage Data removal",
      () =>
        buildTx({
          operations: [Operation.manageData({ name: "k", value: null })],
        }),
    ],
    [
      "allowTrust with authorize 1",
      () =>
        buildTx({
          operations: [
            Operation.allowTrust({
              trustor: DESTINATION,
              assetCode: "USD",
              authorize: true,
            }),
          ],
        }),
    ],
    [
      "time bounds at the uint32 limit",
      () =>
        buildTx({
          operations: [bump()],
          configure: (b) => b.setTimebounds(0, 4294967295),
          timeout: null,
        }),
    ],
    [
      "a Soroban invocation with a muxed address argument",
      () =>
        buildTx({
          operations: [
            invokeContract([nativeToScVal(MUXED, { type: "address" })])
              .operation,
          ],
          sorobanData,
        }),
    ],
  ])("accepts %s", (_label, build) => {
    expect(() => assertTrezorCanSign(reparse(build()))).not.toThrow();
  });

  it.each<[string, () => Transaction, RegExp]>([
    [
      "ledger bounds",
      () =>
        buildTx({
          operations: [bump()],
          configure: (b) => b.setLedgerbounds(0, 100),
        }),
      /time bounds as preconditions/,
    ],
    [
      "a minimum account sequence",
      () =>
        buildTx({
          operations: [bump()],
          configure: (b) => b.setMinAccountSequence("1"),
        }),
      /time bounds as preconditions/,
    ],
    [
      "extra signers",
      () =>
        buildTx({
          operations: [bump()],
          configure: (b) => b.setExtraSigners([DESTINATION]),
        }),
      /time bounds as preconditions/,
    ],
    [
      "no time bounds",
      () => withoutPreconditions(buildTx({ operations: [bump()] })),
      /have time bounds/,
    ],
    [
      "time bounds above uint32",
      () =>
        buildTx({
          operations: [bump()],
          configure: (b) => b.setTimebounds(0, 4294967296),
          timeout: null,
        }),
      /uint32/,
    ],
    [
      "a non UTF-8 memo",
      () =>
        buildTx({
          operations: [bump()],
          memo: new Memo(MemoText, new Uint8Array([0xff, 0xfe, 0x41])),
        }),
      /UTF-8 text memos/,
    ],
    [
      "a memo on a Soroban transaction",
      () =>
        buildTx({
          operations: [invokeContract().operation],
          memo: Memo.text("hello"),
          sorobanData,
        }),
      /memo on a Soroban transaction/,
    ],
    [
      "a muxed transaction source",
      () =>
        new TransactionBuilder(
          new MuxedAccount(new Account(DESTINATION, "41"), "1"),
          { fee: "250", networkPassphrase: Networks.FUTURENET },
        )
          .addOperation(bump())
          .setTimeout(300)
          .build(),
      /muxed/,
    ],
    [
      "a muxed operation source",
      () =>
        buildTx({
          operations: [Operation.bumpSequence({ bumpTo: "1", source: MUXED })],
        }),
      /muxed/,
    ],
    [
      "a muxed payment destination",
      () =>
        buildTx({
          operations: [
            Operation.payment({
              destination: MUXED,
              asset: Asset.native(),
              amount: "1",
            }),
          ],
        }),
      /muxed/,
    ],
    [
      "a muxed account merge destination",
      () =>
        buildTx({
          operations: [Operation.accountMerge({ destination: MUXED })],
        }),
      /muxed/,
    ],
    [
      "inflation",
      () => buildTx({ operations: [Operation.inflation({})] }),
      /"inflation" operation/,
    ],
    [
      "an operation type Connect does not know",
      () =>
        buildTx({
          operations: [
            Operation.beginSponsoringFutureReserves({
              sponsoredId: DESTINATION,
            }),
          ],
        }),
      /"beginSponsoringFutureReserves" operation/,
    ],
    [
      "allowTrust with maintain liabilities",
      () =>
        buildTx({
          operations: [
            Operation.allowTrust({
              trustor: DESTINATION,
              assetCode: "USD",
              authorize: 2,
            }),
          ],
        }),
      /maintain liabilities/,
    ],
    [
      "an empty Manage Data value",
      () =>
        buildTx({
          operations: [Operation.manageData({ name: "k", value: "" })],
        }),
      /empty Manage Data value/,
    ],
    [
      "liquidity pool shares",
      () =>
        buildTx({
          operations: [
            Operation.changeTrust({
              asset: new LiquidityPoolAsset(
                Asset.native(),
                USD,
                LiquidityPoolFeeV18,
              ),
              limit: "1",
            }),
          ],
        }),
      /liquidity pool/,
    ],
    [
      "a signed payload signer",
      () =>
        buildTx({
          operations: [
            Operation.setOptions({
              signer: {
                ed25519SignedPayload: signedPayloadSigner(),
                weight: 1,
              },
            }),
          ],
        }),
      /signed payload/,
    ],
  ])("rejects %s", (_label, build, message) => {
    expect(() => assertTrezorCanSign(reparse(build()))).toThrow(message);
  });
});

describe("needsTrezorObjectForm", () => {
  it("is true only for a Manage Data removal", () => {
    const removal = reparse(
      buildTx({
        operations: [Operation.manageData({ name: "k", value: null })],
      }),
    );
    const update = reparse(
      buildTx({
        operations: [Operation.manageData({ name: "k", value: "v" })],
      }),
    );

    expect(needsTrezorObjectForm(removal)).toBe(true);
    expect(needsTrezorObjectForm(update)).toBe(false);
  });
});

describe("transformTrezorTransaction", () => {
  it("leaves the value out for a Manage Data removal", () => {
    const tx = reparse(
      buildTx({
        operations: [
          Operation.manageData({ name: "gone", value: null }),
          Operation.manageData({ name: "kept", value: "v" }),
        ],
      }),
    );

    const [removal, update] = transformTrezorTransaction(tx).operations;

    if (removal.type !== "manageData" || update.type !== "manageData") {
      throw new Error("expected manageData operations");
    }

    expect(removal.name).toBe("gone");
    expect(removal.value).toBeUndefined();
    expect(update).toMatchObject({
      name: "kept",
      value: Buffer.from("v").toString("hex"),
    });
  });

  it("produces Connect's object form for a classic transaction", () => {
    const tx = reparse(
      buildTx({
        operations: [
          Operation.payment({
            destination: DESTINATION,
            asset: Asset.native(),
            amount: "1.5",
          }),
        ],
        memo: Memo.text("hello"),
      }),
    );

    const result = transformTrezorTransaction(tx);

    expect(result).toMatchObject({
      source: SOURCE,
      fee: 250,
      sequence: "42",
      memo: { type: 1, text: "hello" },
      timebounds: { minTime: 0, maxTime: Number(tx.timeBounds?.maxTime) },
      operations: [
        {
          type: "payment",
          destination: DESTINATION,
          asset: { type: 0, code: "XLM" },
          amount: "15000000",
        },
      ],
    });
    expect(result.timebounds?.maxTime).toBeGreaterThan(0);
    expect(result.sorobanData).toBeUndefined();
  });

  it("produces Connect's object form for a Soroban invocation", () => {
    const { operation } = invokeContract([
      nativeToScVal(SOURCE, { type: "address" }),
      nativeToScVal("hello", { type: "symbol" }),
      nativeToScVal(42, { type: "u32" }),
      nativeToScVal(BigInt("12345678901234567890"), { type: "i128" }),
    ]);
    const tx = reparse(buildTx({ operations: [operation], sorobanData }));

    const result = transformTrezorTransaction(tx);
    const [op] = result.operations;

    expect(result.sorobanData).toBe(sorobanData.toXdr("hex"));

    if (op.type !== "invokeHostFunction") {
      throw new Error("expected an invokeHostFunction operation");
    }

    expect(op.function).toEqual({
      type: 0,
      invoke_contract: {
        contract_address: contractId,
        function_name: "transfer",
        args: [
          { type: 18, address: SOURCE },
          { type: 15, symbol: "hello" },
          { type: 3, u32: 42 },
          { type: 10, i128: { hi: "0", lo: "12345678901234567890" } },
        ],
      },
    });
    expect(op.auth).toEqual([
      {
        credentials: { type: 0 },
        root_invocation: {
          function: { type: 0, contract_fn: op.function.invoke_contract },
          sub_invocations: [],
        },
      },
    ]);
  });

  it("rejects Soroban shapes Connect cannot sign", () => {
    const tx = reparse(
      buildTx({
        operations: [
          Operation.invokeHostFunction({
            func: xdr.HostFunction.hostFunctionTypeUploadContractWasm(
              Buffer.from([0, 97, 115, 109]),
            ),
            auth: [],
          }),
        ],
        sorobanData,
      }),
    );

    expect(() => transformTrezorTransaction(tx)).toThrow(
      /Unsupported host function type/,
    );
  });
});
