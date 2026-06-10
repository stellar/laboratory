import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  MuxedAccount,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { getRequiredSigners } from "../../src/helpers/checkRequiredSignatures";

const NETWORK = Networks.TESTNET;
const DESTINATION = Keypair.random().publicKey();

/**
 * Build a classic payment transaction with the given source account and one
 * payment operation per entry in `opSources` (an `undefined` entry means the
 * operation inherits the tx source).
 */
const buildTx = (
  source: string,
  opSources: Array<string | undefined> = [undefined],
): Transaction => {
  const builder = new TransactionBuilder(new Account(source, "0"), {
    fee: BASE_FEE,
    networkPassphrase: NETWORK,
  });

  for (const opSource of opSources) {
    builder.addOperation(
      Operation.payment({
        destination: DESTINATION,
        asset: Asset.native(),
        amount: "1",
        ...(opSource ? { source: opSource } : {}),
      }),
    );
  }

  return builder.setTimeout(30).build();
};

const muxedAddress = (baseAddress: string, id = "1"): string =>
  new MuxedAccount(new Account(baseAddress, "0"), id).accountId();

describe("getRequiredSigners()", () => {
  describe("regular (non-fee-bump) transaction", () => {
    it("returns a single outer envelope with just the tx source", () => {
      const source = Keypair.random().publicKey();
      const tx = buildTx(source);

      const result = getRequiredSigners(tx);

      expect(result).toHaveLength(1);
      expect(result[0].envelope).toBe("outer");
      expect(result[0].signers).toEqual([source]);
    });

    it("uses the transaction hash for the outer envelope", () => {
      const tx = buildTx(Keypair.random().publicKey());

      const [outer] = getRequiredSigners(tx);

      expect(outer.hash.toString("hex")).toBe(tx.hash().toString("hex"));
    });

    it("includes distinct operation source accounts alongside the tx source", () => {
      const source = Keypair.random().publicKey();
      const opSourceA = Keypair.random().publicKey();
      const opSourceB = Keypair.random().publicKey();
      const tx = buildTx(source, [opSourceA, opSourceB]);

      const [outer] = getRequiredSigners(tx);

      // Source first, then operation sources in order.
      expect(outer.signers).toEqual([source, opSourceA, opSourceB]);
    });

    it("dedupes an operation source that matches the tx source", () => {
      const source = Keypair.random().publicKey();
      const tx = buildTx(source, [source, undefined]);

      const [outer] = getRequiredSigners(tx);

      expect(outer.signers).toEqual([source]);
    });

    it("normalizes a muxed operation source to its ed25519 address", () => {
      const source = Keypair.random().publicKey();
      const opBase = Keypair.random().publicKey();
      const tx = buildTx(source, [muxedAddress(opBase)]);

      const [outer] = getRequiredSigners(tx);

      expect(outer.signers).toEqual([source, opBase]);
    });
  });

  describe("fee-bump transaction", () => {
    it("returns an outer (fee source) and inner (inner signers) envelope", () => {
      const innerSource = Keypair.random().publicKey();
      const opSource = Keypair.random().publicKey();
      const feeSource = Keypair.random().publicKey();
      const innerTx = buildTx(innerSource, [opSource]);

      const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        BASE_FEE,
        innerTx,
        NETWORK,
      );

      const result = getRequiredSigners(feeBumpTx);

      expect(result).toHaveLength(2);

      const outer = result.find((e) => e.envelope === "outer");
      const inner = result.find((e) => e.envelope === "inner");

      expect(outer?.signers).toEqual([feeSource]);
      expect(inner?.signers).toEqual([innerSource, opSource]);
    });

    it("uses the fee-bump hash for outer and the inner-tx hash for inner", () => {
      const innerTx = buildTx(Keypair.random().publicKey());
      const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
        Keypair.random().publicKey(),
        BASE_FEE,
        innerTx,
        NETWORK,
      );

      const result = getRequiredSigners(feeBumpTx);
      const outer = result.find((e) => e.envelope === "outer");
      const inner = result.find((e) => e.envelope === "inner");

      expect(outer?.hash.toString("hex")).toBe(
        feeBumpTx.hash().toString("hex"),
      );
      expect(inner?.hash.toString("hex")).toBe(
        feeBumpTx.innerTransaction.hash().toString("hex"),
      );
    });
  });
});
