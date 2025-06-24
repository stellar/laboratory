import { useQuery } from "@tanstack/react-query";
import { NetworkHeaders, RpcTxJsonResponse } from "@/types/types";

export const useFetchRpcTxDetails = ({
  rpcUrl,
  headers,
  txHash,
}: {
  rpcUrl: string;
  headers: NetworkHeaders;
  txHash: string;
}) => {
  const query = useQuery({
    queryKey: ["useFetchRpcTxDetails", rpcUrl, txHash],
    queryFn: async () => {
      try {
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "getTransaction",
            params: {
              hash: txHash,
              xdrFormat: "json",
            },
          }),
        });

        const responseJson = await response.json();
        return responseJson.result as RpcTxJsonResponse;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw "There was an error while fetching the transaction";
      }
    },
    enabled: false,
  });

  return query;
};
