import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

/**
 * Fetch Wasm binary from RPC (returns wasm binary as a Uint8Array).
 *
 * The bytes behind a Wasm hash never change, so the result is cached for the
 * session (no refetch on mount) and every consumer of the same hash (contract
 * explorer page, spec/meta tabs, deploy page) shares one download.
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
  const query = useQuery({
    queryKey: ["useWasmBinaryFromRpc", wasmHash, rpcUrl, headers],
    queryFn: async (): Promise<Uint8Array | null> => {
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
        throw `Something went wrong downloading the Wasm binary. ${e.message || e}`;
      }
    },
    enabled: Boolean(wasmHash && rpcUrl && isActive),
    // Content-addressed: the Wasm for a given hash is immutable
    staleTime: Infinity,
    // Keep unused Wasm around for 30 minutes so revisits don't re-download it
    gcTime: 1000 * 60 * 30,
  });

  return query;
};
