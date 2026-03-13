"use client";

import { Card, Link, Text } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { useTransactionFlow } from "@/hooks/useTransactionFlow";

import { Box } from "@/components/layout/Box";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import {
  TransactionStepper,
  TransactionStepName,
} from "@/components/TransactionStepper";
import { TransactionFlowFooter } from "@/components/TransactionFlowFooter";
import { Tabs } from "@/components/Tabs";
import { PageHeader } from "@/components/layout/PageHeader";

import { Params } from "./components/Params";
import { Operations } from "./components/Operations";
import { ClassicTransactionXdr } from "./components/ClassicTransactionXdr";
import { SorobanTransactionXdr } from "./components/SorobanTransactionXdr";

import "./styles.scss";

export default function BuildTransaction() {
  const {
    build,
    activeStep,
    highestCompletedStep,
    setActiveStep,
    goToNextStep,
    goToPreviousStep,
    resetAll,
  } = useBuildFlowStore();

  // For Classic
  const { params: paramsError, operations: operationsError } = build.error;

  // For Soroban
  const { soroban } = build;
  const isSoroban = Boolean(soroban.operation.operation_type);

  const steps: TransactionStepName[] = isSoroban
    ? ["build", "simulate", "sign", "submit"]
    : ["build", "sign", "submit"];

  const { handleNext, handleBack, handleStepClick } = useTransactionFlow({
    steps,
    activeStep,
    highestCompletedStep,
    goToNextStep,
    goToPreviousStep,
    setActiveStep,
  });

  const currentXdr = isSoroban ? build.soroban.xdr : build.classic.xdr;

  const isNextDisabled = activeStep === "build" && !currentXdr;

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
      <div className="BuildTransaction__tabs">
        <Tabs
          tabs={[
            {
              id: "new-transaction",
              label: "New transaction",
              href: "/transaction/build",
            },
            {
              id: "import-xdr",
              label: "Import transaction XDR",
              href: "/transaction/import",
            },
          ]}
          addlClassName="Tabs--gap-md"
        />
      </div>

      <div className="BuildTransaction__layout">
        <div className="BuildTransaction__content">
          <div className="BuildTransaction__header">
            <PageHeader heading="Build transaction" as="h1" />
            <Text as="div" size="xs">
              <Link
                variant="secondary"
                onClick={() => {
                  resetAll();
                }}
              >
                Clear all
              </Link>
            </Text>
          </div>

          <Box gap="xxl">
            {activeStep === "build" && renderBuildStep()}

            <TransactionFlowFooter
              steps={steps}
              activeStep={activeStep}
              onNext={handleNext}
              onBack={handleBack}
              isNextDisabled={isNextDisabled}
              xdr={currentXdr}
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
