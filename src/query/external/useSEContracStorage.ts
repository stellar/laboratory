import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractStorageResponseItem, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract’s storage data
 */
export const useSEContractStorage = ({
  isActive,
  networkId,
  contractId,
  totalEntriesCount,
}: {
  isActive: boolean;
  networkId: NetworkType;
  contractId: string;
  totalEntriesCount: number | undefined;
}) => {
  const query = useQuery<ContractStorageResponseItem[] | null>({
    queryKey: ["useSEContractStorage", networkId, contractId],
    queryFn: async () => {
      // No entries
      if (!totalEntriesCount) {
        return null;
      }

      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        return null;
      }

      let allRecords: ContractStorageResponseItem[] = [];

      const fetchData = async (cursor?: string) => {
        const searchParams = new URLSearchParams();

        searchParams.append("order", "asc");
        searchParams.append("limit", "200");

        if (cursor) {
          searchParams.append("cursor", cursor);
        }

        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract-data/${contractId}?${searchParams.toString()}`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        allRecords = [
          ...allRecords,
          ...(responseJson?._embedded?.records || []),
        ];
      };

      try {
        while (allRecords.length < totalEntriesCount) {
          const lastRecord = allRecords.slice(-1)[0];
          await fetchData(lastRecord?.paging_token);
        }

        // TODO: check max entries for smooth UX
        return allRecords;
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
