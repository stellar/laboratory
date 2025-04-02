import { Alert, Text, Loader } from "@stellar/design-system";
import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";

export const renderWasmStatus = ({
  wasmHash,
  rpcUrl,
  isLoading,
  error,
}: {
  wasmHash: string;
  rpcUrl: string;
  isLoading: boolean;
  error: Error | null;
}) => {
  if (!wasmHash) {
    return (
      <Text as="div" size="sm">
        There is no wasm for this contract
      </Text>
    );
  }

  if (!rpcUrl) {
    return (
      <Alert variant="warning" placement="inline" title="Attention">
        RPC URL is required to get the Contract Spec. You can add it in the
        network settings in the upper right corner.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (error) {
    const errorString = error.toString();
    let networkMessage = null;

    if (errorString.toLowerCase().includes("network error")) {
      networkMessage = (
        <Alert variant="warning" placement="inline" title="Attention">
          There may be an issue with the RPC server. You can change it in the
          network settings in the upper right corner.
        </Alert>
      );
    }

    return (
      <Box gap="lg">
        <>
          <ErrorText errorMessage={errorString} size="sm" />
          {networkMessage}
        </>
      </Box>
    );
  }

  return null;
};
