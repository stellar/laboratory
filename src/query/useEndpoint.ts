import { useQuery } from "@tanstack/react-query";
import { AnyObject } from "@/types/types";

export const useEndpoint = (requestUrl: string, postData?: AnyObject) => {
  const query = useQuery({
    queryKey: ["endpoint", "response", postData],
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
  let newProps = {};

  if (postData) {
    if (postData.jsonrpc) {
      // https://developers.stellar.org/docs/data/rpc
      newProps = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      };
    } else {
      const formData = new FormData();

      Object.entries(postData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      newProps = {
        body: formData,
      };
    }

    return {
      method: "POST",
      ...newProps,
    };
  }

  return undefined;
};
