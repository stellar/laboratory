import { stringify } from "zustand-querystring";
import { Routes } from "@/constants/routes";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { AnyObject } from "@/types/types";

export const buildEndpointHref = (
  route: Routes | null,
  params: AnyObject = {},
) => {
  if (!route) {
    return "";
  }

  const SPLIT_CHAR = ";&";
  const END_CHAR = ";;";

  const storeParams = window.location.search
    .replace(END_CHAR, "")
    .split(SPLIT_CHAR)
    .map((i) => {
      // Remove existing Endpoints or XDR params
      if (i.startsWith("endpoints$") || i.startsWith("xdr$")) {
        return "";
      }

      return i;
    });

  // Add XDR params
  if (route.startsWith("/xdr")) {
    storeParams.push(`xdr$${stringify(params)}`);
  }

  // Add Endpoints params
  if (route.startsWith("/endpoints") && !isEmptyObject(params)) {
    storeParams.push(`endpoints$params$${stringify(params)}`);
  }

  return `${route}${sanitizeArray(storeParams).join(SPLIT_CHAR)}${END_CHAR}`;
};
