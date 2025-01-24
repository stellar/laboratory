import { NetworkType } from "@/types/types";

export const getStellarExpertNetwork = (networkId: NetworkType) => {
  if (["futurenet", "custom"].includes(networkId)) {
    return null;
  }

  return networkId === "mainnet" ? "public" : "testnet";
};
