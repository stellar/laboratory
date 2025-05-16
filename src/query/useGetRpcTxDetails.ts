import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";

import { NetworkHeaders } from "@/types/types";

export const useGetRpcTxDetails = ({
  rpcUrl,
  headers,
  tx,
}: {
  rpcUrl: string;
  headers: NetworkHeaders;
  tx: string;
}) => {
  const query = useQuery({
    queryKey: ["useGetRpcTxDetails", rpcUrl, tx],
    queryFn: async () => {
      const rpcServer = new StellarRpc.Server(rpcUrl, {
        headers,
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });

      try {
        const response = await rpcServer.getTransaction(tx);

        return response;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw "There was an error while fetching the transaction";
      }
    },
  });

  return query;
};
