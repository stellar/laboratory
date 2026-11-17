import {
  Account,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import {
  collectTransactionSignatures,
  getWalletSignatures,
  getWalletSigningResult,
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
    original.sign(Keypair.random());
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

  it("adopts a wallet-modified envelope when no prior signatures need preserving", () => {
    const original = build();
    const modified = build();
    const signer = Keypair.random();
    modified.sign(signer);
    const result = getWalletSigningResult(
      original.toXDR(),
      modified.toXDR(),
      Networks.TESTNET,
    );
    const adopted = TransactionBuilder.fromXdr(
      result.xdrToSign,
      Networks.TESTNET,
    );
    expect(Buffer.from(adopted.hash())).toEqual(Buffer.from(modified.hash()));
    expect(adopted.signatures).toHaveLength(0);
    expect(result.signatures).toHaveLength(1);
    expect(
      signer.verify(adopted.hash(), result.signatures[0].signature.toBytes()),
    ).toBe(true);

    const secondSigner = Keypair.random();
    adopted.sign(secondSigner);
    const next = getWalletSigningResult(
      result.xdrToSign,
      adopted.toXDR(),
      Networks.TESTNET,
      result.signatures,
    );
    const signatures = mergeTransactionSignatures(
      result.signatures,
      next.signatures,
    );
    expect(signatures).toHaveLength(2);
    expect(
      secondSigner.verify(adopted.hash(), signatures[1].signature.toBytes()),
    ).toBe(true);
  });

  it("rejects modifications when earlier signatures were collected separately", () => {
    const original = build();
    original.sign(Keypair.random());
    const preserved = original.signatures.splice(0);
    const modified = build();
    modified.sign(Keypair.random());
    expect(() =>
      getWalletSigningResult(
        original.toXDR(),
        modified.toXDR(),
        Networks.TESTNET,
        preserved,
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

it("permits a fee-bump fee adjustment while preserving signed inner transactions", () => {
  const inner = buildTransaction();
  inner.sign(Keypair.random());
  const feeSource = Keypair.random();
  const original = TransactionBuilder.buildFeeBumpTransaction(
    feeSource.publicKey(),
    "100",
    inner,
    Networks.TESTNET,
  );
  const adjusted = TransactionBuilder.buildFeeBumpTransaction(
    feeSource.publicKey(),
    "200",
    inner,
    Networks.TESTNET,
  );
  adjusted.sign(feeSource);
  const result = getWalletSigningResult(
    original.toXDR(),
    adjusted.toXDR(),
    Networks.TESTNET,
  );
  expect(result.signatures).toHaveLength(1);
  expect(
    Buffer.from(
      TransactionBuilder.fromXdr(result.xdrToSign, Networks.TESTNET).hash(),
    ),
  ).toEqual(Buffer.from(adjusted.hash()));

  const changedInner = buildTransaction();
  const invalid = TransactionBuilder.buildFeeBumpTransaction(
    feeSource.publicKey(),
    "200",
    changedInner,
    Networks.TESTNET,
  );
  invalid.sign(feeSource);
  expect(() =>
    getWalletSigningResult(original.toXDR(), invalid.toXDR(), Networks.TESTNET),
  ).toThrow("wallet changed the transaction");
});

it("counts unique added signatures across methods, excluding imported signatures", () => {
  const tx = buildTransaction();
  tx.sign(Keypair.random(), Keypair.random(), Keypair.random());
  const [imported, repeated, unique] = tx.signatures;
  const groups = {
    secretKey: [repeated, repeated],
    hardwareWallet: [repeated, unique],
    extensionWallet: [imported, repeated],
    signature: [unique],
  };
  const collected = collectTransactionSignatures([imported], groups);
  expect(collected.signatures).toHaveLength(3);
  expect(collected.counts).toEqual({
    secretKey: 1,
    hardwareWallet: 1,
    extensionWallet: 0,
    signature: 0,
  });
  expect(
    Object.values(collected.counts).reduce((sum, value) => sum + value, 0),
  ).toBe(collected.signatures.length - 1);
  // Clearing one source keeps duplicate signatures owned by another source.
  const cleared = collectTransactionSignatures([imported], {
    ...groups,
    secretKey: [],
  });
  expect(cleared.signatures).toHaveLength(3);
  expect(cleared.counts).toEqual({
    secretKey: 0,
    hardwareWallet: 2,
    extensionWallet: 0,
    signature: 0,
  });
  expect(groups.secretKey).toHaveLength(2);
});

it("deduplicates badges and success counts when hardware and extension use the same key", async () => {
  const signer = Keypair.random();
  const tx = new TransactionBuilder(new Account(signer.publicKey(), "1"), {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.manageData({ name: "duplicate", value: "test" }))
    .setTimeout(0)
    .build();
  const original = tx.toXDR();
  tx.sign(signer);
  const signTx = jest.fn().mockResolvedValue(tx.toXDR());
  (useSignWithExtensionWallet as jest.Mock).mockReturnValue({
    signTx,
    isLoading: false,
  });
  (txHelper.signWithLedger as jest.Mock).mockResolvedValue({
    signature: tx.signatures,
  });
  const onDoneAction = jest.fn();
  const boundary = render(() =>
    SignTransactionXdr({ id: "test", xdrToSign: original, onDoneAction }),
  );
  cells = [];
  const draw = () => boundary.type(boundary.props);
  const button = (session: any, type: string) =>
    find(
      find(session, (node) => node.props?.["data-type"] === type),
      (node) => node.type?.name === "SignTxButton",
    );
  button(render(draw), "extensionWallet").props.onSign();
  await new Promise((resolve) => setImmediate(resolve));
  find(render(draw), (node) => node.type === "select").props.onChange({
    target: { value: "ledger" },
  });
  button(render(draw), "hardwareWallet").props.onSign();
  await new Promise((resolve) => setImmediate(resolve));
  const output = onDoneAction.mock.calls.at(-1)[0];
  expect(
    TransactionBuilder.fromXdr(output.signedXdr, Networks.TESTNET).signatures,
  ).toHaveLength(1);
  expect(output.successMessage).toBe("1 hardware wallet signature added");
  const session = render(draw);
  const badge = (type: string) =>
    find(
      session,
      (node) => node.type?.name === "Tab" && node.props.id === `test-${type}`,
    ).props.signatureCount;
  expect([
    badge("secretKey"),
    badge("hardwareWallet"),
    badge("extensionWallet"),
    badge("signature"),
  ]).toEqual([0, 1, 0, 0]);
  expect(button(session, "extensionWallet").props.successMsg).toBe(
    "No new signatures added",
  );
  button(session, "hardwareWallet").props.onClear();
  await new Promise((resolve) => setImmediate(resolve));
  expect(onDoneAction.mock.calls.at(-1)[0].successMessage).toBe(
    "1 extension wallet signature added",
  );
  expect(
    TransactionBuilder.fromXdr(
      onDoneAction.mock.calls.at(-1)[0].signedXdr,
      Networks.TESTNET,
    ).signatures,
  ).toHaveLength(1);
});
