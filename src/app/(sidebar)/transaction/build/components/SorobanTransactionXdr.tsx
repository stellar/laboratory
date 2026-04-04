"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { getTxWithSorobanData } from "@/helpers/sorobanUtils";

import { TransactionXdrDisplay } from "./TransactionXdrDisplay";

export const SorobanTransactionXdr = () => {
  const { network } = useStore();
  const { build, setBuildSorobanXdr } = useBuildFlowStore();
  const { isValid, params: txnParams } = build;
  const { soroban } = build;

  const isReady = isValid.params && isValid.operations;

  // Build XDR for non-invoke Soroban operations (restore_footprint,
  // extend_footprint_ttl). These don't need a real resource_fee at build time
  // — the simulation step calculates it. For invoke_contract, the XDR is built
  // within the SorobanOperation component's invoke flow.
  const buildResult = (() => {
    if (!isReady) return null;

    const opType = soroban.operation.operation_type;

    // invoke_contract builds its own XDR via a different path
    if (opType === "invoke_contract_function") {
      // Use already-built XDR if present
      return soroban.xdr ? { xdr: soroban.xdr } : null;
    }

    // restore_footprint / extend_footprint_ttl
    if (opType && soroban.operation.params.contractDataLedgerKey) {
      return getTxWithSorobanData({
        operation: soroban.operation,
        txnParams,
        networkPassphrase: network.passphrase,
      });
    }

    return null;
  })();

  useEffect(() => {
    setBuildSorobanXdr(buildResult?.xdr ?? "");
    // Not including setBuildSorobanXdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildResult?.xdr]);

  if (!isReady) {
    return null;
  }

  if (buildResult?.error) {
    return (
      <ValidationResponseCard
        variant="error"
        title="Transaction Envelope XDR Error:"
        response={buildResult.error}
      />
    );
  }

  if (buildResult?.xdr) {
    try {
      const txnHash = TransactionBuilder.fromXDR(
        buildResult.xdr,
        network.passphrase,
      )
        .hash()
        .toString("hex");

      return (
        <TransactionXdrDisplay
          xdr={buildResult.xdr}
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
