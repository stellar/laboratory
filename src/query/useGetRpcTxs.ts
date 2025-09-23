import { NetworkHeaders } from "@/types/types";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { useQuery } from "@tanstack/react-query";

export const useGetRpcTxs = ({
  rpcUrl,
  headers,
  startLedger,
}: {
  rpcUrl: string;
  headers: NetworkHeaders;
  startLedger: number;
}) => {
  const query = useQuery({
    queryKey: ["useGetRpcTxs", rpcUrl, startLedger],
    queryFn: async () => {
      const rpcServer = new StellarRpc.Server(rpcUrl, {
        headers,
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });

      const params: StellarRpc.Api.GetTransactionsRequest = {
        startLedger,
        pagination: {
          limit: 100,
        },
      };

      try {
        if (!params.startLedger) {
          const latestLedger = await rpcServer.getLatestLedger();
          params.startLedger = latestLedger.sequence;
        }
      } catch (error) {
        throw `there was an error with fetching latest ledger. e: ${error}`;
      }

      try {
        const response = await rpcServer.getTransactions(params);

        return response;
      } catch (error) {
        throw `there was an error with fetching transactions. e: ${error}`;
      }
    },
    enabled: false,
  });

  return query;
};
