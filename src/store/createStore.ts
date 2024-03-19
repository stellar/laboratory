import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { AnyObject, EmptyObj, Network } from "@/types/types";

export interface Store {
  // Shared
  network: Network | EmptyObj;
  selectNetwork: (network: Network) => void;
  resetStoredData: () => void;

  // Account
  account: {
    value: string;
    nestedObject: {
      nestedValue1: string;
      nestedValue2: number;
    };
    update: (value: string) => void;
    updateNested: (nestedVal: {
      nestedValue1: string;
      nestedValue2: number;
    }) => void;
    reset: () => void;
  };

  // Explore Endpoints
  exploreEndpoints: {
    network: Network | EmptyObj;
    currentEndpoint: string | undefined;
    params: AnyObject;
    isStreaming: boolean;
    updateNetwork: (network: Network) => void;
    updateCurrentEndpoint: (endpoint: string) => void;
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
  isStreaming: false,
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
          value: "",
          nestedObject: {
            nestedValue1: "",
            nestedValue2: 0,
          },
          update: (value: string) =>
            set((state) => {
              state.account.value = value;
            }),
          updateNested: (nestedVal: {
            nestedValue1: string;
            nestedValue2: number;
          }) =>
            set((state) => {
              state.account.nestedObject = nestedVal;
            }),
          reset: () =>
            set((state) => {
              state.account.value = "";
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
            account: true,
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
