"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

export const SorobanTransactionXdr = () => {
  const { network, transaction } = useStore();
  const { isValid } = transaction.build;
  const { build, setBuildSorobanXdr } = useBuildFlowStore();
  const { soroban } = build;

  useEffect(() => {
    // Reset transaction.xdr if the transaction is not valid
    if (!(isValid.params && isValid.operations)) {
      setBuildSorobanXdr("");
    }
    // Not including setBuildSorobanXdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.params, isValid.operations]);

  // Sync soroban XDR to the new flow store
  useEffect(() => {
    setBuildSorobanXdr(soroban.xdr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soroban.xdr]);

  if (!(isValid.params && isValid.operations)) {
    return null;
  }

  if (soroban.xdr) {
    try {
      const txnHash = TransactionBuilder.fromXDR(
        soroban.xdr,
        network.passphrase,
      )
        .hash()
        .toString("hex");

      return (
        <TransactionXdrDisplay
          xdr={soroban.xdr}
          networkPassphrase={network.passphrase}
          txnHash={txnHash}
          dataTestId="build-soroban-transaction-envelope-xdr"
          txType="smart-contract"
        />
      );
    } catch (e: any) {
      return (
        <ValidationResponseCard
          variant="error"
          title="Transaction Error:"
          response={e.toString()}
        />
      );
    }
  }

  return null;
};
