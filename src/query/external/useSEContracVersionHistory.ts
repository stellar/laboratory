import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { ContractVersionHistoryResponseItem, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract’s version history
 */
export const useSEContracVersionHistory = ({
  networkId,
  contractId,
}: {
  networkId: NetworkType;
  contractId: string;
}) => {
  const query = useQuery<ContractVersionHistoryResponseItem[]>({
    queryKey: ["useSEContracVersionHistory", networkId, contractId],
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
    enabled: Boolean(networkId && contractId),
  });

  return query;
};
