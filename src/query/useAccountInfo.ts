import { NetworkHeaders } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useAccountInfo = ({
  publicKey,
  horizonUrl,
  headers,
}: {
  publicKey: string;
  horizonUrl: string;
  headers: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["accountInfo", publicKey],
    queryFn: async () => {
      try {
        const response = await fetch(`${horizonUrl}/accounts/${publicKey}`, {
          headers,
        });
        const responseJson = await response.json();

        if (responseJson.status === 404) {
          return {
            id: publicKey,
            isFunded: false,
          };
        }

        return {
          id: publicKey,
          isFunded: true,
          details: responseJson,
        };
      } catch (e: any) {
        throw `Something went wrong. ${e}`;
      }
    },
    enabled: false,
  });

  return query;
};
