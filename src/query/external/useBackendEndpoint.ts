import { useQuery } from "@tanstack/react-query";

import { BEContractStorageResponse, NetworkType } from "@/types/types";

/**
 * StellarExpert API to get smart contract’s storage data
 */
export const useBackendEndpoint = ({
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
      "useBackendEndpoint",
      networkId,
      contractId,
      cursor,
      sortBy,
      order,
    ],
    queryFn: async () => {
      const STELLAR_LAB_API = process.env.NEXT_PUBLIC_STELLAR_LAB_BACKEND_URL;

      if (!STELLAR_LAB_API) {
        throw "Backend URL is not defined";
      }

      if (networkId === "futurenet" || networkId === "custom") {
        throw "Network is not supported";
      }

      const fetchContractStorageData = async () => {
        const baseUrl = `${STELLAR_LAB_API}/${networkId}/api/contract/${contractId}/storage?limit=10${sortBy ? `&sort_by=${sortBy}` : ""}${order ? `&order=${order}` : ""}`;
        const fetchUrl = cursor
          ? `${baseUrl}&cursor=${encodeURIComponent(cursor)}`
          : baseUrl;

        console.log("fetchUrl: ", fetchUrl);
        const response = await fetch(fetchUrl);

        const responseJson = await response.json();
        return responseJson;
      };

      try {
        const data = await fetchContractStorageData();
        return data;
      } catch (e) {
        throw `Error fetching data from backend. ${e}`;
      }
    },
    enabled: Boolean(isActive && networkId && contractId),
    // Keep data for 30 seconds
    staleTime: 1000 * 30,
  });

  return query;
};
