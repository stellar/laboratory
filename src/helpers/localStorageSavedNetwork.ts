import { LOCAL_STORAGE_SAVED_NETWORK } from "@/constants/settings";
import { Network } from "@/types/types";

export const localStorageSavedNetwork = {
  get: () => {
    const savedNetworkString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_NETWORK,
    );
    return savedNetworkString
      ? (JSON.parse(savedNetworkString) as Network)
      : null;
  },
  set: (network: Network) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_NETWORK,
      JSON.stringify(network),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_NETWORK);
  },
};
