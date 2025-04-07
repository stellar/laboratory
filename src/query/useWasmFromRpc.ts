import { contract } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch Wasm from RPC (returns parsed Wasm to get entries, etc).
 */
export const useWasmFromRpc = ({
  wasmHash,
  contractId,
  networkPassphrase,
  rpcUrl,
  isActive,
}: {
  wasmHash: string;
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
  isActive: boolean;
}) => {
  const query = useQuery<contract.Client | null>({
    queryKey: ["useWasmFromRpc", wasmHash, rpcUrl],
    queryFn: async () => {
      if (!wasmHash || !rpcUrl) {
        return null;
      }

      try {
        const wasm = await contract.Client.fromWasmHash(wasmHash, {
          contractId,
          networkPassphrase,
          rpcUrl,
        });

        return wasm;
      } catch (e: any) {
        throw `Something went wrong downloading the wasm binary. ${e.message || e}`;
      }
    },
    enabled: isActive,
  });

  return query;
};
