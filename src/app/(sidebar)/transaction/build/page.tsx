"use client";

import { useEffect, useRef } from "react";
import { Alert, Card } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useLegacyUrlMigration } from "@/hooks/useLegacyUrlMigration";

import { TransactionStepHeader } from "@/app/(sidebar)/transaction/components/TransactionStepHeader";
import { SignStepContent } from "@/app/(sidebar)/transaction/components/SignStepContent";
import { Box } from "@/components/layout/Box";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import {
  TransactionStepper,
  TransactionStepName,
} from "@/components/TransactionStepper";
import { TransactionFlowFooter } from "@/components/TransactionFlowFooter";
import { SubmitStepContent } from "./components/SubmitStepContent";
import { Params } from "./components/Params";
import { Operations } from "./components/Operations";
import { ClassicTransactionXdr } from "./components/ClassicTransactionXdr";
import { SorobanTransactionXdr } from "./components/SorobanTransactionXdr";
import { SimulateStepContent } from "./components/SimulateStepContent";
import { ValidateStepContent } from "./components/ValidateStepContent";

import "../styles.scss";

export default function BuildTransaction() {
  const {
    build,
    simulate,
    sign,
    validate,
    activeStep,
    highestCompletedStep,
    setSignedXdr,
    setActiveStep,
    goToNextStep,
    markStepCompleted,
    resetDownstreamState,
    resetAll,
  } = useBuildFlowStore();

  // Bridge legacy querystring params into the flow store (one-time migration)
  const { isLegacyUrl, dismissLegacyAlert } = useLegacyUrlMigration();

  // For Classic
  const { params: paramsError, operations: operationsError } = build.error;

  // For Soroban
  const { soroban } = build;
  const isSoroban = Boolean(soroban.operation.operation_type);

  const hasAuthEntries = Boolean(
    simulate.authEntriesXdr && simulate.authEntriesXdr.length > 0,
  );

  const steps: TransactionStepName[] = isSoroban
    ? hasAuthEntries
      ? ["build", "simulate", "sign", "validate", "submit"]
      : ["build", "simulate", "sign", "submit"]
    : ["build", "sign", "submit"];

  const { handleNext, handleBack, handleStepClick } = useTransactionFlow({
    steps,
    activeStep,
    highestCompletedStep,
    goToNextStep,
    setActiveStep,
  });

  const currentXdr = isSoroban ? build.soroban.xdr : build.classic.xdr;

  const getIsNextDisabled = (): boolean => {
    if (activeStep === "build") {
      // Classic & Soroban: XDR must be built. Soroban: params + operations must be valid
      // (simulation happens in the next step).
      return !currentXdr || !(build.isValid.params && build.isValid.operations);
    }
    if (activeStep === "simulate") {
      // Simulation must be complete and assembledXdr must exist (set after auth
      // signing + assembly, or after auto-assembly when no auth entries are
      // present) so the sign step receives a transaction with
      // simulation-derived resources/fees.
      return !simulate.simulationResultJson || !simulate.assembledXdr;
    }
    if (activeStep === "sign") {
      return !sign.signedXdr;
    }
    if (activeStep === "validate") {
      return !validate?.validatedXdr;
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

  // When the user edits the transaction on the build step after having already
  // progressed past it, the rebuilt XDR no longer matches what was simulated,
  // signed, or validated downstream — those results are now stale. Reset them
  // so a signature produced against the previous transaction can't be carried
  // through to submit; the user must re-run the later steps against the edited
  // transaction.
  const prevBuiltXdrRef = useRef<string | null>(null);
  useEffect(() => {
    // Ignore empty values: the built XDR is transiently cleared while the build
    // step remounts (XDR encoder init) or while inputs are mid-edit/invalid.
    // Treating those as edits would wipe downstream state on plain navigation.
    if (!currentXdr) {
      return;
    }
    // Record the first real XDR (initial build / sessionStorage rehydrate)
    // without resetting, so restored progress isn't wiped on page load.
    if (prevBuiltXdrRef.current === null) {
      prevBuiltXdrRef.current = currentXdr;
      return;
    }
    if (prevBuiltXdrRef.current === currentXdr) {
      return;
    }
    prevBuiltXdrRef.current = currentXdr;

    const buildIndex = steps.indexOf("build");
    const highestIndex = highestCompletedStep
      ? steps.indexOf(highestCompletedStep)
      : -1;

    // Only reset when there is downstream progress to invalidate.
    if (highestIndex > buildIndex) {
      resetDownstreamState(steps[buildIndex + 1], steps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentXdr]);

  const renderError = () => {
    if (paramsError.length > 0 || operationsError.length > 0) {
      return (
        <ValidationResponseCard
          variant="error"
          title="Transaction building errors:"
          response={
            <Box gap="sm">
              <>
                {paramsError.length > 0 ? (
                  <Box gap="sm">
                    <>
                      <div>Params</div>
                      <ul data-testid="build-transaction-params-errors">
                        {paramsError.map((e, i) => (
                          <li key={`e-${i}`}>{e}</li>
                        ))}
                      </ul>
                    </>
                  </Box>
                ) : null}

                {operationsError.length > 0 ? (
                  <Box
                    gap="sm"
                    data-testid="build-transaction-operations-errors"
                  >
                    {operationsError.map((e, i) => (
                      <Box gap="sm" key={`e-${i}`}>
                        <>
                          {e.label ? <div>{e.label}</div> : null}
                          <ul>
                            {e.errorList?.map((ee, ei) => (
                              <li key={`e-${i}-${ei}`}>{ee}</li>
                            ))}
                          </ul>
                        </>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </>
            </Box>
          }
        />
      );
    }

    return null;
  };

  const renderBuildStep = () => (
    <Box gap="md">
      <TransactionStepHeader
        heading="Build transaction"
        onClearAll={() => {
          resetAll();
          dismissLegacyAlert();
        }}
        xdr={currentXdr}
        params={build.params}
        activeStep={activeStep}
        operations={
          isSoroban ? [build.soroban.operation] : build.classic.operations
        }
      />

      {isLegacyUrl ? (
        <Alert variant="warning" placement="inline" title="">
          This transaction was loaded from a legacy URL format that will be
          removed in a future update. Please save your transaction to preserve
          it.
        </Alert>
      ) : null}

      <Card>
        <Params />
      </Card>
      <Operations />

      <>{renderError()}</>

      {isSoroban ? <SorobanTransactionXdr /> : <ClassicTransactionXdr />}
    </Box>
  );

  return (
    <Box gap="xxl">
      <div className="BuildTransaction__layout">
        <div className="BuildTransaction__content">
          <Box gap="xxl">
            {activeStep === "build" && renderBuildStep()}
            {activeStep === "simulate" && <SimulateStepContent steps={steps} />}
            {activeStep === "sign" && (
              <SignStepContent
                xdrToSign={
                  simulate.assembledXdr ||
                  build.soroban.xdr ||
                  build.classic.xdr
                }
                signedXdr={sign.signedXdr}
                onSigned={setSignedXdr}
                onClearAll={resetAll}
              />
            )}
            {activeStep === "validate" && <ValidateStepContent />}
            {activeStep === "submit" && <SubmitStepContent />}

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
