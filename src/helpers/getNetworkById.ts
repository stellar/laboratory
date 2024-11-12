import { NetworkOptions } from "@/constants/settings";
import { NetworkType } from "@/types/types";

export const getNetworkById = (networkId: NetworkType) => {
  return NetworkOptions.find((op) => op.id === networkId);
};
