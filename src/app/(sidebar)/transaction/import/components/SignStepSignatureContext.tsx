import { useMemo } from "react";
import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { Alert } from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import {
  getTxSignatureCompleteness,
  TxSignatureCompleteness,
} from "@/helpers/checkRequiredSignatures";

import { Box } from "@/components/layout/Box";
import { Signatures } from "@/app/(sidebar)/transaction/components/Signatures";

type Props = {
  /** The transaction to show signature context for (imported or freshly signed). */
  xdr: string;
  parsedTxType?: "classic" | "soroban" | null;
};

type AlertVariant = "primary" | "success" | "warning" | "error";

const hasAnySignature = (tx: Transaction | FeeBumpTransaction): boolean =>
  tx instanceof FeeBumpTransaction
    ? tx.signatures.length > 0 || tx.innerTransaction.signatures.length > 0
    : tx.signatures.length > 0;

/**
 * The one actionable takeaway for the sign step. Deliberately generic — the
 * `<Signatures />` table below carries the per-signer specifics (which signers
 * are missing, which can't be verified). We never claim "this step is
 * optional": for a multisig tx we can't tell offline whether the account's
 * threshold is met, so the copy leaves that decision to the user.
 */
const getContextMessage = (
  completeness: TxSignatureCompleteness,
): { variant: AlertVariant; message: string } => {
  if (completeness.hasInvalid) {
    return {
      variant: "error",
      message:
        "This transaction carries invalid signature(s) that won’t be accepted at submission. Review the signatures below before signing.",
    };
  }

  if (completeness.missingSigners.length > 0) {
    return {
      variant: "warning",
      message:
        "This transaction still needs additional signature(s). If you’re a required signer, add yours below.",
    };
  }

  if (completeness.hasUnrecognizedSigners) {
    return {
      variant: "primary",
      message:
        "This transaction already carries signature(s) that can’t be verified offline (e.g. multisig cosigners). Add another only if a cosigner still needs to sign — otherwise you can continue to submit.",
    };
  }

  return {
    variant: "success",
    message:
      "This transaction already has every signature that can be verified offline. Adding more may be rejected as unnecessary — you can continue to submit.",
  };
};

/**
 * Signature context shown at the top of the sign step for the import flow.
 *
 * Renders an accurate, state-driven message plus the full `<Signatures />`
 * breakdown so a co-signer can see who has signed (and who hasn't) before
 * deciding whether to add their signature. Reflects the freshly-signed
 * envelope once the user signs, so an added signature shows immediately.
 *
 * Returns `null` when the transaction has no signatures (e.g. the build flow,
 * or an unsigned import), leaving the sign step unchanged for those cases.
 */
export const SignStepSignatureContext = ({ xdr, parsedTxType }: Props) => {
  const { network } = useStore();

  const tx = useMemo(() => {
    if (!xdr) return null;
    try {
      return TransactionBuilder.fromXDR(xdr, network.passphrase) as
        | Transaction
        | FeeBumpTransaction;
    } catch {
      return null;
    }
  }, [xdr, network.passphrase]);

  if (!tx || !hasAnySignature(tx)) {
    return null;
  }

  const { variant, message } = getContextMessage(getTxSignatureCompleteness(tx));

  return (
    <Box gap="md">
      <Alert variant={variant} placement="inline">
        {message}
      </Alert>

      <Signatures tx={tx} parsedTxType={parsedTxType} />
    </Box>
  );
};
