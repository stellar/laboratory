import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { ContractInfoApiResponse, NetworkType } from "@/types/types";

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
      // Not supported networks
      if (["futurenet", "custom"].includes(networkId)) {
        return null;
      }

      const network = networkId === "mainnet" ? "public" : "testnet";

      try {
        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract/${contractId}`,
        );

        return await response.json();
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled: false,
  });

  return query;
};
