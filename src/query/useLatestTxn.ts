import { useQuery } from "@tanstack/react-query";

export const useLatestTxn = (horizonUrl: string) => {
  const query = useQuery({
    queryKey: ["xdr", "latestTxn"],
    queryFn: async () => {
      try {
        const request = await fetch(
          `${horizonUrl}/transactions?limit=1&order=desc`,
        );
        const requestResponse = await request.json();

        return requestResponse._embedded.records[0].envelope_xdr;
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
