import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import { EmptyObj, Network } from "@/types/types";

export interface Store {
  // Shared
  network: Network | EmptyObj;
  selectNetwork: (network: Network) => void;

  // Account
  account: {
    value: string;
    keypair: {
      publicKey: string;
      secretKey: string;
    };
    update: (value: string) => void;
    updateKeypair: (nestedVal: {
      publicKey: string;
      secretKey: string;
    }) => void;
    reset: () => void;
  };
}

interface CreateStoreOptions {
  url?: string;
}

// Store
export const createStore = (options: CreateStoreOptions) =>
  create<Store>()(
    querystring(
      immer((set) => ({
        network: {},
        selectNetwork: (network: Network) =>
          set((state) => {
            state.network = network;
          }),
        account: {
          value: "",
          keypair: {
            publicKey: "",
            secretKey: "",
          },
          update: (value: string) =>
            set((state) => {
              state.account.value = value;
            }),
          updateKeypair: (nestedVal: {
            publicKey: string;
            secretKey: string;
          }) =>
            set((state) => {
              state.account.keypair = nestedVal;
            }),
          reset: () =>
            set((state) => {
              state.account.value = "";
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
          };
        },
        key: "||",
      },
    ),
  );
