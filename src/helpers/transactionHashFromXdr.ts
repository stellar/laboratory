import { TransactionBuilder } from "@stellar/stellar-sdk";

export const transactionHashFromXdr = (
  xdr: string,
  networkPassphrase: string,
) => {
  try {
    // Code to read XDR data
    return TransactionBuilder?.fromXDR(xdr, networkPassphrase)
      .hash()
      .toString("hex");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // @TODO Do nothing for now
    // add amplitude error tracking
    return;
  }
};
