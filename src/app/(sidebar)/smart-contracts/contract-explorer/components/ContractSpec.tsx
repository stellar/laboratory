import { useCallback, useEffect } from "react";
import { Alert, Text, Loader, Button, Icon } from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { CodeEditor } from "@/components/CodeEditor";
import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";

import { useWasmFromRpc } from "@/query/useWasmFromRpc";
import { useSEContractWasmBinary } from "@/query/external/useSEContractWasmBinary";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import * as StellarXdr from "@/helpers/StellarXdr";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";
import { delayedAction } from "@/helpers/delayedAction";
import { downloadFile } from "@/helpers/downloadFile";

import { NetworkType } from "@/types/types";

export const ContractSpec = ({
  contractId,
  networkId,
  networkPassphrase,
  rpcUrl,
  wasmHash,
  isActive,
}: {
  contractId: string;
  networkId: NetworkType;
  networkPassphrase: string;
  rpcUrl: string;
  wasmHash: string;
  isActive: boolean;
}) => {
  const isXdrInit = useIsXdrInit();
  const queryClient = useQueryClient();

  const {
    data: wasmData,
    error: wasmError,
    isLoading: isWasmLoading,
    isFetching: isWasmFetching,
  } = useWasmFromRpc({
    wasmHash,
    contractId,
    networkPassphrase,
    rpcUrl,
    isActive: Boolean(isActive && rpcUrl && wasmHash),
  });

  const {
    data: wasmBinary,
    error: wasmBinaryError,
    isLoading: isWasmBinaryLoading,
    isFetching: isWasmBinaryFetching,
    refetch: fetchWasmBinary,
  } = useSEContractWasmBinary({ wasmHash, networkId });

  const resetWasmBlob = useCallback(() => {
    queryClient.resetQueries({
      queryKey: ["useSEContractWasmBinary", networkId, wasmHash],
    });
  }, [networkId, queryClient, wasmHash]);

  useEffect(() => {
    if (wasmBinary) {
      downloadFile({
        value: wasmBinary,
        fileType: "application/octet-stream",
        fileName: wasmHash,
        fileExtension: "wasm",
      });
    }
  }, [wasmBinary, wasmHash]);

  useEffect(() => {
    if (wasmBinaryError) {
      // Automatically clear error message after 5 sec
      delayedAction({
        action: resetWasmBlob,
        delay: 5000,
      });
    }
  }, [resetWasmBlob, wasmBinaryError]);

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

  if (isWasmLoading || isWasmFetching) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (wasmError) {
    const errorString = wasmError.toString();
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

  const formatSpec = () => {
    const entries = wasmData?.spec?.entries;

    try {
      if (isXdrInit && entries?.length) {
        const decodedEntries = entries.map((e) => {
          const jsonString = StellarXdr.decode(
            "ScSpecEntry",
            e.toXDR("base64"),
          );

          return prettifyJsonString(jsonString);
        });

        return decodedEntries.join(",\n\n");
      }
    } catch (e) {
      // do nothing
    }

    return "";
  };

  return (
    <Box gap="lg">
      <CodeEditor
        title="Contract Spec"
        value={formatSpec()}
        language="json"
        fileName={`${wasmHash}-contract-spec`}
      />

      <Box gap="xs" direction="column" align="end">
        <Button
          variant="tertiary"
          size="sm"
          icon={<Icon.Download01 />}
          iconPosition="left"
          onClick={(e) => {
            e.preventDefault();

            if (wasmBinaryError) {
              resetWasmBlob();
            }

            delayedAction({
              action: fetchWasmBinary,
              delay: wasmBinaryError ? 500 : 0,
            });
          }}
          isLoading={isWasmBinaryLoading || isWasmBinaryFetching}
        >
          Download WASM
        </Button>

        <>
          {wasmBinaryError ? (
            <ErrorText errorMessage={wasmBinaryError.toString()} size="sm" />
          ) : null}
        </>
      </Box>
    </Box>
  );
};
