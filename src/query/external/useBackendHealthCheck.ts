import { useQuery } from "@tanstack/react-query";

import { NetworkType } from "@/types/types";

export const useBackendHealthCheck = ({
  networkId,
}: {
  networkId: NetworkType;
}) => {
  const endpoint = process.env.NEXT_PUBLIC_STELLAR_LAB_BACKEND_URL;

  return useQuery({
    queryKey: ["backend-health", networkId],
    queryFn: async () => {
      const response = await fetch(`${endpoint}/${networkId}/health`);

      console.log("endpoint: ", endpoint);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend health check response: ", data);
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000,
  });
};
