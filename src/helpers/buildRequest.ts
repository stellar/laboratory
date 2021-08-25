import { each, trim } from "lodash";
import querystring from "querystring";
import { buildRequestUrl } from "helpers/buildRequestUrl";
import { AnyObject, EndpointItemEndpoint, RequestMethod } from "types/types.d";

export const buildRequest = (
  baseUrl: string,
  endpoint: EndpointItemEndpoint | undefined,
  pendingRequest: AnyObject,
) => {
  type BuildRequest = {
    url: string;
    formData: string;
    method?: RequestMethod;
    streaming?: boolean;
  };

  const request: BuildRequest = {
    url: buildRequestUrl(baseUrl, endpoint, pendingRequest.values),
    formData: "",
  };

  if (typeof endpoint !== "undefined") {
    request.method = endpoint.method;
  }

  // Currently, this only supports simple string values
  if (request.method === "POST") {
    const postData: AnyObject = {};

    each(pendingRequest.values, (value, key) => {
      postData[key] = trim(value);
    });

    // TODO: remove querystring package in Tier 3 (deprecated)
    request.formData = querystring.stringify(postData);
  }

  if (pendingRequest.values.streaming) {
    request.streaming = true;
  }

  return request;
};
