import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { Signatures } from "@/app/(sidebar)/transaction/components/Signatures";

type Props = {
  /** The transaction to show signature context for (imported or freshly signed). */
  xdr: string;
  parsedTxType?: "classic" | "soroban" | null;
};

const hasAnySignature = (tx: Transaction | FeeBumpTransaction): boolean =>
  tx instanceof FeeBumpTransaction
    ? tx.signatures.length > 0 || tx.innerTransaction.signatures.length > 0
    : tx.signatures.length > 0;

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

  return (
    <Box gap="md">
      <Signatures tx={tx} parsedTxType={parsedTxType} />
    </Box>
  );
};
