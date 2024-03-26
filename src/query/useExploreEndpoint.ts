import { useQuery } from "@tanstack/react-query";

export const useExploreEndpoint = (requestUrl: string) => {
  const query = useQuery({
    queryKey: ["exploreEndpoint", "response"],
    queryFn: async () => {
      const endpointResponse = await fetch(requestUrl);
      const endpointResponseJson = await endpointResponse.json();

      return {
        isError: endpointResponseJson?.status?.toString()?.startsWith("4"),
        json: endpointResponseJson,
      };
    },
    enabled: false,
  });

  return query;
};
