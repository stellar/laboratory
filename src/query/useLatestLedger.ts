import { SorobanRpc } from "@stellar/stellar-sdk";

import { useQuery } from "@tanstack/react-query";

export const useLatestLedger = ({ rpcUrl }: { rpcUrl: string }) => {
  const query = useQuery({
    queryKey: ["useGetLatestLedger"],
    queryFn: async () => {
      const rpcServer = new SorobanRpc.Server(rpcUrl);

      try {
        const latestLedger = await rpcServer.getLatestLedger();

        return latestLedger.sequence;
      } catch (error) {
        throw `there was an error with fetching latest ledger. e: ${error}`;
      }
    },
    enabled: false,
  });

  return query;
};
