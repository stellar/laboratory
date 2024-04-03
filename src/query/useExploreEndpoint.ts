import { useQuery } from "@tanstack/react-query";
import { AnyObject } from "@/types/types";

export const useExploreEndpoint = (
  requestUrl: string,
  postData?: AnyObject,
) => {
  const query = useQuery({
    queryKey: ["exploreEndpoint", "response", postData],
    queryFn: async () => {
      const endpointResponse = await fetch(
        requestUrl,
        getPostOptions(postData),
      );
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

const getPostOptions = (postData: AnyObject | undefined) => {
  if (postData) {
    const formData = new FormData();
    Object.entries(postData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return { method: "POST", body: formData };
  }

  return undefined;
};
