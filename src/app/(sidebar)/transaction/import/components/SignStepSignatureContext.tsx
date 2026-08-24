import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";
import { Card } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { parseTxXdr } from "@/helpers/parseTxXdr";

import { Signatures } from "@/app/(sidebar)/transaction/components/Signatures";

type Props = {
  /** The transaction to show signature context for (imported or freshly signed). */
  xdr: string;
};

const hasAnySignature = (tx: Transaction | FeeBumpTransaction): boolean =>
  tx instanceof FeeBumpTransaction
    ? tx.signatures.length > 0 || tx.innerTransaction.signatures.length > 0
    : tx.signatures.length > 0;

export const SignStepSignatureContext = ({ xdr }: Props) => {
  const { network } = useStore();

  const tx = parseTxXdr(xdr, network.passphrase);

  if (!tx || !hasAnySignature(tx)) {
    return null;
  }

  return (
    <Card>
      <Signatures tx={tx} />
    </Card>
  );
};
