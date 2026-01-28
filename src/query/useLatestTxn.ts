import { useQuery } from "@tanstack/react-query";
import { NetworkHeaders } from "@/types/types";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

export const useLatestTxn = (
  rpcUrl: string,
  headers: NetworkHeaders,
  queryKey: string[] = ["latestTxn"],
) => {
  const query = useQuery({
    queryKey: [...queryKey, rpcUrl],
    queryFn: async () => {
      try {
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers,
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        // Get the latest ledger to determine where to start fetching
        const latestLedger = await rpcServer.getLatestLedger();

        const params: StellarRpc.Api.GetTransactionsRequest = {
          startLedger: latestLedger.sequence,
          pagination: {
            limit: 1,
          },
        };

        const response = await rpcServer.getTransactions(params);

        if (!response.transactions || response.transactions.length === 0) {
          throw new Error("No transactions found in RPC response");
        }

        // Return the first (latest) transaction with hash and envelope_xdr
        const latestTx = response.transactions[0];
        
        return {
          hash: latestTx.txHash,
          // Convert XDR object to base64 string for compatibility with XDR view page
          envelope_xdr: latestTx.envelopeXdr?.toXDR("base64").toString(),
          // Keep the full transaction data for other uses
          ...latestTx,
        };
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
