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
import { SimulateStepContent } from "./components/SimulateStepContent";

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
 */
export default function ImportTransaction() {
  const {
    import: importState,
    simulate,
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
    if (activeStep === "simulate") {
      // Simulation must be complete and assembledXdr must exist (set after
      // auth signing + assembly, or after auto-assembly when no auth entries
      // are present) so the sign step receives a transaction with
      // simulation-derived resources/fees.
      return !simulate.simulationResultJson || !simulate.assembledXdr;
    }
    if (activeStep === "sign") {
      return !sign.signedXdr;
    }

    return true;
  };

  const isNextDisabled = getIsNextDisabled();

  // On classic imports where the pasted tx already carries any signatures,
  // default the import-step Next button to "Submit transaction" (skipping
  // the sign step). We can't always confirm offline that the sigs are
  // sufficient (multisig with on-chain cosigners is invisible to the
  // offline check), so we let the network be the source of truth: an
  // insufficient signature set fails with a clear protocol error (e.g.
  // txBadAuth) on submit, which is recoverable. The alternative — gating
  // on signatureCheck.isReady — strands multisig users on the sign step
  // with no signature they can add.
  const isClassicReadyToSubmit =
    activeStep === "import" &&
    parsedTxType === "classic" &&
    Boolean(importState?.hasSignatures) &&
    Boolean(importState?.importXdr);

  const handleSkipToSubmit = () => {
    if (importState?.importXdr) {
      setSignedXdr(importState.importXdr);
    }
    markStepCompleted("sign", steps);
    setActiveStep("submit");
  };

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
                xdrToSign={
                  simulate.assembledXdr || importState?.importXdr || ""
                }
                signedXdr={sign.signedXdr || ""}
                onSigned={(signedXdr) => {
                  setSignedXdr(signedXdr);
                }}
                onClearAll={resetAll}
              />
            )}
            {activeStep === "simulate" && <SimulateStepContent steps={steps} />}
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
              nextOverride={
                isClassicReadyToSubmit
                  ? {
                      label: "Submit transaction",
                      onClick: handleSkipToSubmit,
                    }
                  : undefined
              }
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
