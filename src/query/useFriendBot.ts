import { useQuery } from "@tanstack/react-query";
import { EmptyObj, Network } from "@/types/types";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

export const useFriendBot = ({
  network,
  publicKey,
}: {
  network: Network | EmptyObj;
  publicKey: string;
}) => {
  const query = useQuery({
    queryKey: ["friendBot"],
    queryFn: async () => {
      if (!network.horizonUrl) {
        throw new Error(`Please use a network that supports Horizon`);
      }

      try {
        const response = await fetch(
          `${network.horizonUrl}/friendbot?addr=${publicKey}`,
        );

        if (!response.ok) {
          const errorBody = await response.json();

          throw new Error(errorBody.status);
        }
        return response;
      } catch (e: any) {
        if (e.status === 0) {
          throw new Error(`Unable to reach Friendbot server at ${network}`);
        } else {
          throw new Error(
            `Unable to fund ${shortenStellarAddress(publicKey)} on the test network`,
          );
        }
      }
    },
    enabled: false,
  });

  return query;
};
