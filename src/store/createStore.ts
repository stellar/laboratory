import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import { EmptyObj, Network } from "@/types/types";

export interface Store {
  // Shared
  network: Network | EmptyObj;
  // eslint-disable-next-line no-unused-vars
  selectNetwork: (network: Network) => void;

  // Account
  account: {
    publicKey: string;
    // eslint-disable-next-line no-unused-vars
    update: (value: string) => void;
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
      })),
      {
        url: options.url,
        // Select what to save in query string
        select() {
          return {
            network: true,
            account: false,
          };
        },
        key: "||",
      },
    ),
  );
