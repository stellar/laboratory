import { useQuery } from "@tanstack/react-query";

import { BACKEND_ENDPOINT } from "@/constants/backend";

import { NetworkType } from "@/types/types";

export const useBackendHealthCheck = ({
  networkId,
}: {
  networkId: NetworkType;
}) => {
  return useQuery({
    queryKey: ["backend-health", networkId],
    queryFn: async () => {
      try {
        const network = networkId === "mainnet" ? "pubnet" : networkId;
        const response = await fetch(`${BACKEND_ENDPOINT}/${network}/health`);

        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (e) {
        console.log("Error checking backend health: ", e);
        throw new Error(`Error checking backend health. ${e}`);
      }
    },
    staleTime: 20000,
    enabled: Boolean(
      networkId && networkId !== "futurenet" && networkId !== "custom",
    ),
  });
};
