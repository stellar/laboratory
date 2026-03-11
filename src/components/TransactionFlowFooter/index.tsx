"use client";

import { useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";

import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import {
  TransactionStepName,
  getStepLabel,
} from "@/components/TransactionStepper";

import "./styles.scss";

/**
 * Shared footer for the single-page transaction flow. Renders Back/Next
 * navigation buttons and an optional Save button on the build/import step.
 *
 * @param steps - Ordered array of step names for the current flow
 * @param activeStep - The currently active step
 * @param onNext - Callback to advance to the next step
 * @param onBack - Callback to go back to the previous step
 * @param isNextDisabled - Whether the Next button should be disabled
 * @param xdr - Built XDR string, used for saving on the build/import step
 *
 * @example
 * <TransactionFlowFooter
 *   steps={["build", "simulate", "sign", "submit"]}
 *   activeStep="build"
 *   onNext={handleNext}
 *   onBack={handleBack}
 *   isNextDisabled={!isValid}
 *   xdr={builtXdr}
 * />
 */
export const TransactionFlowFooter = ({
  steps,
  activeStep,
  onNext,
  onBack,
  isNextDisabled,
  xdr,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled: boolean;
  xdr?: string;
}) => {
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const currentIndex = steps.indexOf(activeStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  const showSaveButton = activeStep === "build" || activeStep === "import";

  const prevStep = !isFirstStep ? steps[currentIndex - 1] : null;
  const nextStep = !isLastStep ? steps[currentIndex + 1] : null;

  return (
    <div className="TransactionFlowFooter">
      <div className="TransactionFlowFooter__nav">
        {prevStep && (
          <Button size="md" variant="tertiary" onClick={onBack}>
            {`Back: ${getStepLabel(prevStep)}`}
          </Button>
        )}

        {nextStep && (
          <Button
            size="md"
            variant="tertiary"
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
