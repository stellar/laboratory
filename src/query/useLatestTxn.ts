import { useQuery } from "@tanstack/react-query";
import { NetworkHeaders } from "@/types/types";

export const useLatestTxn = (
  horizonUrl: string,
  headers: NetworkHeaders,
  queryKey: string[] = ["latestTxn"],
) => {
  const query = useQuery({
    queryKey: [...queryKey, horizonUrl],
    queryFn: async () => {
      try {
        const request = await fetch(
          `${horizonUrl}/transactions?limit=1&order=desc`,
          { headers },
        );

        if (!request.ok) {
          throw new Error(
            `Horizon responded with status ${request.status} ${request.statusText}`,
          );
        }

        const requestResponse = await request.json();

        const records = requestResponse?._embedded?.records;

        if (!Array.isArray(records) || records.length === 0) {
          throw new Error("No transactions found in Horizon response");
        }

        return records[0];
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
