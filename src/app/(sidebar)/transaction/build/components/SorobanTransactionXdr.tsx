"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

export const SorobanTransactionXdr = () => {
  const { network, transaction } = useStore();
  const { updateSorobanBuildXdr } = transaction;
  const { soroban, isValid } = transaction.build;
  const { xdr: sorobanXdr } = soroban;
  const setBuildSorobanXdr = useBuildFlowStore(
    (state) => state.setBuildSorobanXdr,
  );

  useEffect(() => {
    // Reset transaction.xdr if the transaction is not valid
    if (!(isValid.params && isValid.operations)) {
      updateSorobanBuildXdr("");
      setBuildSorobanXdr("");
    }
    // Not including updateSorobanBuildXdr, setBuildSorobanXdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.params, isValid.operations]);

  // Sync soroban XDR to the new flow store
  useEffect(() => {
    setBuildSorobanXdr(sorobanXdr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorobanXdr]);

  if (!(isValid.params && isValid.operations)) {
    return null;
  }

  if (sorobanXdr) {
    try {
      const txnHash = TransactionBuilder.fromXDR(
        sorobanXdr,
        network.passphrase,
      )
        .hash()
        .toString("hex");

      return (
        <TransactionXdrDisplay
          xdr={sorobanXdr}
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
