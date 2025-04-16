import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

/**
 * Fetch Wasm binary from RPC (returns wasm binary as buffer).
 */
export const useWasmBinaryFromRpc = ({
  wasmHash,
  rpcUrl,
  isActive,
  headers = {},
}: {
  wasmHash: string;
  rpcUrl: string;
  isActive: boolean;
  headers?: NetworkHeaders;
}) => {
  const query = useQuery<Buffer | null>({
    queryKey: ["useWasmBinaryFromRpc", wasmHash, rpcUrl],
    queryFn: async () => {
      if (!wasmHash || !rpcUrl) {
        return null;
      }

      try {
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        return await rpcServer.getContractWasmByHash(wasmHash, "hex");
      } catch (e: any) {
        throw `Something went wrong downloading the wasm binary. ${e.message || e}`;
      }
    },
    enabled: Boolean(wasmHash && rpcUrl && isActive),
  });

  return query;
};
