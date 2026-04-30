"use client";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { SubmitStepContent as SharedSubmitStepContent } from "../../components/SubmitStepContent";

export const SubmitStepContent = () => {
  const { build, sign, validate, simulate, setSubmitResult, resetAll } =
    useBuildFlowStore();

  const xdrBlob =
    validate?.validatedXdr || sign.signedXdr || simulate?.assembledXdr || "";
  const isSoroban = Boolean(build.soroban.operation.operation_type);

  return (
    <SharedSubmitStepContent
      xdrBlob={xdrBlob}
      isSoroban={isSoroban}
      onReset={resetAll}
      onSuccess={(result) => setSubmitResult(result)}
    />
  );
};
