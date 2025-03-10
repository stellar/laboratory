import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractInfoApiResponse, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract info
 */
export const useSEContractInfo = ({
  networkId,
  contractId,
}: {
  networkId: NetworkType;
  contractId: string;
}) => {
  const query = useQuery<ContractInfoApiResponse>({
    queryKey: ["useSEContractInfo", networkId, contractId],
    queryFn: async () => {
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
    enabled: false,
  });

  return query;
};
