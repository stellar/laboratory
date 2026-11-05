import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractVersionHistoryResponseItem, NetworkType } from "@/types/types";

// Most contracts have only a few versions, so one page usually covers them all
const VERSION_HISTORY_PAGE_LIMIT = 20;

/**
 * StellarExpert API to get smart contract’s version history (all pages)
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
  const query = useQuery({
    queryKey: ["useSEContractVersionHistory", networkId, contractId],
    queryFn: async (): Promise<ContractVersionHistoryResponseItem[] | null> => {
      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        return null;
      }

      // The API defaults to `limit=10`, so page through all versions with the
      // `ts`-based `paging_token` cursor until a short page is returned.
      const fetchPage = async (
        cursor?: string,
      ): Promise<ContractVersionHistoryResponseItem[]> => {
        const searchParams = new URLSearchParams({
          order: "asc",
          limit: `${VERSION_HISTORY_PAGE_LIMIT}`,
        });

        if (cursor) {
          searchParams.append("cursor", cursor);
        }

        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract/${contractId}/version?${searchParams.toString()}`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        return responseJson?._embedded?.records || [];
      };

      try {
        let allRecords: ContractVersionHistoryResponseItem[] = [];
        let cursor: string | undefined;

        while (true) {
          const records = await fetchPage(cursor);

          allRecords = [...allRecords, ...records];

          if (records.length < VERSION_HISTORY_PAGE_LIMIT) {
            break;
          }

          cursor = records[records.length - 1].paging_token;
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
