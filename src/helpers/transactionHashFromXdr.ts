import { TransactionBuilder } from "@stellar/stellar-sdk";

export const transactionHashFromXdr = (
  xdr: string,
  networkPassphrase: string,
) => TransactionBuilder.fromXDR(xdr, networkPassphrase).hash().toString("hex");
