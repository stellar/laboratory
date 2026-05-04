"use client";

import { useEffect } from "react";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";

import { useTransactionFlow } from "@/hooks/useTransactionFlow";

import { Box } from "@/components/layout/Box";
import {
  TransactionStepper,
  TransactionStepName,
} from "@/components/TransactionStepper";
import { TransactionFlowFooter } from "@/components/TransactionFlowFooter";

import { ImportStepContent } from "./ImportStepContent";

/**
 * Import flow shell — mirrors `BuildTransaction` for the import variant.
 *
 * Renders the import step content alongside the shared stepper + footer,
 * deriving the step array from the parsed transaction type stored by
 * `ImportStepContent`.
 *
 * Soroban / classic step variants:
 * - Classic:  ["import", "sign", "submit"]
 * - Soroban:  ["import", "simulate", "sign", "submit"]
 *
 * The Soroban "validate" step is added dynamically after simulation surfaces
 * auth entries (handled inside the simulate step, same as the build flow).
 */
export const ImportFlow = () => {
  const {
    import: importState,
    activeStep,
    highestCompletedStep,
    setActiveStep,
    goToNextStep,
    markStepCompleted,
  } = useImportFlowStore();

  // Default to the Classic variant until the user pastes XDR
  const parsedTxType = importState?.parsedTxType ?? "classic";

  const steps: TransactionStepName[] =
    parsedTxType === "classic"
      ? ["import", "sign", "submit"]
      : ["import", "simulate", "sign", "submit"];

  const { handleNext, handleBack, handleStepClick } = useTransactionFlow({
    steps,
    activeStep,
    highestCompletedStep,
    goToNextStep,
    setActiveStep,
  });

  const isImportValid = Boolean(
    importState?.importXdr &&
      importState.parsedTxType &&
      !importState.parseError,
  );

  const getIsNextDisabled = (): boolean => {
    if (activeStep === "import") {
      return !isImportValid;
    }
    // Other steps will be enabled when their corresponding store state is
    // populated — wired up incrementally as the import flow's downstream
    // steps share the build flow's step components.
    return true;
  };

  const isNextDisabled = getIsNextDisabled();

  useEffect(() => {
    if (!isNextDisabled && activeStep !== "submit") {
      markStepCompleted(activeStep, steps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNextDisabled, activeStep]);

  return (
    <div className="BuildTransaction__layout">
      <div className="BuildTransaction__content">
        <Box gap="xxl">
          {activeStep === "import" && <ImportStepContent />}
          {/* {activeStep !== "import" && (
            <Alert variant="primary" placement="inline" title="Coming soon">
              The {activeStep} step for the import flow is not wired up yet.
            </Alert>
          )} */}

          <TransactionFlowFooter
            steps={steps}
            activeStep={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            isNextDisabled={isNextDisabled}
          />
        </Box>
      </div>

      <div className="BuildTransaction__stepper">
        <TransactionStepper
          steps={steps}
          activeStep={activeStep}
          highestCompletedStep={highestCompletedStep}
          onStepClick={handleStepClick}
        />
      </div>
    </div>
  );
};
