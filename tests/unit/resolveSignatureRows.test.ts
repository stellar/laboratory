import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { resolveSignatureRows } from "../../src/app/(sidebar)/transaction/components/resolveSignatureRows";

describe("resolveSignatureRows", () => {
  it("preserves hex signature values and verifies the signer", () => {
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

    const rows = resolveSignatureRows(
      transaction.signatures,
      [signer.publicKey()],
      transaction.hash(),
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      hint: Buffer.from(signer.signatureHint()).toString("hex"),
      signature: Buffer.from(
        transaction.signatures[0].signature.toBytes(),
      ).toString("hex"),
      signerPubKey: signer.publicKey(),
      matchStatus: "valid",
    });
  });
});