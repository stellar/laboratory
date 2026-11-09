import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractInfoApiResponse, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract info
 *
 * @param enabled - Fetch automatically when the key changes (and serve cached
 * data on revisit). Defaults to `false`, for callers that fetch with
 * `refetch()`.
 */
export const useSEContractInfo = ({
  networkId,
  contractId,
  enabled = false,
}: {
  networkId: NetworkType;
  contractId: string;
  enabled?: boolean;
}) => {
  const query = useQuery({
    queryKey: ["useSEContractInfo", networkId, contractId],
    queryFn: async (): Promise<ContractInfoApiResponse | null> => {
      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        return null;
      }

      try {
        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract/${contractId}`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        return responseJson;
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return query;
};
