import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

import { getPublicKey } from "@/helpers/getPublicKey";

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
    if (op.source) seen.add(getPublicKey(op.source));
  }
  return Array.from(seen);
};
