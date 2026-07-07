import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

import { getPublicKey } from "@/helpers/getPublicKey";
import {
  findKeyBySignatureHint,
  verifySignature,
} from "@/helpers/signatureHint";

export type Envelope = "outer" | "inner";

export type EnvelopeRequirement = {
  envelope: Envelope;
  signers: string[];
  hash: Buffer;
};

/**
 * Collect the accounts whose signature could be required for each envelope
 * of a transaction, derived purely from the transaction itself.
 *
 *   - Fee-bump: outer envelope needs the fee source; inner envelope needs
 *     the inner tx source and any operation sources.
 *   - Regular tx: outer envelope needs the tx source and any operation
 *     sources.
 *
 * All returned account strings are normalized to ed25519 G-addresses via
 * getPublicKey (so muxed sources are unwrapped). Per-envelope signers are
 * deduped.
 *
 * Intentionally offline — does not consult RPC/Horizon, so on-chain
 * cosigners (multisig signers added via SetOptions) are not visible here.
 * Treat the returned set as a best-effort lower bound for "who could have
 * signed this envelope," not an authoritative authorization check.
 */
export const getRequiredSigners = (
  tx: Transaction | FeeBumpTransaction,
): EnvelopeRequirement[] => {
  if (tx instanceof FeeBumpTransaction) {
    const inner = tx.innerTransaction;
    return [
      {
        envelope: "outer",
        signers: [getPublicKey(tx.feeSource)],
        hash: tx.hash(),
      },
      {
        envelope: "inner",
        signers: collectTxSigners(inner),
        hash: inner.hash(),
      },
    ];
  }
  return [
    {
      envelope: "outer",
      signers: collectTxSigners(tx),
      hash: tx.hash(),
    },
  ];
};

const collectTxSigners = (tx: Transaction): string[] => {
  const seen = new Set<string>();
  seen.add(getPublicKey(tx.source));
  for (const op of tx.operations) {
    if (op.source) {
      seen.add(getPublicKey(op.source));
    }
  }
  return Array.from(seen);
};

export type TxSignatureCompleteness = {
  isComplete: boolean;
  hasInvalid: boolean;
  // Required signers (distinct source accounts) lacking a valid signature.
  missingSigners: string[];
  // True when a signature is present whose hint matches no required signer —
  // i.e. it can't be attributed or verified offline. The likely cause is an
  // on-chain multisig cosigner
  hasUnrecognizedSigners: boolean;
};

/**
 * Offline assessment of whether a transaction carries all the signatures it
 * needs, evaluated purely from the envelope (no RPC/Horizon). A required
 * signer is "covered" once it has at least one valid signature
 *
 * Multisig caveat: a multisig account is often signed by on-chain cosigners
 * rather than the account key itself, so the required source account can show
 * as "missing" while the tx may in fact satisfy the account's thresholds. Those
 * cosigner signatures surface as unrecognized (their hints match no required
 * signer), flagged separately via `hasUnrecognizedSigners`.
 *
 * `isComplete` reflects only what can be verified offline: it is true only when
 * every envelope-derivable required signer has a valid signature. It does NOT
 * defer to the network for the unrecognized case — a multisig tx signed solely
 * by cosigners reads as incomplete here so the flow routes the user through the
 * sign step (rather than skipping straight to submit), where they can review
 * the existing signatures and add their own if needed. `hasUnrecognizedSigners`
 * is surfaced so the UI can explain that offline completeness is inconclusive
 * and the network remains the final authority on thresholds.
 */
export const getTxSignatureCompleteness = (
  tx: Transaction | FeeBumpTransaction,
): TxSignatureCompleteness => {
  let hasInvalid = false;
  let hasUnrecognizedSigners = false;
  const missingSigners: string[] = [];

  for (const env of getRequiredSigners(tx)) {
    const signatures =
      env.envelope === "outer"
        ? tx.signatures
        : (tx as FeeBumpTransaction).innerTransaction.signatures;
    const hashHex = env.hash.toString("hex");

    const validSignerKeys = new Set<string>();
    for (const sig of signatures) {
      const hint = sig.hint().toString("hex");
      const signerPubKey = findKeyBySignatureHint(hint, env.signers);
      // Signature from a signer not derivable from the envelope (e.g. an
      // on-chain multisig cosigner) — can't be verified offline.
      if (!signerPubKey) {
        hasUnrecognizedSigners = true;
        continue;
      }

      const signature = sig.signature().toString("hex");
      if (verifySignature({ hint, signature }, signerPubKey, hashHex)) {
        validSignerKeys.add(signerPubKey);
      } else {
        hasInvalid = true;
      }
    }

    for (const signer of env.signers) {
      if (!validSignerKeys.has(signer)) {
        missingSigners.push(signer);
      }
    }
  }

  return {
    isComplete: !hasInvalid && missingSigners.length === 0,
    hasInvalid,
    missingSigners,
    hasUnrecognizedSigners,
  };
};
