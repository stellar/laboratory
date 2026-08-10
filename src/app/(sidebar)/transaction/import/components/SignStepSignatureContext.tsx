import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { parseTxXdr } from "@/helpers/parseTxXdr";

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

  const tx = parseTxXdr(xdr, network.passphrase);

  if (!tx || !hasAnySignature(tx)) {
    return null;
  }

  return (
    <Box gap="md">
      <Signatures tx={tx} parsedTxType={parsedTxType} />
    </Box>
  );
};
