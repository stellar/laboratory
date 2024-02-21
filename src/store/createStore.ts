import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import { EmptyObj } from "@/types/types";

type Network = {
  id: string;
  label: string;
  url: string;
  passphrase: string;
};

export interface Store {
  // Shared
  network: Network | EmptyObj;
  selectNetwork: (network: Network) => void;

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
