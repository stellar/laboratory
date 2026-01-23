import { useQuery } from "@tanstack/react-query";
import { NetworkHeaders } from "@/types/types";

export const useLatestTxHash = (
  horizonUrl: string,
  headers: NetworkHeaders,
) => {
  const query = useQuery({
    queryKey: ["transaction-dashboard", "latestTxHash"],
    queryFn: async () => {
      try {
        const request = await fetch(
          `${horizonUrl}/transactions?limit=1&order=desc`,
          { headers },
        );
        const requestResponse = await request.json();

        return requestResponse._embedded.records[0].hash;
      } catch (e) {
        throw new Error(
          `There was a problem fetching the latest transaction: ${e}`,
        );
      }
    },
    enabled: false,
  });

  return query;
};
