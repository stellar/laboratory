import { stringify } from "zustand-querystring";
import { getQueryStringState } from "@/helpers/getQueryStringState";
import { Routes } from "@/constants/routes";
import { AnyObject } from "@/types/types";

export const buildContractExplorerHref = (contractId: string) => {
  const parsedParams = getQueryStringState(window.location.search) || {};

  const buildParams = Object.entries(parsedParams).reduce((res, cur) => {
    const [key, value] = cur;

    // Keep network params
    if (key === "network") {
      return { ...res, [key]: value };
    }

    return res;
  }, {} as AnyObject);

  buildParams["smartContracts"] = {
    explorer: {
      contractId,
    },
  };

  return `${Routes.SMART_CONTRACTS_CONTRACT_EXPLORER}?$=${stringify(buildParams)};;`;
};
