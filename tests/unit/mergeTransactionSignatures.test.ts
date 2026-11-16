import {
  Account,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import {
  getWalletSignatures,
  mergeTransactionSignatures,
} from "../../src/helpers/mergeTransactionSignatures";

const buildTransaction = () => {
  const source = Keypair.random();
  return new TransactionBuilder(new Account(source.publicKey(), "1"), {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.manageData({ name: "multisig", value: "test" }))
    .setTimeout(0)
    .build();
};

describe.each(["classic", "fee bump"])("%s wallet signatures", (type) => {
  const build = () => {
    const inner = buildTransaction();
    return type === "classic"
      ? inner
      : TransactionBuilder.buildFeeBumpTransaction(
          Keypair.random().publicKey(),
          "100",
          inner,
          Networks.TESTNET,
        );
  };

  it("retains imported and mixed-method signatures across repeated wallet signing", () => {
    const tx = build();
    const signers = Array.from({ length: 5 }, () => Keypair.random());
    tx.sign(signers[0]);
    const original = tx.toXDR();
    const signatureFor = (signer: Keypair) => {
      const signed = TransactionBuilder.fromXdr(original, Networks.TESTNET);
      signed.sign(signer);
      return signed;
    };
    const hardware = signatureFor(signers[1]).signatures.slice(-1);
    const firstWallet = getWalletSignatures(
      original,
      signatureFor(signers[2]).toXDR(),
      Networks.TESTNET,
    );
    const secondWallet = signatureFor(signers[3]);
    secondWallet.sign(signers[4]);
    const extensions = mergeTransactionSignatures(
      firstWallet,
      getWalletSignatures(original, secondWallet.toXDR(), Networks.TESTNET),
      firstWallet,
    );
    const combined = mergeTransactionSignatures(
      tx.signatures,
      hardware,
      extensions,
    );
    expect(combined).toHaveLength(5);
    combined.forEach((sig, index) => {
      expect(signers[index].verify(tx.hash(), sig.signature.toBytes())).toBe(
        true,
      );
    });

    // Clearing one method preserves both the imported and other-method signers.
    expect(mergeTransactionSignatures(tx.signatures, hardware)).toHaveLength(2);
    expect(mergeTransactionSignatures(tx.signatures, extensions)).toHaveLength(
      4,
    );
  });

  it("rejects wallet modifications that would invalidate other signatures", () => {
    const original = build();
    const different = build();
    different.sign(Keypair.random());
    expect(() =>
      getWalletSignatures(
        original.toXDR(),
        different.toXDR(),
        Networks.TESTNET,
      ),
    ).toThrow("wallet changed the transaction");
  });

  it("does not treat existing signatures as newly added signatures", () => {
    const tx = build();
    tx.sign(Keypair.random());
    expect(() =>
      getWalletSignatures(tx.toXDR(), tx.toXDR(), Networks.TESTNET),
    ).toThrow("wallet did not add a signature");
  });
});

it("deduplicates full signatures without dropping colliding hints", () => {
  const hint = Buffer.alloc(4, 1);
  const a = new xdr.DecoratedSignature({
    hint,
    signature: Buffer.alloc(64, 2),
  });
  const b = new xdr.DecoratedSignature({
    hint,
    signature: Buffer.alloc(64, 3),
  });
  const copy = xdr.DecoratedSignature.fromXDR(a.toXDR());
  expect(mergeTransactionSignatures([a], [copy, b])).toEqual([a, b]);
});
