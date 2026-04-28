"use client";

import { useState } from "react";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import {
  TransactionStepName,
  TransactionStepper,
} from "@/components/TransactionStepper";
import { TransactionFlowFooter } from "@/components/TransactionFlowFooter";

import { FeeBumpStepContent } from "./FeeBumpStepContent";
import { SignStepContent } from "./SignStepContent";
import { SubmitStepContent } from "./SubmitStepContent";

import "./styles.scss";

export default function FeeBumpTransaction() {
  const steps: TransactionStepName[] = ["feeBump", "sign", "submit"];
  const { transaction } = useStore();
  const { feeBump, resetFeeBump } = transaction;
  const [activeStep, setActiveStep] = useState<TransactionStepName>("feeBump");
  const [highestCompletedStep, setHighestCompletedStep] =
    useState<TransactionStepName | null>(null);
  const [builtXdr, setBuiltXdr] = useState("");

  const advanceStep = (
    current: TransactionStepName,
    next: TransactionStepName,
  ) => {
    setActiveStep(next);
    const currentIndex = steps.indexOf(current);
    const highestIndex = highestCompletedStep
      ? steps.indexOf(highestCompletedStep)
      : -1;
    if (currentIndex > highestIndex) {
      setHighestCompletedStep(current);
    }
  };

  const handleNext = () => {
    if (activeStep === "feeBump") {
      advanceStep("feeBump", "sign");
    }
    if (activeStep === "sign") {
      advanceStep("sign", "submit");
    }
  };

  const handleBack = () => {
    if (activeStep === "sign") {
      setActiveStep("feeBump");
    }
    if (activeStep === "submit") {
      setActiveStep("sign");
    }
  };

  const getIsNextDisabled = () => {
    if (activeStep === "feeBump") {
      return !builtXdr;
    }
    if (activeStep === "sign") {
      return !feeBump.signedTx;
    }
    return false;
  };

  const isNextDisabled = getIsNextDisabled();

  const onReset = () => {
    setActiveStep("feeBump");
    setHighestCompletedStep(null);
    setBuiltXdr("");
    resetFeeBump();
  };

  return (
    <Box gap="xxl">
      <div className="FeeBumpTransaction__layout">
        <div className="FeeBumpTransaction__content">
          <Box gap="xxl">
            {activeStep === "feeBump" && (
              <FeeBumpStepContent onBuilt={setBuiltXdr} onReset={onReset} />
            )}
            {activeStep === "sign" && (
              <SignStepContent xdrToSign={builtXdr} onReset={onReset} />
            )}
            {activeStep === "submit" && <SubmitStepContent onReset={onReset} />}

            <TransactionFlowFooter
              steps={steps}
              activeStep={activeStep}
              onNext={handleNext}
              onBack={handleBack}
              isNextDisabled={isNextDisabled}
            />
          </Box>
        </div>

        <div className="FeeBumpTransaction__stepper">
          <TransactionStepper
            steps={steps}
            activeStep={activeStep}
            highestCompletedStep={highestCompletedStep}
            onStepClick={setActiveStep}
          />
        </div>
      </div>
    </Box>
  );
}
