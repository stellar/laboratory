"use client";

import { Button, Icon } from "@stellar/design-system";

import {
  TransactionStepName,
  getStepLabel,
} from "@/components/TransactionStepper";

import "./styles.scss";

type FooterAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

/**
 * Shared footer for the single-page transaction flow. Renders Back/Next
 * navigation buttons.
 *
 * Optional overrides let a flow customize the primary Next button (label
 * + handler) and surface a secondary action — used by the Import flow to
 * default to "Submit transaction" when the imported tx is already valid,
 * while still offering "Sign transaction" alongside.
 *
 * @param steps - Ordered array of step names for the current flow
 * @param activeStep - The currently active step
 * @param onNext - Callback to advance to the next step (used when no
 *   nextOverride is provided)
 * @param isNextDisabled - Whether the default Next button should be disabled
 * @param nextOverride - Replaces the default Next button entirely. Use to
 *   skip ahead (e.g., go directly to Submit when the imported tx is signed).
 */
export const TransactionFlowFooter = ({
  steps,
  activeStep,
  onNext,
  onBack,
  isNextDisabled,
  nextOverride,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled: boolean;
  nextOverride?: FooterAction;
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
      {(nextStep || nextOverride) && (
        <div data-position="right">
          {nextOverride ? (
            <Button
              size="md"
              variant="secondary"
              icon={<Icon.ArrowRight />}
              iconPosition="right"
              onClick={nextOverride.onClick}
              disabled={nextOverride.disabled}
            >
              {nextOverride.label}
            </Button>
          ) : (
            nextStep && (
              <Button
                size="md"
                variant="secondary"
                icon={<Icon.ArrowRight />}
                iconPosition="right"
                onClick={onNext}
                disabled={isNextDisabled}
              >
                {`${getStepLabel(nextStep)}`}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};
