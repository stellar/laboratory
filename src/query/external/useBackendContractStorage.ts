import { useQuery } from "@tanstack/react-query";

import { BACKEND_ENDPOINT } from "@/constants/backend";

import { BEContractStorageResponse, NetworkType } from "@/types/types";

export const useBackendContractStorage = ({
  isActive,
  networkId,
  contractId,
  cursor,
  sortBy,
  order,
}: {
  isActive: boolean;
  networkId: NetworkType;
  contractId: string;
  cursor?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<BEContractStorageResponse | null>({
    queryKey: [
      "useBackendContractStorage",
      networkId,
      contractId,
      cursor,
      sortBy,
      order,
    ],
    queryFn: async () => {
      const network = networkId === "mainnet" ? "pubnet" : networkId;
      const baseUrl = `${BACKEND_ENDPOINT}/${network}/api/contract/${contractId}/storage?limit=10${sortBy ? `&sort_by=${sortBy}` : ""}${order ? `&order=${order}` : ""}`;
      const fetchUrl = cursor
        ? `${baseUrl}&cursor=${encodeURIComponent(cursor)}`
        : baseUrl;

      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`Fetching data failed: ${response.status}`);
      }

      const responseJson = await response.json();
      return responseJson;
    },
    enabled: Boolean(
      isActive &&
        networkId &&
        networkId !== "futurenet" &&
        networkId !== "custom" &&
        contractId,
    ),
    // Keep data for 30 seconds
    staleTime: 1000 * 30,
  });

  return query;
};
