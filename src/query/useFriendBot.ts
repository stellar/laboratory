import { useQuery } from "@tanstack/react-query";
import { EmptyObj, Network } from "@/types/types";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

export const useFriendBot = ({
  network,
  publicKey,
  key,
}: {
  network: Network | EmptyObj;
  publicKey: string;
  key: { type: string };
}) => {
  const knownFriendbotURL =
    network.id === "futurenet"
      ? "https://friendbot-futurenet.stellar.org"
      : "https://friendbot.stellar.org";

  const query = useQuery({
    queryKey: ["friendBot", key],
    queryFn: async () => {
      if (!network.horizonUrl) {
        throw new Error(`Please use a network that supports Horizon`);
      }

      try {
        const url =
          network.id === "custom"
            ? `${network.horizonUrl}/friendbot`
            : `${knownFriendbotURL}/`;
        const response = await fetch(`${url}?addr=${publicKey}`);

        if (!response.ok) {
          const errorBody = await response.json();

          throw new Error("there was an error", { cause: errorBody });
        }
        return response;
      } catch (e: any) {
        if (e.cause.status === 0) {
          throw new Error(`Unable to reach Friendbot server at ${network}`);
        } else if (e.cause.detail.includes("createAccountAlreadyExist")) {
          throw new Error(
            `This account is already funded. Therefore, we are unable to fund ${shortenStellarAddress(publicKey)} on the test network.`,
          );
        } else {
          throw new Error(
            `Unable to fund ${shortenStellarAddress(publicKey)} on the test network. Details: ${e.cause.detail}`,
            { cause: e },
          );
        }
      }
    },
    enabled: false,
  });

  return query;
};
