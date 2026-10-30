import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractListRecord, NetworkType } from "@/types/types";

/** Records per page requested from the list API */
export const SE_CONTRACTS_LIST_PAGE_SIZE = 20;

const CONTRACT_ID_LENGTH = 56;

/**
 * The list API orders by contract ID and its cursor is a contract ID (the
 * next page starts right after it), so a prefix search is a cursor that sits
 * just before (ascending) or just after (descending) every ID with that prefix.
 */
export const getSEContractsPrefixCursor = (
  prefix: string,
  order: "asc" | "desc",
) => (order === "asc" ? prefix : prefix.padEnd(CONTRACT_ID_LENGTH, "Z"));

/**
 * StellarExpert API to get smart contracts list
 */
export const useSEContractsList = ({
  networkId,
  cursor,
  order,
  enabled = true,
}: {
  networkId: NetworkType;
  cursor?: string;
  order?: "asc" | "desc";
  enabled?: boolean;
}) => {
  const query = useQuery({
    queryKey: ["useSEContractsList", networkId, cursor, order],
    queryFn: async (): Promise<{
      records: ContractListRecord[];
      prevCursor: string | null;
      nextCursor: string | null;
    }> => {
      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        throw "This data is not supported on the current network.";
      }

      const params = new URLSearchParams();

      params.append("limit", String(SE_CONTRACTS_LIST_PAGE_SIZE));
      params.append("order", order || "desc");

      if (cursor) {
        params.append("cursor", cursor);
      }

      try {
        const response = await fetch(
          `${STELLAR_EXPERT_API}/${network}/contract?${params.toString()}`,
        );

        const responseJson = await response.json();

        if (responseJson.error) {
          throw responseJson.error;
        }

        const records = responseJson._embedded.records as ContractListRecord[];
        const prevCursor = getCursorFromUrl(responseJson._links.prev.href);
        const nextCursor = getCursorFromUrl(responseJson._links.next.href);

        return {
          records,
          prevCursor: cursor ? prevCursor : null,
          nextCursor,
        };
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled: Boolean(networkId) && enabled,
    // Keep data for 60 seconds
    staleTime: 1000 * 60,
    // Keep previous data
    placeholderData: (prev) => prev,
  });

  return query;
};

const getCursorFromUrl = (link: string) => {
  return new URL(`https://stellar.expert${link}`).searchParams.get("cursor");
};
