import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { FEE_BUMP_TX_FIELDS } from "../../src/constants/signTransactionPage";

describe("FEE_BUMP_TX_FIELDS", () => {
  it("formats the inner transaction hash as hex", () => {
    const innerSource = Keypair.random();
    const innerTransaction = new TransactionBuilder(
      new Account(innerSource.publicKey(), "0"),
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
    const feeBumpTransaction = TransactionBuilder.buildFeeBumpTransaction(
      Keypair.random().publicKey(),
      BASE_FEE,
      innerTransaction,
      Networks.TESTNET,
    );

    const hashField = FEE_BUMP_TX_FIELDS(feeBumpTransaction).find(
      ({ label }) => label === "Inner transaction hash",
    );

    expect(hashField?.value).toBe(
      Buffer.from(innerTransaction.hash()).toString("hex"),
    );
    expect(hashField?.value).toMatch(/^[0-9a-f]{64}$/);
  });
});