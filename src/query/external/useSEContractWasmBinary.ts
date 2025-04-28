import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract Wasm binary
 */
export const useSEContractWasmBinary = ({
  networkId,
  wasmHash,
}: {
  networkId: NetworkType;
  wasmHash: string;
}) => {
  const query = useQuery<ArrayBuffer | null>({
    queryKey: ["useSEContractWasmBinary", networkId, wasmHash],
    queryFn: async () => {
      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        return null;
      }

      try {
        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/wasm/${wasmHash}`,
        );

        if (response.status === 200) {
          const responseArrayBuffer = await response.arrayBuffer();

          return responseArrayBuffer;
        } else {
          const responseJson = await response.json();

          throw responseJson.error || "Wasm binary error";
        }
      } catch (e: any) {
        throw `Error downloading Wasm. ${e}`;
      }
    },
    enabled: false,
  });

  return query;
};
