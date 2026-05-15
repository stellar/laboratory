"use client";

import {
  FeeBumpTransaction,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { TransactionStepName } from "@/components/TransactionStepper";

import { SimulateStepContent as SharedSimulateStepContent } from "../../components/SimulateStepContent";

const isInvokeContractTx = (xdr: string, passphrase: string): boolean => {
  if (!xdr || !passphrase) return false;
  try {
    const tx = TransactionBuilder.fromXDR(xdr, passphrase) as
      | Transaction
      | FeeBumpTransaction;
    const operations =
      tx instanceof FeeBumpTransaction
        ? tx.innerTransaction.operations
        : tx.operations;
    const firstOp = operations?.[0] as Operation | undefined;
    if (firstOp?.type !== "invokeHostFunction") return false;
    return firstOp.func.switch().name === "hostFunctionTypeInvokeContract";
  } catch {
    return false;
  }
};

/**
 * Import-flow wrapper around the shared simulate step.
 *
 * Reads the imported XDR from the import slice, derives `isInvokeContract` by
 * inspecting the parsed transaction's first operation, and forwards the
 * simulate slice + actions from `useImportFlowStore` to the shared component.
 */
export const SimulateStepContent = ({
  steps,
}: {
  steps: TransactionStepName[];
}) => {
  const { network } = useStore();
  const {
    import: importState,
    simulate,
    highestCompletedStep,
    setSimulateInstructionLeeway,
    setSimulateAuthMode,
    setSimulationResult,
    setSimulationReadOnly,
    setAuthEntriesXdr,
    setSignedAuthEntriesXdr,
    setAssembledXdr,
    resetDownstreamState,
  } = useImportFlowStore();

  const importXdr = importState?.importXdr ?? "";
  const isInvokeContract = isInvokeContractTx(importXdr, network.passphrase);

  return (
    <SharedSimulateStepContent
      xdrToSimulate={importXdr}
      isInvokeContract={isInvokeContract}
      steps={steps}
      highestCompletedStep={highestCompletedStep}
      simulate={simulate}
      actions={{
        setInstructionLeeway: setSimulateInstructionLeeway,
        setAuthMode: setSimulateAuthMode,
        setSimulationResult,
        setSimulationReadOnly,
        setAuthEntriesXdr,
        setSignedAuthEntriesXdr,
        setAssembledXdr,
        resetDownstreamState,
      }}
    />
  );
};
