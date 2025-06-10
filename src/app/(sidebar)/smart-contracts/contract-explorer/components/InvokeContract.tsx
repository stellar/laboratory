import { Alert, Card, Loader, Text } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { FormErrorProvider } from "@/components/SmartContractJsonSchema/FormErrorContext";

import { ContractInfoApiResponse, EmptyObj, Network } from "@/types/types";

import { InvokeContractForm } from "./InvokeContractForm";

export const InvokeContract = ({
  network,
  isLoading,
  infoData,
  contractSpec,
  contractClientError,
}: {
  network: Network | EmptyObj;
  isLoading: boolean;
  infoData: ContractInfoApiResponse;
  contractSpec: contract.Spec;
  contractClientError: Error | null;
}) => {
  const { walletKit } = useStore();
  const contractSpecFuncs = contractSpec?.funcs();

  const renderFunctionCard = () =>
    contractSpecFuncs
      ?.filter((func) => !func.name().toString().includes("__"))
      ?.map((func) => (
        <InvokeContractForm
          key={`${func.name()}`}
          infoData={infoData}
          network={network}
          funcName={func.name().toString()}
        />
      ));

  const renderError = () => (
    <Alert variant="error" placement="inline" title="Error">
      {contractClientError?.message}
    </Alert>
  );

  if (isLoading) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  return (
    <Box gap="md">
      {!walletKit?.publicKey ? (
        <Alert variant="warning" placement="inline" title="Connect wallet">
          A connected wallet is required to invoke this contract. Please connect
          your wallet to proceed.
        </Alert>
      ) : null}
      <Card>
        <Box gap="lg" data-testid="invoke-contract-container">
          <Text as="h2" size="md" weight="semi-bold">
            Invoke Contract
          </Text>

          <FormErrorProvider>
            {contractSpecFuncs ? renderFunctionCard() : null}
          </FormErrorProvider>
          {contractClientError ? renderError() : null}
        </Box>
      </Card>
    </Box>
  );
};
