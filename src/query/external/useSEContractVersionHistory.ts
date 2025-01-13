import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { ContractVersionHistoryResponseItem, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract’s version history
 */
export const useSEContractVersionHistory = ({
  isActive,
  networkId,
  contractId,
}: {
  isActive: boolean;
  networkId: NetworkType;
  contractId: string;
}) => {
  const query = useQuery<ContractVersionHistoryResponseItem[]>({
    queryKey: ["useSEContractVersionHistory", networkId, contractId],
    queryFn: async () => {
      // Not supported networks
      if (["futurenet", "custom"].includes(networkId)) {
        return null;
      }

      const network = networkId === "mainnet" ? "public" : "testnet";

      try {
        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract/${contractId}/version`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        return responseJson?._embedded?.records || [];
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled: Boolean(isActive && networkId && contractId),
    // Keep data for 30 seconds
    staleTime: 1000 * 30,
  });

  return query;
};
