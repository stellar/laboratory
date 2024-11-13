import { TransactionBuilder } from "@stellar/stellar-sdk";

export const getClaimableBalanceIdFromXdr = ({
  xdr,
  networkPassphrase,
  opIndex,
}: {
  xdr: string;
  networkPassphrase: string;
  opIndex: number;
}) => {
  if (!(xdr && networkPassphrase)) {
    return "";
  }

  const txn = TransactionBuilder.fromXDR(xdr, networkPassphrase);
  let balanceId = "";

  try {
    balanceId = (txn as any).getClaimableBalanceId(opIndex);
  } catch (e) {
    // Do nothing
  }

  return balanceId;
};
