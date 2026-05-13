"use client";

import { useState } from "react";
import { Alert, Card, Loader, RadioButton, Text } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";

import { InvokeContractForm, SigningMethod } from "./InvokeContractForm";

export const InvokeContract = ({
  isLoading,
  contractId,
  contractSpec,
  contractClientError,
}: {
  isLoading: boolean;
  contractId: string;
  contractSpec: contract.Spec;
  contractClientError: Error | null | undefined;
}) => {
  const { walletKit } = useStore();
  const [signingMethod, setSigningMethod] = useState<SigningMethod>("wallet");

  const renderFunctionCard = () => {
    const invokeContractSpecFuncs = contractSpec?.funcs();

    return invokeContractSpecFuncs
      ?.filter((func) => !func.name().toString().includes("__"))
      ?.map((func) => {
        const funcName = func.name().toString();

        return (
          <InvokeContractForm
            contractSpec={contractSpec}
            key={funcName}
            contractId={contractId}
            funcName={funcName}
            signingMethod={signingMethod}
          />
        );
      });
  };

  const renderError = () => {
    if (contractClientError?.message) {
      return (
        <Alert variant="error" placement="inline" title="Error">
          {contractClientError?.message}
        </Alert>
      );
    }
    return (
      <Alert variant="error" placement="inline" title="Error">
        An unexpected error occurred while fetching the contract specification.
      </Alert>
    );
  };

  if (isLoading) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  return (
    <Box gap="md" addlClassName="InvokeContractForm">
      <Box gap="md" direction="row" justify="end">
        <RadioButton
          id="invoke-contract-signing-wallet"
          label="Use connected wallet"
          fieldSize="md"
          name="invoke-contract-signing-method"
          value="wallet"
          checked={signingMethod === "wallet"}
          onChange={() => {
            setSigningMethod("wallet");
          }}
        />
        <RadioButton
          id="invoke-contract-signing-another"
          label="Use another signing method"
          fieldSize="md"
          name="invoke-contract-signing-method"
          value="another"
          checked={signingMethod === "another"}
          onChange={() => {
            setSigningMethod("another");
          }}
        />
      </Box>

      {!walletKit?.publicKey && signingMethod === "wallet" ? (
        <Alert variant="warning" placement="inline" title="Connect wallet">
          A connected wallet is required to invoke this contract. Please connect
          your wallet to proceed.
        </Alert>
      ) : null}

      <Card>
        <Box gap="lg" data-testid="invoke-contract-container">
          <Text as="h2" size="md" weight="semi-bold">
            Invoke contract
          </Text>

          {contractSpec ? renderFunctionCard() : null}
          {contractClientError ? renderError() : null}
        </Box>
      </Card>
    </Box>
  );
};
