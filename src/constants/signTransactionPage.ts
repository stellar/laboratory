import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

export const FEE_BUMP_TX_FIELDS = (feeBumpTx: FeeBumpTransaction) => [
  {
    label: "Fee source account",
    value: feeBumpTx.feeSource,
  },
  {
    label: "Transaction Fee (stroops)",
    value: feeBumpTx.fee,
  },
  {
    label: "Number of existing signatures",
    value: feeBumpTx.signatures?.length,
  },
  {
    label: "Inner transaction hash",
    value: feeBumpTx.innerTransaction.hash().toString("hex"),
  },
  {
    label: "Inner transaction source account",
    value: feeBumpTx.innerTransaction.source,
  },
  {
    label: "Inner transaction sequence number",
    value: feeBumpTx.innerTransaction.sequence,
  },
  {
    label: "Inner transaction fee (stroops)",
    value: feeBumpTx.innerTransaction.fee,
  },
  {
    label: "Inner transaction number of operations",
    value: feeBumpTx.innerTransaction.operations.length,
  },
  {
    label: "Inner transaction number of existing signatures",
    value: feeBumpTx.innerTransaction.signatures.length,
  },
];
export const TX_FIELDS = (transaction: Transaction) => [
  {
    label: "Source account",
    value: transaction.source,
  },
  {
    label: "Sequence number",
    value: transaction.sequence,
  },
  {
    label: "Transaction Fee (stroops)",
    value: transaction.fee,
  },
  {
    label: "Number of operations",
    value: transaction.operations.length,
  },
  {
    label: "Number of existing signatures",
    value: transaction.signatures.length,
  },
];
