"use client";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { SubmitStepContent as SharedSubmitStepContent } from "../../components/SubmitStepContent";

export const SubmitStepContent = () => {
  const { build, sign, validate, simulate, setSubmitResult, resetAll } =
    useBuildFlowStore();

  const xdrBlob =
    validate?.validatedXdr || sign.signedXdr || simulate?.assembledXdr || "";
  const isSoroban = Boolean(build.soroban.operation.operation_type);

  // DEBUG: which source supplied the XDR being submitted. If assembledXdr is
  // false but the others are too, submit falls back to the raw built XDR
  // (resourceFee 0) — the suspected cause of tx_soroban_invalid.
  console.log("[submit-src]", {
    validatedXdr: !!validate?.validatedXdr,
    signedXdr: !!sign.signedXdr,
    assembledXdr: !!simulate?.assembledXdr,
    chosen: validate?.validatedXdr
      ? "validatedXdr"
      : sign.signedXdr
        ? "signedXdr"
        : simulate?.assembledXdr
          ? "assembledXdr"
          : "EMPTY",
  });

  return (
    <SharedSubmitStepContent
      xdrBlob={xdrBlob}
      isSoroban={isSoroban}
      onReset={resetAll}
      onSuccess={(result) => setSubmitResult(result)}
    />
  );
};
