import { useQuery } from "@tanstack/react-query";
import { sanitizeUrl } from "@/helpers/sanitizeUrl";
import { AnyObject, NetworkHeaders } from "@/types/types";

export const useEndpoint = ({
  requestUrl,
  postData,
  headers,
}: {
  requestUrl: string;
  postData?: AnyObject;
  headers: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["endpoint", "response", postData],
    queryFn: async () => {
      const endpointResponse = await fetch(sanitizeUrl(requestUrl), {
        headers,
        ...getPostOptions(postData, headers),
      });

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

const getPostOptions = (
  postData: AnyObject | undefined,
  headers: NetworkHeaders,
) => {
  let newProps = {};

  if (postData) {
    if (postData.jsonrpc) {
      // https://developers.stellar.org/docs/data/rpc
      newProps = {
        headers: { "Content-Type": "application/json", ...headers },
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
