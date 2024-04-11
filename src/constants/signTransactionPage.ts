import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";

import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";

// {
//   label: "Signing for",
//   type: "all",
//   // component type
// },
// {
//   label: "Transaction Envelope XDR",
//   type: "all",
//   // component type
// },
// {
//   label: "Transaction Hash",
//   type: "all",
//   // component type
// },

const getFeeBumpTxFields = (feeBumpTx: FeeBumpTransaction) => [
  {
    label: "Fee source account",
    value: feeBumpTx.feeSource,
    // component type
  },
  {
    label: "Transaction Fee (stroops)",
    value: feeBumpTx.fee,
    // component type
  },
  {
    label: "Number of existing signatures",
    value: feeBumpTx.signatures.length,
    // component type
  },
  {
    label: "Inner transaction hash",
    value: feeBumpTx.innerTransaction.hash().toString("hex"),
    // component type
  },
  {
    label: "Inner transaction source account",
    value: feeBumpTx.innerTransaction.source,
    // component type
  },
  {
    label: "Inner transaction sequence number",
    value: feeBumpTx.innerTransaction.sequence,
    // component type
  },
  {
    label: "Inner transaction fee (stroops)",
    value: feeBumpTx.innerTransaction.fee,
    // component type
  },
  {
    label: "Inner transaction number of operations",
    value: feeBumpTx.innerTransaction.operations.length,
    // component type
  },
  {
    label: "Inner transaction number of existing signatures",
    value: feeBumpTx.innerTransaction.signatures.length,
    // component type
  },
];
const getTxFields = (transaction: Transaction) => [
  {
    label: "Source account",
    value: transaction.source,
    // component type
  },
  {
    label: "Sequence number",
    value: transaction.sequence,
    // component type
  },
  {
    label: "Transaction Fee (stroops)",
    value: transaction.fee,
    // component type
  },
  {
    label: "Number of operations",
    value: transaction.operations.length,
    // component type
  },
  {
    label: "Number of existing signatures",
    value: transaction.signatures.length,
    // component type
  },
];
