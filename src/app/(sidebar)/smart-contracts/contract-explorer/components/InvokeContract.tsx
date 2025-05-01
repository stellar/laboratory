import { Alert, Card, Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { ContractInfoApiResponse, EmptyObj, Network } from "@/types/types";

import { InvokeContractForm } from "./InvokeContractForm";
import { useStore } from "@/store/useStore";

export const InvokeContract = ({
  infoData,
  network,
  isLoading,
}: {
  infoData: ContractInfoApiResponse;
  network: Network | EmptyObj;
  isLoading: boolean;
}) => {
  const { walletKit } = useStore();

  // omit __constructor__ and __init__ functions
  const filteredSpecFunctions = infoData.functions?.filter(
    (f) => !f.function.includes("__"),
  );

  const renderFunctionCard = (funcName: string, index: number) => (
    <InvokeContractForm
      key={funcName + index}
      infoData={infoData}
      network={network}
      funcName={funcName}
    />
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

          {filteredSpecFunctions?.map((func, index) =>
            renderFunctionCard(func.function, index),
          )}
        </Box>
      </Card>
    </Box>
  );
};
