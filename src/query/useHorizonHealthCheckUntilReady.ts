import { useQuery } from "@tanstack/react-query";
import { checkRequestStatusUntilReady } from "@/helpers/checkRequestStatusUntilReady";
import { AnyObject } from "@/types/types";

/**
 * Do the Horizon network health check until it’s ready.
 */
export const useHorizonHealthCheckUntilReady = (
  horizonUrl: string,
  headers: AnyObject,
) => {
  const query = useQuery({
    queryKey: ["useHorizonHealthCheckUntilReady", horizonUrl],
    queryFn: async () => {
      if (!horizonUrl) {
        return null;
      }

      try {
        return await checkRequestStatusUntilReady({
          url: buildHorizonHealthUrl(horizonUrl),
          options: {
            headers,
          },
          readyProp: "core_up",
        });
      } catch (e: any) {
        throw `Something went wrong fetching Horizon URL. ${e.message || e}.`;
      }
    },
    enabled: Boolean(horizonUrl),
    // Run this query only once (data will always be considered fresh)
    staleTime: Infinity,
  });

  return query;
};

const buildHorizonHealthUrl = (horizonUrl: string) => {
  const url = new URL(horizonUrl);
  const pathnamePieces = url.pathname.split("/").filter((i) => i);
  const pathname = [...pathnamePieces, "health"].join("/");

  return `${url.origin}/${pathname}`;
};
