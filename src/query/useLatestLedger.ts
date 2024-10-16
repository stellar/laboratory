import { NetworkHeaders } from "@/types/types";
import { SorobanRpc } from "@stellar/stellar-sdk";

import { useQuery } from "@tanstack/react-query";

export const useLatestLedger = ({
  rpcUrl,
  headers,
}: {
  rpcUrl: string;
  headers: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["useLatestLedger"],
    queryFn: async () => {
      const rpcServer = new SorobanRpc.Server(rpcUrl, { headers });

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
