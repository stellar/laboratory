"use client";

import { useEffect } from "react";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";

import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useImportSignatureCompleteness } from "@/hooks/useImportSignatureCompleteness";

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
import { SignStepSignatureContext } from "./components/SignStepSignatureContext";

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

  const parsedTxType = importState?.parsedTxType ?? "classic";
  const signatureCompleteness = useImportSignatureCompleteness();

  // A signed Soroban tx is necessarily already simulated — it carries
  // SorobanTransactionData (footprint/resource fees), which is what the
  // signatures were produced over. Offering the simulate step would only let
  // the user re-assemble a fresh envelope and silently drop those signatures,
  // so omit it entirely for this case.
  const isSignedSimulatedSoroban =
    parsedTxType === "soroban" &&
    Boolean(importState?.hasSignatures) &&
    Boolean(importState?.isSimulated);

  const isFeeBump = Boolean(importState?.isFeeBump);

  const steps: TransactionStepName[] =
    parsedTxType === "classic" || isFeeBump || isSignedSimulatedSoroban
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
      // Offline analysis can't verify on-chain multisig thresholds, so a tx
      // that already carries signatures must remain submittable without adding
      // another (adding an unnecessary one is rejected as txBadAuthExtra). Only
      // require a new signature when the imported tx has none. The network is
      // the final judge of whether the signature set is sufficient.
      return !(sign.signedXdr || importState?.hasSignatures);
    }

    return true;
  };

  const isNextDisabled = getIsNextDisabled();

  // When the pasted tx already carries all the signatures it needs,
  // default the Next button to "Submit transaction" so the existing
  // signatures are preserved through to submission. Otherwise the flow's
  // simulate/sign steps would discard them: StellarRpc.assembleTransaction
  // builds a fresh envelope without the original signatures, and the sign
  // step then substitutes the user's own sig — destroying a co-signed
  // envelope that the importer can't recover.
  //
  // For Soroban we also require the envelope to already carry
  // SorobanTransactionData (isSimulated), since an unsimulated Soroban tx
  // can't be submitted as-is — it would fail at the protocol level.
  //
  // We also require every required signer to already have a valid signature
  // (signatureCompleteness.isComplete). When a required source account hasn't
  // signed, we leave isReadyToSubmit false so the footer falls back to its
  // default Next button — "Sign transaction"
  const isReadyToSubmit =
    activeStep === "import" &&
    Boolean(importState?.importXdr) &&
    Boolean(importState?.hasSignatures) &&
    Boolean(signatureCompleteness?.isComplete) &&
    (parsedTxType === "classic" ||
      (parsedTxType === "soroban" && Boolean(importState?.isSimulated)));

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

  const xdrToSign = simulate.assembledXdr || importState?.importXdr || "";

  return (
    <Box gap="xxl">
      <div className="BuildTransaction__layout">
        <div className="BuildTransaction__content">
          <Box gap="xxl">
            {activeStep === "import" && (
              <ImportStepContent isReadyToSubmit={isReadyToSubmit} />
            )}
            {activeStep === "sign" && (
              <SignStepContent
                xdrToSign={xdrToSign}
                signedXdr={sign.signedXdr || ""}
                onSigned={(signedXdr) => {
                  setSignedXdr(signedXdr);
                }}
                onClearAll={resetAll}
                signatureContext={
                  <SignStepSignatureContext
                    xdr={sign.signedXdr || xdrToSign}
                    parsedTxType={importState?.parsedTxType}
                  />
                }
              />
            )}
            {activeStep === "simulate" && <SimulateStepContent steps={steps} />}
            {activeStep === "submit" && (
              <SubmitStepContent
                xdrBlob={sign.signedXdr || xdrToSign}
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
                isReadyToSubmit
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
