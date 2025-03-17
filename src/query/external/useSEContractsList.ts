import { useQuery } from "@tanstack/react-query";
import { STELLAR_EXPERT_API } from "@/constants/settings";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { ContractListRecord, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contracts list
 */
export const useSEContractsList = ({
  networkId,
  cursor,
  order,
}: {
  networkId: NetworkType;
  cursor?: string;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<{
    records: ContractListRecord[];
    prevCursor: string | null;
    nextCursor: string | null;
  } | null>({
    queryKey: ["useSEContractsList", networkId, cursor, order],
    queryFn: async () => {
      const network = getStellarExpertNetwork(networkId);

      if (!network) {
        throw "This data is not supported on the current network.";
      }

      const params = new URLSearchParams();

      params.append("limit", "20");

      if (order) {
        params.append("order", order);
      }

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
    enabled: Boolean(networkId),
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
