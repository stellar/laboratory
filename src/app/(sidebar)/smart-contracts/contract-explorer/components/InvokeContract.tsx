import { Alert, Card, Loader, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { useContractClientFromRpc } from "@/query/useContractClientFromRpc";

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
  const { walletKit } = useStore();
  const {
    data: contractClient,
    isFetching: isFetchingContractClient,
    isError,
    isSuccess,
    error: contractClientError,
  } = useContractClientFromRpc({
    contractId: infoData.contract,
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
  });

  const renderFunctionCard = () =>
    contractClient?.spec
      ?.funcs()
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

  if (isLoading || isFetchingContractClient) {
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

          {isSuccess ? renderFunctionCard() : null}
          {isError ? renderError() : null}
        </Box>
      </Card>
    </Box>
  );
};
