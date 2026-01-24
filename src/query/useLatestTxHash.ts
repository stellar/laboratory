import { useQuery } from "@tanstack/react-query";
import { NetworkHeaders } from "@/types/types";

export const useLatestTxHash = (
  horizonUrl: string,
  headers: NetworkHeaders,
) => {
  const query = useQuery({
    queryKey: ["transaction-dashboard", "latestTxHash", horizonUrl],
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

        const records =
          requestResponse &&
          requestResponse._embedded &&
          Array.isArray(requestResponse._embedded.records)
            ? requestResponse._embedded.records
            : null;

        if (!records || records.length === 0) {
          throw new Error("No transactions found in Horizon response");
        }

        const latestRecord = records[0];

        if (!latestRecord || typeof latestRecord.hash !== "string") {
          throw new Error("Latest Horizon transaction is missing a hash value");
        }

        return latestRecord.hash;
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
