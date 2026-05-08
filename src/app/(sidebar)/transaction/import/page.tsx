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
import { SignStepContent } from "@/app/(sidebar)/transaction/components/SignStepContent";
import { SubmitStepContent } from "@/app/(sidebar)/transaction/components/SubmitStepContent";
import { ImportStepContent } from "./components/ImportStepContent";

import "../styles.scss";

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
export default function ImportTransaction() {
  const {
    import: importState,
    sign,
    activeStep,
    highestCompletedStep,
    setActiveStep,
    goToNextStep,
    markStepCompleted,
    setSignedXdr,
    resetAll,
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
    if (activeStep === "sign") {
      return !sign.signedXdr;
    }

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
    <Box gap="xxl">
      <div className="BuildTransaction__layout">
        <div className="BuildTransaction__content">
          <Box gap="xxl">
            {activeStep === "import" && <ImportStepContent />}
            {activeStep === "sign" && (
              <SignStepContent
                xdrToSign={importState?.importXdr || ""}
                signedXdr={sign.signedXdr || ""}
                onSigned={(signedXdr) => {
                  setSignedXdr(signedXdr);
                }}
                onClearAll={resetAll}
              />
            )}
            {activeStep === "submit" && (
              <SubmitStepContent
                xdrBlob={sign.signedXdr || ""}
                onReset={resetAll}
              />
            )}

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
    </Box>
  );
}
