import { MemoNone, MemoText, StrKey, Transaction } from "@stellar/stellar-sdk";
import { transformTransaction } from "@trezor/network-stellar";
import type { StellarTransaction } from "@trezor/connect-web";

const UINT32_MAX = 0xffffffff;

// Operation types Trezor Connect accepts.
const TREZOR_OPERATION_TYPES = new Set<
  Transaction["operations"][number]["type"]
>([
  "createAccount",
  "payment",
  "pathPaymentStrictReceive",
  "pathPaymentStrictSend",
  "createPassiveSellOffer",
  "manageSellOffer",
  "manageBuyOffer",
  "setOptions",
  "changeTrust",
  "allowTrust",
  "accountMerge",
  "manageData",
  "bumpSequence",
  "claimClaimableBalance",
  "invokeHostFunction",
]);

const isUtf8 = (bytes: Uint8Array) => {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
};

const isMuxed = (address: string | undefined) =>
  Boolean(address && StrKey.isValidMed25519PublicKey(address));

/**
 * Throws when a Trezor cannot sign the transaction as is: either the device
 * protocol cannot represent it (it would silently sign something different),
 * or Connect / the device would reject it only after the signing flow starts.
 */
export const assertTrezorCanSign = (transaction: Transaction) => {
  // v0 envelopes have no preconditions field.
  const cond = "cond" in transaction.tx ? transaction.tx.cond : undefined;

  // The device only encodes time bounds; other preconditions would be dropped.
  if (cond?.type === "precondV2") {
    throw new Error(
      "Trezor only supports time bounds as preconditions (no ledger bounds, minimum sequence or extra signers)",
    );
  }

  const { timeBounds, memo, operations } = transaction;

  if (!timeBounds) {
    throw new Error("Trezor requires the transaction to have time bounds");
  }

  // Time bounds are uint32 in the device protocol.
  if (
    Number(timeBounds.minTime) > UINT32_MAX ||
    Number(timeBounds.maxTime) > UINT32_MAX
  ) {
    throw new Error(
      `Trezor only supports time bounds up to ${UINT32_MAX} (uint32)`,
    );
  }

  // The device re-encodes text memos as UTF-8.
  if (
    memo.type === MemoText &&
    memo.value instanceof Uint8Array &&
    !isUtf8(memo.value)
  ) {
    throw new Error("Trezor only supports UTF-8 text memos");
  }

  if (
    memo.type !== MemoNone &&
    operations.some((op) => op.type === "invokeHostFunction")
  ) {
    throw new Error("Trezor does not support a memo on a Soroban transaction");
  }

  if (isMuxed(transaction.source)) {
    throw new Error("Trezor does not support muxed (M...) accounts");
  }

  operations.forEach((op) => {
    if (!TREZOR_OPERATION_TYPES.has(op.type)) {
      throw new Error(`Trezor does not support the "${op.type}" operation`);
    }

    if (
      isMuxed(op.source) ||
      ("destination" in op && isMuxed(op.destination))
    ) {
      throw new Error("Trezor does not support muxed (M...) accounts");
    }

    switch (op.type) {
      case "allowTrust":
        // The device only knows authorized / not authorized.
        if (typeof op.authorize === "number" && op.authorize > 1) {
          throw new Error(
            "Trezor does not support the maintain liabilities flag in Allow Trust",
          );
        }
        break;
      case "manageData":
        // The device treats an empty value as "remove the entry".
        if (op.value && op.value.length === 0) {
          throw new Error("Trezor does not support an empty Manage Data value");
        }
        break;
      case "changeTrust":
        if (op.line.getAssetType() === "liquidity_pool_shares") {
          throw new Error("Trezor does not support liquidity pool shares");
        }
        break;
      case "setOptions":
        if (op.signer && "ed25519SignedPayload" in op.signer) {
          throw new Error("Trezor does not support signed payload signers");
        }
        break;
      default:
        break;
    }
  });
};

/**
 * Manage Data removals must go in object form: Connect's XDR path turns them
 * into `value: null`, which its protobuf encoder rejects.
 */
export const needsTrezorObjectForm = (transaction: Transaction) =>
  transaction.operations.some((op) => op.type === "manageData" && !op.value);

/**
 * Builds the object form of the transaction for `stellarSignTransaction`,
 * using the same transform Connect applies to XDR internally.
 */
export const transformTrezorTransaction = (
  transaction: Transaction,
): StellarTransaction => {
  const transformed = transformTransaction(transaction);

  return {
    ...transformed,
    operations: transformed.operations.map((op) =>
      op.type === "manageData" && op.value === null
        ? { ...op, value: undefined }
        : op,
    ),
    // Connect's generated types mark optional `Uint` fields as required.
  } as StellarTransaction;
};
