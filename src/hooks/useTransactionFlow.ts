import { TransactionStepName } from "@/components/TransactionStepper";

/**
 * Shared hook for single-page transaction flow step navigation.
 * Used by both BuildTransaction and ImportTransaction to eliminate duplicated
 * step navigation logic.
 *
 * @param steps - Ordered array of step names for the current flow
 * @param activeStep - The currently active step (from store)
 * @param highestCompletedStep - The furthest completed step (from store)
 * @param goToNextStep - Store action to advance to the next step
 * @param goToPreviousStep - Store action to go back to the previous step
 * @param setActiveStep - Store action to jump to a specific step
 * @returns Step navigation state and handlers
 *
 * @example
 * const { stepIndex, handleNext, handleBack, handleStepClick } =
 *   useTransactionFlow({
 *     steps,
 *     activeStep,
 *     highestCompletedStep,
 *     goToNextStep,
 *     goToPreviousStep,
 *     setActiveStep,
 *   });
 */
export const useTransactionFlow = ({
  steps,
  activeStep,
  highestCompletedStep,
  goToNextStep,
  goToPreviousStep,
  setActiveStep,
}: {
  steps: TransactionStepName[];
  activeStep: TransactionStepName;
  highestCompletedStep: TransactionStepName | null;
  goToNextStep: (steps: TransactionStepName[]) => void;
  goToPreviousStep: (steps: TransactionStepName[]) => void;
  setActiveStep: (step: TransactionStepName) => void;
}) => {
  const stepIndex = steps.indexOf(activeStep);
  const highestCompletedIndex = highestCompletedStep
    ? steps.indexOf(highestCompletedStep)
    : -1;

  const handleNext = () => goToNextStep(steps);
  const handleBack = () => goToPreviousStep(steps);
  const handleStepClick = (step: TransactionStepName) => {
    if (steps.indexOf(step) <= highestCompletedIndex) {
      setActiveStep(step);
    }
  };

  return {
    highestCompletedStep,
    stepIndex,
    handleNext,
    handleBack,
    handleStepClick,
  };
};
