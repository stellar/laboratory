import { useQuery } from "@tanstack/react-query";

import { BACKEND_ENDPOINT } from "@/constants/backend";

import { BEContractStorageResponse, NetworkType } from "@/types/types";

export const useBackendContractStorage = ({
  isActive,
  networkId,
  contractId,
  paginationHref,
  sortBy,
  order,
}: {
  isActive: boolean;
  networkId: NetworkType;
  contractId: string;
  paginationHref?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  const query = useQuery({
    queryKey: [
      "useBackendContractStorage",
      networkId,
      contractId,
      paginationHref,
      { sortBy, order },
    ],
    queryFn: async () => {
      let fetchUrl: string;

      if (paginationHref) {
        fetchUrl = `${BACKEND_ENDPOINT}${paginationHref}`;
      } else {
        const network = networkId === "mainnet" ? "pubnet" : networkId;
        const params = new URLSearchParams({
          limit: "10",
          sort_by: sortBy ?? "updated_at",
          order: order ?? "desc",
        });
        fetchUrl = `${BACKEND_ENDPOINT}/${network}/api/contract/${contractId}/storage?${params}`;
      }

      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`Fetching data failed: ${response.status}`);
      }

      const responseJson = await response.json();
      return responseJson as BEContractStorageResponse | null;
    },
    enabled: Boolean(
      isActive &&
        networkId &&
        networkId !== "futurenet" &&
        networkId !== "custom" &&
        contractId,
    ),
    // Keep data for 30 seconds
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return query;
};
