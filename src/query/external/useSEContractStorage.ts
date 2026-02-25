import { useQuery } from "@tanstack/react-query";
import {
  CONTRACT_STORAGE_MAX_ENTRIES,
  STELLAR_EXPERT_API,
} from "@/constants/settings";
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
      let hasMoreRecords = true;

      const fetchData = async (cursor?: string) => {
        const searchParams = new URLSearchParams();

        searchParams.append("order", "desc");
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

        const newRecords = responseJson?._embedded?.records || [];

        allRecords = [...allRecords, ...newRecords];

        if (newRecords.length === 0) {
          hasMoreRecords = false;
        }
      };

      try {
        // Fetch the last entries limited by CONTRACT_STORAGE_MAX_ENTRIES
        while (
          allRecords.length <
            Math.min(totalEntriesCount, CONTRACT_STORAGE_MAX_ENTRIES) &&
          hasMoreRecords
        ) {
          const lastRecord = allRecords.slice(-1)[0];
          await fetchData(lastRecord?.paging_token);
        }

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
