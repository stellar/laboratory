import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { txHelper } from "../../src/helpers/txHelper";

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