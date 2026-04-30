"use client";

import { useStore } from "@/store/useStore";

import { SubmitStepContent as SharedSubmitStepContent } from "../components/SubmitStepContent";

export const SubmitStepContent = ({
  onReset,
  onSuccess,
}: {
  onReset: () => void;
  onSuccess: () => void;
}) => {
  const { transaction } = useStore();
  const xdrBlob = transaction.feeBump.signedTx || "";

  return (
    <SharedSubmitStepContent
      xdrBlob={xdrBlob}
      isSoroban
      xdrPickerDisabled
      onReset={onReset}
      onSuccess={() => onSuccess()}
    />
  );
};
