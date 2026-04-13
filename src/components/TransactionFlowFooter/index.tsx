"use client";

import { useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";

import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import {
  TransactionStepName,
  getStepLabel,
} from "@/components/TransactionStepper";

import { TransactionBuildParams } from "@/store/createTransactionFlowStore";
import { TxnOperation } from "@/types/types";

import "./styles.scss";

/**
 * Shared footer for the single-page transaction flow. Renders Back/Next
 * navigation buttons and an optional Save button on the build/import step.
 *
 * @param steps - Ordered array of step names for the current flow
 * @param activeStep - The currently active step
 * @param onNext - Callback to advance to the next step
 * @param isNextDisabled - Whether the Next button should be disabled
 * @param xdr - Built XDR string, used for saving on the build/import step
 * @param params - Transaction build params for saving
 * @param operations - Transaction operations for saving
 *
 * @example
 * <TransactionFlowFooter
 *   steps={["build", "simulate", "sign", "submit"]}
 *   activeStep="build"
 *   onNext={handleNext}
 *   isNextDisabled={!isValid}
 *   xdr={builtXdr}
 *   params={build.params}
 *   operations={build.classic.operations}
 * />
 */
export const TransactionFlowFooter = ({
  steps,
  activeStep,
  onNext,
  isNextDisabled,
  xdr,
  params,
  operations,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  onNext?: () => void;
  isNextDisabled: boolean;
  xdr?: string;
  params?: TransactionBuildParams;
  operations?: TxnOperation[];
}) => {
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const currentIndex = steps.indexOf(activeStep);
  const isLastStep = currentIndex === steps.length - 1;
  const showSaveButton = activeStep === "build" || activeStep === "import";

  const nextStep = !isLastStep ? steps[currentIndex + 1] : null;

  return (
    <div className="TransactionFlowFooter">
      <div className="TransactionFlowFooter__nav">
        {nextStep && (
          <Button
            size="md"
            variant="secondary"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            {`Next: ${getStepLabel(nextStep)}`}
          </Button>
        )}
      </div>

      {showSaveButton && (
        <>
          <Button
            size="md"
            variant="tertiary"
            icon={<Icon.Save01 />}
            iconPosition="right"
            onClick={() => setIsSaveModalVisible(true)}
          >
            Save transaction
          </Button>

          <SaveToLocalStorageModal
            type="save"
            itemTitle="Transaction"
            itemProps={{
              xdr: xdr || "",
              page: "build",
              ...(params ? { params } : {}),
              ...(operations ? { operations } : {}),
            }}
            allSavedItems={localStorageSavedTransactions.get()}
            isVisible={isSaveModalVisible}
            onClose={() => {
              setIsSaveModalVisible(false);
            }}
            onUpdate={(updatedItems) => {
              localStorageSavedTransactions.set(updatedItems);
            }}
          />
        </>
      )}
    </div>
  );
};
