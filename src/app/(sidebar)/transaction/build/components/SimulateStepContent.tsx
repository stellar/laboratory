"use client";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { TransactionStepName } from "@/components/TransactionStepper";

import { SimulateStepContent as SharedSimulateStepContent } from "../../components/SimulateStepContent";

/**
 * Build-flow wrapper around the shared simulate step.
 *
 * Reads the to-be-simulated XDR from the build slice (Soroban or Classic) and
 * forwards the simulate slice + actions from `useBuildFlowStore` to the
 * shared component.
 */
export const SimulateStepContent = ({
  steps,
}: {
  steps: TransactionStepName[];
}) => {
  const {
    build,
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
  } = useBuildFlowStore();

  const xdrToSimulate = build.soroban.xdr || build.classic.xdr;
  const isInvokeContract =
    build.soroban.operation.operation_type === "invoke_contract_function";

  return (
    <SharedSimulateStepContent
      xdrToSimulate={xdrToSimulate}
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
