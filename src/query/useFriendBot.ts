import { useQuery } from "@tanstack/react-query";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

export const useFriendBot = ({
  network,
  publicKey,
}: {
  network: string;
  publicKey: string;
}) => {
  const friendbotURL =
    network === "futurenet"
      ? "https://friendbot-futurenet.stellar.org"
      : "https://friendbot.stellar.org";

  const query = useQuery({
    queryKey: ["friendBot"],
    queryFn: async () => {
      try {
        const response = await fetch(`${friendbotURL}/?addr=${publicKey}`);

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
