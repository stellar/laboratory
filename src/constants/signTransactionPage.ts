import { FeeBumpTransaction } from "@stellar/stellar-sdk";

import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";

type SignTransactionPagesProps = {
  overview: [
    {
      label: "Signing for";
      type: "all";
      // component type
    },
    {
      label: "Transaction Envelope XDR";
      type: "all";
      // component type
    },
    {
      label: "Transaction Hash";
      type: "all";
      // component type
    },
    {
      label: "Fee source account";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Transaction Fee (stroops)";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Number of existing signatures";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction hash";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction source account";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction sequence number";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction fee (stroops)";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction number of operations";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Inner transaction number of existing signatures";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Source account";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Sequence number";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Transaction Fee (stroops)";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Number of operations";
      type: FeeBumpTransaction;
      // component type
    },
    {
      label: "Number of existing signatures";
      type: FeeBumpTransaction;
      // component type
    },
  ];
};
