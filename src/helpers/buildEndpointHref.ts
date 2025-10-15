import { stringify, parse } from "zustand-querystring";
import { Routes } from "@/constants/routes";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { Store } from "@/store/createStore";
import { AnyObject } from "@/types/types";

export const buildEndpointHref = (
  route: Routes | null,
  params: AnyObject = {},
) => {
  if (!route) {
    return "";
  }

  const trimmedSearch = window.location.search.substring(3);
  const parsedParams = parse(trimmedSearch) as Store;

  const buildParams = Object.entries(parsedParams).reduce((res, cur) => {
    const [key, value] = cur;

    // Only need to keep network params
    if (key === "network") {
      return { ...res, [key]: value };
    }

    return res;
  }, {} as AnyObject);

  // Endpoints params
  if (route.startsWith("/endpoints") && !isEmptyObject(params)) {
    // Endpoints params need a "params" key
    buildParams["endpoints"] = { params };
  }

  // XDR params
  if (route.startsWith("/xdr")) {
    buildParams["xdr"] = params;
  }

  // Transaction Dashboard params
  if (route.startsWith("/transaction-dashboard")) {
    buildParams["txDashboard"] = params;
  }

  return `${route}?$=${stringify(buildParams)};;`;
};
