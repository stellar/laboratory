import { LOCAL_STORAGE_SAVED_NETWORKS_PREVIOUS } from "@/constants/settings";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { NetworkType } from "@/types/types";

type SavedPreviousNetworks = Record<
  NetworkType,
  {
    rpcUrl: string;
    horizonUrl: string;
    passphrase?: string;
  }
>;

export const localStorageSavedNetworksPrevious = {
  get: () => {
    const savedNetworksString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_NETWORKS_PREVIOUS,
    );
    return savedNetworksString
      ? (JSON.parse(savedNetworksString) as SavedPreviousNetworks)
      : null;
  },
  set: ({
    networkId,
    rpcUrl,
    horizonUrl,
    passphrase,
  }: {
    networkId: NetworkType;
    rpcUrl: string;
    horizonUrl: string;
    passphrase?: string;
  }) => {
    const currentNetworksString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_NETWORKS_PREVIOUS,
    );

    const currentNetworkObj = currentNetworksString
      ? JSON.parse(currentNetworksString)
      : {};

    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_NETWORKS_PREVIOUS,
      JSON.stringify({
        ...currentNetworkObj,
        [networkId]: sanitizeObject({ rpcUrl, horizonUrl, passphrase }),
      }),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_NETWORKS_PREVIOUS);
  },
};
