import { getResourceEndpoints } from "helpers/getResourceEndpoints";

export const getEndpointTemplate = (resource: string, endpoint: string) => {
  let ep = getResourceEndpoints(resource, endpoint);

  if (!ep) {
    return;
  }

  return ep.path;
};
