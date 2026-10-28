import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import TrezorConnect from "@trezor/connect-web";

import { txHelper } from "../../src/helpers/txHelper";
import { transformTrezorTransaction } from "../../src/helpers/trezorTransform";

jest.mock("@trezor/connect-web", () => ({
  __esModule: true,
  default: {
    init: jest.fn().mockResolvedValue(undefined),
    stellarSignTransaction: jest.fn(),
  },
}));

const stellarSignTransaction =
  TrezorConnect.stellarSignTransaction as jest.Mock;

const buildSignedTransaction = () => {
  const signer = Keypair.random();
  const transaction = new TransactionBuilder(
    new Account(signer.publicKey(), "0"),
    {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    },
  )
    .addOperation(
      Operation.payment({
        destination: Keypair.random().publicKey(),
        asset: Asset.native(),
        amount: "1",
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(signer);

  return { signer, transaction };
};

describe("txHelper signature encoding", () => {
  it("extracts decorated signatures as hex", () => {
    const { signer, transaction } = buildSignedTransaction();
    const [decoratedSignature] = transaction.signatures;

    expect(
      txHelper.extractSignaturesFromTx({
        txXdr: transaction.toXdr(),
        networkPassphrase: Networks.TESTNET,
      }),
    ).toEqual([
      {
        signature: Buffer.from(decoratedSignature.signature.toBytes()).toString(
          "hex",
        ),
        hint: Buffer.from(signer.signatureHint()).toString("hex"),
      },
    ]);
  });

  it("rejects a signer whose hex hint already exists", () => {
    const { signer, transaction } = buildSignedTransaction();
    const existingSignatures = txHelper.extractSignaturesFromTx({
      txXdr: transaction.toXdr(),
      networkPassphrase: Networks.TESTNET,
    });

    const result = txHelper.decoratedSigFromHexSig(
      [
        {
          signature: Buffer.from(signer.sign(new Uint8Array([1]))).toString(
            "hex",
          ),
          publicKey: signer.publicKey(),
        },
      ],
      existingSignatures,
    );

    expect(result.signature).toEqual([]);
    expect(result.errorMsg).toContain("has already signed this transaction");
  });
});
describe("txHelper.getVerifiedHardwareSignature", () => {
  it("wraps a valid signature with the signer's hint", () => {
    const { signer, transaction } = buildSignedTransaction();
    const signature = signer.sign(transaction.hash());

    const [decorated] = txHelper.getVerifiedHardwareSignature({
      publicKey: signer.publicKey(),
      signature,
      transaction,
    });

    expect(Buffer.from(decorated.hint.toBytes())).toEqual(
      Buffer.from(signer.signatureHint()),
    );
    expect(Buffer.from(decorated.signature.toBytes())).toEqual(
      Buffer.from(signature),
    );
  });

  it("rejects a signature made by a different key", () => {
    const { signer, transaction } = buildSignedTransaction();
    const otherSigner = Keypair.random();

    expect(() =>
      txHelper.getVerifiedHardwareSignature({
        publicKey: signer.publicKey(),
        signature: otherSigner.sign(transaction.hash()),
        transaction,
      }),
    ).toThrow("doesn’t match this transaction");
  });

  it("rejects a signature of a different transaction", () => {
    const { signer, transaction } = buildSignedTransaction();
    const { transaction: otherTransaction } = buildSignedTransaction();

    expect(() =>
      txHelper.getVerifiedHardwareSignature({
        publicKey: signer.publicKey(),
        signature: signer.sign(otherTransaction.hash()),
        transaction,
      }),
    ).toThrow("doesn’t match this transaction");
  });

  it("rejects a malformed signature", () => {
    const { signer, transaction } = buildSignedTransaction();

    expect(() =>
      txHelper.getVerifiedHardwareSignature({
        publicKey: signer.publicKey(),
        signature: Buffer.alloc(10),
        transaction,
      }),
    ).toThrow();
  });
});

describe("txHelper.signWithTrezor", () => {
  const BIP_PATH = "m/44'/148'/0'";
  const signer = Keypair.random();

  const buildTrezorTx = (
    networkPassphrase: string,
    operation: xdr.Operation = Operation.payment({
      destination: Keypair.random().publicKey(),
      asset: Asset.native(),
      amount: "1",
    }),
  ) =>
    new TransactionBuilder(new Account(signer.publicKey(), "0"), {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

  // Signs with a mocked Trezor and returns the params sent to Connect.
  const signAndGetParams = async (transaction: Transaction) => {
    stellarSignTransaction.mockResolvedValueOnce({
      success: true,
      payload: {
        publicKey: Buffer.from(signer.rawPublicKey()).toString("hex"),
        signature: Buffer.from(signer.sign(transaction.hash())).toString("hex"),
      },
    });

    const result = await txHelper.signWithTrezor({
      bipPath: BIP_PATH,
      transaction,
    });

    expect(result.error).toBeUndefined();
    expect(result.signature).toHaveLength(1);
    expect(stellarSignTransaction).toHaveBeenCalledTimes(1);

    return stellarSignTransaction.mock.calls[0][0];
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sends the XDR form with testnet false on public", async () => {
    const transaction = buildTrezorTx(Networks.PUBLIC);

    expect(await signAndGetParams(transaction)).toEqual({
      path: BIP_PATH,
      xdrBase64: transaction.toXdr(),
      testnet: false,
    });
  });

  it("sends the XDR form with testnet true on testnet", async () => {
    const transaction = buildTrezorTx(Networks.TESTNET);

    expect(await signAndGetParams(transaction)).toEqual({
      path: BIP_PATH,
      xdrBase64: transaction.toXdr(),
      testnet: true,
    });
  });

  it("sends the object form with the passphrase on other networks", async () => {
    const transaction = buildTrezorTx(Networks.FUTURENET);

    expect(await signAndGetParams(transaction)).toEqual({
      path: BIP_PATH,
      networkPassphrase: Networks.FUTURENET,
      transaction: transformTrezorTransaction(transaction),
    });
  });

  it("sends the object form for a Manage Data removal on public", async () => {
    const transaction = buildTrezorTx(
      Networks.PUBLIC,
      Operation.manageData({ name: "k", value: null }),
    );

    expect(await signAndGetParams(transaction)).toEqual({
      path: BIP_PATH,
      networkPassphrase: Networks.PUBLIC,
      transaction: transformTrezorTransaction(transaction),
    });
  });
});
