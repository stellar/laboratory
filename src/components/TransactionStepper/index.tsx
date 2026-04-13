"use client";

import { Text } from "@stellar/design-system";

import "./styles.scss";

export type TransactionStepName =
  | "build"
  | "import"
  | "simulate"
  | "validate"
  | "sign"
  | "submit";

const STEP_LABELS: Record<TransactionStepName, string> = {
  build: "Build transaction",
  import: "Import XDR",
  simulate: "Simulate transaction",
  validate: "Validate transaction",
  sign: "Sign transaction",
  submit: "Submit transaction",
};

const STEP_SHORT_LABELS: Record<TransactionStepName, string> = {
  build: "Build",
  import: "Import",
  simulate: "Simulate",
  validate: "Validate",
  sign: "Sign",
  submit: "Submit",
};

const STEP_DESCRIPTIONS: Partial<Record<TransactionStepName, string>> = {
  validate:
    "This transaction contains authorization entries that need to be validated before submitting.",
};

/**
 * Returns the display label for a transaction step.
 *
 * @param step - The step name
 * @returns Human-readable label string
 *
 * @example
 * getStepLabel("build") // "Build transaction"
 */
export const getStepLabel = (step: TransactionStepName): string =>
  STEP_LABELS[step];

/**
 * Presentational stepper component for the single-page transaction flow.
 * Displays a vertical list of numbered steps with active/completed/disabled
 * states. Steps that have been completed are clickable; future steps are not.
 *
 * @param steps - Ordered array of step names to display
 * @param activeStep - The currently active step
 * @param highestCompletedStep - The furthest step the user has reached (null if none)
 * @param onStepClick - Callback when a completed step is clicked
 */
export const TransactionStepper = ({
  steps,
  activeStep,
  highestCompletedStep,
  onStepClick,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  highestCompletedStep: TransactionStepName | null;
  onStepClick: (step: TransactionStepName) => void;
}) => {
  const highestCompletedIndex = highestCompletedStep
    ? steps.indexOf(highestCompletedStep)
    : -1;

  return (
    <div className="TransactionStepper">
      {steps.map((step, index) => {
        const isActive = step === activeStep;
        const isCompleted = index <= highestCompletedIndex;
        const isClickable = isCompleted && !isActive;
        const isLast = index === steps.length - 1;

        return (
          <div
            role="button"
            key={step}
            className="TransactionStepper__step"
            data-is-active={isActive || undefined}
            data-is-completed={isCompleted || undefined}
            data-is-clickable={isClickable || undefined}
            data-has-description={!!STEP_DESCRIPTIONS[step] || undefined}
            onClick={isClickable ? () => onStepClick(step) : undefined}
          >
            <div className="TransactionStepper__indicator">
              <div className="TransactionStepper__badgeWrapper">
                <div className="TransactionStepper__badge">{index + 1}</div>
                {isCompleted && (
                  <div className="TransactionStepper__checkmark">
                    <svg
                      width="6"
                      height="5"
                      viewBox="0 0 6 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 2.5L2.5 4L5 1"
                        stroke="white"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {!isLast && <div className="TransactionStepper__connector" />}
            </div>
            <div className="TransactionStepper__label">
              <span className="TransactionStepper__labelFull">
                {STEP_LABELS[step]}
              </span>
              <span className="TransactionStepper__labelShort">
                {STEP_SHORT_LABELS[step]}
              </span>
              {STEP_DESCRIPTIONS[step] && (
                <Text
                  size="xs"
                  as="div"
                  addlClassName="TransactionStepper__description"
                >
                  {STEP_DESCRIPTIONS[step]}
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
