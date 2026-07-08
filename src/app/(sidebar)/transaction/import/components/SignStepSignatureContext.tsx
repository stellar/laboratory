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

  if (
    completeness.missingSigners.length > 0 ||
    completeness.hasUnrecognizedSigners
  ) {
    return {
      variant: "warning",
      message:
        "This transaction already carries signature(s), but offline checks can’t confirm every required signer is covered — a multisig account may be signed by cosigners. If you’re a required signer, add yours below; otherwise you can continue to submit and let the network verify.",
    };
  }

  return {
    variant: "success",
    message:
      "This transaction already has every signature that can be verified offline.",
  };
};

export const SignStepSignatureContext = ({ xdr, parsedTxType }: Props) => {
  const { network } = useStore();

  let tx: Transaction | FeeBumpTransaction | null = null;
  if (xdr) {
    try {
      tx = TransactionBuilder.fromXDR(xdr, network.passphrase) as
        | Transaction
        | FeeBumpTransaction;
    } catch {
      tx = null;
    }
  }

  if (!tx || !hasAnySignature(tx)) {
    return null;
  }

  const { variant, message } = getContextMessage(
    getTxSignatureCompleteness(tx),
  );

  return (
    <Box gap="md">
      <Alert variant={variant} placement="inline">
        {message}
      </Alert>

      <Signatures tx={tx} parsedTxType={parsedTxType} />
    </Box>
  );
};
