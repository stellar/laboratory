import { Alert, Text } from "@stellar/design-system";

import { useWasmFromRpc } from "@/query/useWasmFromRpc";
import { CodeEditor } from "@/components/CodeEditor";
import * as StellarXdr from "@/helpers/StellarXdr";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

export const ContractSpec = ({
  contractId,
  networkPassphrase,
  rpcUrl,
  wasmHash,
  isActive,
}: {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
  wasmHash: string;
  isActive: boolean;
}) => {
  const isXdrInit = useIsXdrInit();

  // TODO: manage loading and error state
  const {
    data: wasmData,
    // error: wasmError,
    // isLoading: isWasmLoading,
    // isFetching: isWasmFetching,
  } = useWasmFromRpc({
    wasmHash,
    contractId,
    networkPassphrase,
    rpcUrl,
    isActive: Boolean(isActive && rpcUrl && wasmHash),
  });

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
    <CodeEditor title="Contract Spec" value={formatSpec()} language="json" />
  );
};
