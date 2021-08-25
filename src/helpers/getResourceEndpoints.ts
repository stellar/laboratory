import { endpointsMap } from "data/endpoints";

export const getResourceEndpoints = (resource: string, endpoint: string) => {
  let res = endpointsMap[resource];

  if (!res) {
    return;
  }

  return res.endpoints[endpoint];
};
