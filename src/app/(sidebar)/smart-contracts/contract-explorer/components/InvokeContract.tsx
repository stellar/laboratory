import { Card, Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { ContractInfoApiResponse, EmptyObj, Network } from "@/types/types";

import { InvokeContractForm } from "./InvokeContractForm";

export const InvokeContract = ({
  infoData,
  network,
  isLoading,
}: {
  infoData: ContractInfoApiResponse;
  network: Network | EmptyObj;
  isLoading: boolean;
}) => {
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
    <Card>
      <Box gap="lg" data-testid="contract-info-contract-container">
        <Text as="h2" size="md" weight="semi-bold">
          Invoke Contract
        </Text>

        {filteredSpecFunctions?.map((func, index) =>
          renderFunctionCard(func.function, index),
        )}
      </Box>
    </Card>
  );
};
