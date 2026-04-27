"use client";

import { useState } from "react";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import {
  TransactionStepName,
  TransactionStepper,
} from "@/components/TransactionStepper";
import { TransactionFlowFooter } from "@/components/TransactionFlowFooter";

import { SubmitStepContent } from "../components/SubmitStepContent";

import { FeeBumpStepContent } from "./FeeBumpStepContent";
import { SignStepContent } from "./SignStepContent";

import "./styles.scss";

export default function FeeBumpTransaction() {
  const steps: TransactionStepName[] = ["feeBump", "sign", "submit"];
  const { transaction } = useStore();
  const { feeBump } = transaction;
  const [activeStep, setActiveStep] = useState<TransactionStepName>("feeBump");
  const [builtXdr, setBuiltXdr] = useState("");

  const handleNext = () => {
    if (activeStep === "feeBump") {
      setActiveStep("sign");
    }
    if (activeStep === "sign") {
      setActiveStep("submit");
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

  return (
    <Box gap="xxl">
      <div className="FeeBumpTransaction__layout">
        <div className="FeeBumpTransaction__content">
          <Box gap="xxl">
            {activeStep === "feeBump" && (
              <FeeBumpStepContent onBuilt={setBuiltXdr} />
            )}
            {activeStep === "sign" && <SignStepContent xdrToSign={builtXdr} />}
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

        <div className="FeeBumpTransaction__stepper">
          <TransactionStepper
            steps={steps}
            activeStep={activeStep}
            highestCompletedStep={null}
            onStepClick={() => {
              // No step clicking allowed in fee bump flow for now since we don't
              // want users skipping ahead to submit without signing the fee bump
            }}
          />
        </div>
      </div>
    </Box>
  );
}
