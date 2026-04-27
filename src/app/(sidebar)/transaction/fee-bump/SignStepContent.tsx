"use client";

import { useState } from "react";
import { Alert, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";
import { TransactionFlowHeader } from "@/components/TransactionFlowHeader";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

/**
 * Sign step content for the fee bump flow.
 *
 * Wraps `<SignTransactionXdr />` to sign the fee bump envelope produced in the
 * previous step. The signed fee bump XDR is stored in the transaction store
 * (`feeBump.signedTx`) so the flow can proceed to Submit.
 *
 * @example
 * {activeStep === "sign" && <SignStepContent xdrToSign={feeBumpXdr} />}
 */
export const SignStepContent = ({ xdrToSign }: { xdrToSign: string }) => {
  const { transaction } = useStore();
  const { feeBump, updateFeeBumpParams } = transaction;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <Box gap="lg">
      <Box gap="xs">
        <TransactionFlowHeader heading="Sign transaction" />
        <Text size="sm" as="p">
          To be included in the ledger, the transaction must be signed and
          submitted to the network.
        </Text>
      </Box>

      <SignTransactionXdr
        id="sign-step"
        xdrToSign={xdrToSign || null}
        onDoneAction={({ signedXdr, errorMessage }) => {
          updateFeeBumpParams({ signedTx: signedXdr ?? "" });
          setErrorMessage(errorMessage);
        }}
      />

      {errorMessage ? (
        <Alert variant="error" placement="inline">
          {errorMessage}
        </Alert>
      ) : null}

      {feeBump.signedTx ? (
        <ValidationResponseCard
          variant="success"
          title="Fee bump transaction XDR successfully updated!"
          response={
            <Box gap="xs" data-testid="fee-bump-sign-success">
              <TxResponse value={feeBump.signedTx} />
            </Box>
          }
        />
      ) : null}
    </Box>
  );
};
