import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { AnyObject, EmptyObj, Network } from "@/types/types";

export interface Store {
  // Shared
  network: Network | EmptyObj;
  // eslint-disable-next-line no-unused-vars
  selectNetwork: (network: Network) => void;
  resetStoredData: () => void;

  // Account
  account: {
    publicKey: string;
    // eslint-disable-next-line no-unused-vars
    update: (value: string) => void;
    reset: () => void;
  };

  // Explore Endpoints
  exploreEndpoints: {
    network: Network | EmptyObj;
    currentEndpoint: string | undefined;
    params: AnyObject;
    // eslint-disable-next-line no-unused-vars
    updateNetwork: (network: Network) => void;
    // eslint-disable-next-line no-unused-vars
    updateCurrentEndpoint: (endpoint: string) => void;
    // eslint-disable-next-line no-unused-vars
    updateParams: (params: AnyObject) => void;
    resetParams: () => void;
    reset: () => void;
  };
}

interface CreateStoreOptions {
  url?: string;
}

// Initial states
const initExploreEndpointState = {
  network: {},
  currentEndpoint: undefined,
  params: {},
};

// Store
export const createStore = (options: CreateStoreOptions) =>
  create<Store>()(
    // https://github.com/nitedani/zustand-querystring
    querystring(
      immer((set) => ({
        // Shared
        network: {},
        selectNetwork: (network: Network) =>
          set((state) => {
            state.network = network;
          }),
        resetStoredData: () =>
          set((state) => {
            // Add stores that need global reset
            state.exploreEndpoints = {
              ...state.exploreEndpoints,
              ...initExploreEndpointState,
            };
          }),
        // Account
        account: {
          publicKey: "",
          update: (value: string) =>
            set((state) => {
              state.account.publicKey = value;
            }),
          reset: () =>
            set((state) => {
              state.account.publicKey = "";
            }),
        },
        // Explore Endpoints
        exploreEndpoints: {
          ...initExploreEndpointState,
          updateNetwork: (network: Network) =>
            set((state) => {
              state.exploreEndpoints.network = network;
            }),
          updateCurrentEndpoint: (endpoint: string) =>
            set((state) => {
              state.exploreEndpoints.currentEndpoint = endpoint;
            }),
          updateParams: (params: AnyObject) =>
            set((state) => {
              state.exploreEndpoints.params = sanitizeObject({
                ...state.exploreEndpoints.params,
                ...params,
              });
            }),
          resetParams: () =>
            set((state) => {
              state.exploreEndpoints.params = {};
            }),
          reset: () =>
            set((state) => {
              state.exploreEndpoints = {
                ...state.exploreEndpoints,
                ...initExploreEndpointState,
              };
            }),
        },
      })),
      {
        url: options.url,
        // Select what to save in query string
        select() {
          return {
            network: true,
            account: false,
            exploreEndpoints: {
              params: true,
              isStreaming: true,
            },
          };
        },
        key: "||",
      },
    ),
  );
