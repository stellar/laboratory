import { useQuery } from "@tanstack/react-query";
import { checkRequestStatusUntilReady } from "@/helpers/checkRequestStatusUntilReady";
import { AnyObject } from "@/types/types";

/**
 * Do the RPC network health check until it’s ready.
 */
export const useRpcHealthCheckUntilReady = (
  rpcUrl: string,
  headers: AnyObject,
) => {
  const query = useQuery({
    queryKey: ["useRpcHealthCheckUntilReady"],
    queryFn: async () => {
      if (!rpcUrl) {
        return null;
      }

      try {
        return await checkRequestStatusUntilReady({
          url: rpcUrl,
          options: {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 8675309,
              method: "getHealth",
            }),
          },
          readyProp: "result",
        });
      } catch (e: any) {
        throw `Something went wrong fetching RPC URL. ${e.message || e}.`;
      }
    },
    enabled: Boolean(rpcUrl),
    // Run this query only once (data will always be considered fresh)
    staleTime: Infinity,
  });

  return query;
};
