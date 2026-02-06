import { Alert, Card, Loader, Text } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";

import { InvokeContractForm } from "./InvokeContractForm";

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
      {!walletKit?.publicKey ? (
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
