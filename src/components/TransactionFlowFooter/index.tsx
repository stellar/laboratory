"use client";

import { Button, Icon } from "@stellar/design-system";

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
 * @param isNextDisabled - Whether the Next button should be disabled
 *
 * @example
 * <TransactionFlowFooter
 *   steps={["build", "simulate", "sign", "submit"]}
 *   activeStep="build"
 *   onNext={handleNext}
 *   isNextDisabled={!isValid}
 * />
 */
export const TransactionFlowFooter = ({
  steps,
  activeStep,
  onNext,
  onBack,
  isNextDisabled,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled: boolean;
}) => {
  const currentIndex = steps.indexOf(activeStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  const prevStep = !isFirstStep ? steps[currentIndex - 1] : null;
  const nextStep = !isLastStep ? steps[currentIndex + 1] : null;

  return (
    <div className="TransactionFlowFooter">
      {prevStep && (
        <Button
          size="md"
          variant="tertiary"
          icon={<Icon.ArrowLeft />}
          iconPosition="left"
          onClick={onBack}
          data-position="left"
        >
          {`${getStepLabel(prevStep)}`}
        </Button>
      )}
      {nextStep && (
        <Button
          size="md"
          variant="secondary"
          icon={<Icon.ArrowRight />}
          iconPosition="right"
          onClick={onNext}
          disabled={isNextDisabled}
          data-position="right"
        >
          {`${getStepLabel(nextStep)}`}
        </Button>
      )}
    </div>
  );
};
