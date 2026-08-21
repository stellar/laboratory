import {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { getTxSignatureCompleteness } from "../../src/helpers/checkRequiredSignatures";

const NETWORK = Networks.TESTNET;
const DESTINATION = Keypair.random().publicKey();

/**
 * Build a classic payment transaction sourced by `source`, with one payment
 * operation per entry in `opSources` (an `undefined` entry means the operation
 * inherits the tx source).
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

/** Re-parse so the tx carries only the signatures we attached. */
const withSignatures = (tx: Transaction, signers: Keypair[]): Transaction => {
  for (const signer of signers) {
    tx.sign(signer);
  }
  return tx;
};

describe("getTxSignatureCompleteness()", () => {
  it("is incomplete with no signatures", () => {
    const source = Keypair.random();
    const result = getTxSignatureCompleteness(buildTx(source.publicKey()));

    expect(result).toEqual({
      isComplete: false,
      hasInvalid: false,
      missingSigners: [source.publicKey()],
      hasUnrecognizedSigners: false,
    });
  });

  it("is complete when every required signer has signed", () => {
    const source = Keypair.random();
    const opSource = Keypair.random();
    const tx = withSignatures(
      buildTx(source.publicKey(), [opSource.publicKey()]),
      [source, opSource],
    );

    expect(getTxSignatureCompleteness(tx)).toEqual({
      isComplete: true,
      hasInvalid: false,
      missingSigners: [],
      hasUnrecognizedSigners: false,
    });
  });

  it("reports the required signers that are still missing", () => {
    const source = Keypair.random();
    const opSource = Keypair.random();
    const tx = withSignatures(
      buildTx(source.publicKey(), [opSource.publicKey()]),
      [opSource],
    );

    const result = getTxSignatureCompleteness(tx);

    expect(result.isComplete).toBe(false);
    expect(result.missingSigners).toEqual([source.publicKey()]);
    expect(result.hasUnrecognizedSigners).toBe(false);
  });

  // A multisig account is typically signed by on-chain cosigners rather than
  // the account key itself. Those signatures can't be attributed offline, so
  // completeness stays false — the import flow routes such a tx through the
  // sign step (rather than jumping to submit) and lets the network have the
  // final say on thresholds.
  it("does not defer to the network when a signature is unattributable", () => {
    const source = Keypair.random();
    const cosigner = Keypair.random();
    const tx = withSignatures(buildTx(source.publicKey()), [cosigner]);

    const result = getTxSignatureCompleteness(tx);

    expect(result.isComplete).toBe(false);
    expect(result.hasUnrecognizedSigners).toBe(true);
    expect(result.hasInvalid).toBe(false);
    expect(result.missingSigners).toEqual([source.publicKey()]);
  });

  it("flags a signature whose hint matches a required signer but doesn't verify", () => {
    const source = Keypair.random();
    // Sign a different transaction, then graft that signature onto ours: the
    // hint still matches `source`, but the signed payload doesn't.
    const otherTx = withSignatures(
      buildTx(source.publicKey(), [undefined, undefined]),
      [source],
    );
    const tx = buildTx(source.publicKey());
    tx.signatures.push(otherTx.signatures[0]);

    const result = getTxSignatureCompleteness(tx);

    expect(result.hasInvalid).toBe(true);
    expect(result.isComplete).toBe(false);
    expect(result.hasUnrecognizedSigners).toBe(false);
    expect(result.missingSigners).toEqual([source.publicKey()]);
  });

  describe("fee-bump transaction", () => {
    const buildFeeBump = (feeSource: string, inner: Transaction) =>
      TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        (Number(BASE_FEE) * 2).toString(),
        inner,
        NETWORK,
      );

    it("is complete only when both envelopes are signed", () => {
      const feeSource = Keypair.random();
      const innerSource = Keypair.random();
      const inner = withSignatures(buildTx(innerSource.publicKey()), [
        innerSource,
      ]);

      const feeBump = buildFeeBump(feeSource.publicKey(), inner);
      expect(getTxSignatureCompleteness(feeBump)).toMatchObject({
        isComplete: false,
        missingSigners: [feeSource.publicKey()],
      });

      feeBump.sign(feeSource);
      expect(getTxSignatureCompleteness(feeBump)).toMatchObject({
        isComplete: true,
        missingSigners: [],
      });
    });

    it("attributes a missing inner signer to the inner envelope", () => {
      const feeSource = Keypair.random();
      const innerSource = Keypair.random();
      const feeBump = buildFeeBump(
        feeSource.publicKey(),
        buildTx(innerSource.publicKey()),
      );
      feeBump.sign(feeSource);

      const result = getTxSignatureCompleteness(feeBump);

      expect(result.isComplete).toBe(false);
      expect(result.missingSigners).toEqual([innerSource.publicKey()]);
    });
  });
});
