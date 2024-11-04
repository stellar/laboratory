import { Input } from "@stellar/design-system";
import { transactionHashFromXdr } from "@/helpers/transactionHashFromXdr";

export const TransactionHashReadOnlyField = ({
  xdr,
  networkPassphrase,
}: {
  xdr: string;
  networkPassphrase: string;
}) => {
  if (!xdr) {
    return null;
  }

  const hashValue = transactionHashFromXdr(xdr, networkPassphrase);

  if (!hashValue) {
    return null;
  }

  return (
    <Input
      id="tx-hash"
      fieldSize="md"
      label="Transaction hash"
      value={transactionHashFromXdr(xdr, networkPassphrase)}
      copyButton={{ position: "right" }}
      disabled
    />
  );
};
