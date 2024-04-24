import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import { MemoType } from "@stellar/stellar-sdk";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { AnyObject, EmptyObj, Network, MuxedAccount } from "@/types/types";

export type TransactionBuildParams = {
  source_account: string;
  fee: string;
  seq_num: string;
  cond: {
    time: {
      min_time: string;
      max_time: string;
    };
  };
  memo:
    | string
    | {
        [T in Exclude<MemoType, "none">]?: string;
      }
    | EmptyObj;
};

type TransactionBuildParamsObj = {
  [K in keyof TransactionBuildParams]?: TransactionBuildParams[K];
};

export interface Store {
  // Shared
  network: Network | EmptyObj;
  selectNetwork: (network: Network) => void;
  resetStoredData: () => void;

  // Account
  account: {
    publicKey: string;
    generatedMuxedAccountInput: Partial<MuxedAccount> | EmptyObj;
    parsedMuxedAccountInput: string | undefined;
    generatedMuxedAccount: MuxedAccount | EmptyObj;
    parsedMuxedAccount: MuxedAccount | EmptyObj;
    updatePublicKey: (value: string) => void;
    updateGeneratedMuxedAccountInput: (value: Partial<MuxedAccount>) => void;
    updateParsedMuxedAccountInput: (value: string) => void;
    updateGeneratedMuxedAccount: (value: MuxedAccount) => void;
    updateParsedMuxedAccount: (value: MuxedAccount) => void;
    reset: () => void;
  };

  // Endpoints
  endpoints: {
    network: Network | EmptyObj;
    currentEndpoint: string | undefined;
    params: AnyObject;
    updateNetwork: (network: Network) => void;
    updateCurrentEndpoint: (endpoint: string) => void;
    updateParams: (params: AnyObject) => void;
    resetParams: () => void;
    reset: () => void;
  };

  // Transaction
  transaction: {
    build: {
      activeTab: string;
      params: TransactionBuildParams;
      operations: AnyObject[];
    };
    // TODO: update as needed
    // sign: AnyObject;
    // simulate: AnyObject;
    // submit: AnyObject;
    // feeBump: AnyObject;
    // Transaction actions
    updateBuildActiveTab: (tabId: string) => void;
    updateBuildParams: (params: TransactionBuildParamsObj) => void;
    resetBuild: () => void;
  };
}

interface CreateStoreOptions {
  url?: string;
}

// Initial states
const initEndpointState = {
  network: {},
  currentEndpoint: undefined,
  params: {},
};

const initTransactionState = {
  build: {
    activeTab: "params",
    params: {
      source_account: "",
      fee: "",
      seq_num: "",
      cond: {
        time: {
          min_time: "",
          max_time: "",
        },
      },
      memo: {},
    },
    operations: [],
  },
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
            state.endpoints = {
              ...state.endpoints,
              ...initEndpointState,
            };
          }),
        // Account
        account: {
          publicKey: "",
          generatedMuxedAccountInput: {},
          parsedMuxedAccountInput: undefined,
          generatedMuxedAccount: {},
          parsedMuxedAccount: {},
          updateGeneratedMuxedAccountInput: (value: Partial<MuxedAccount>) =>
            set((state) => {
              state.account.generatedMuxedAccountInput = {
                ...state.account.generatedMuxedAccountInput,
                ...value,
              };
            }),
          updateParsedMuxedAccountInput: (value: string) =>
            set((state) => {
              state.account.parsedMuxedAccountInput = value;
            }),
          updateGeneratedMuxedAccount: (value: MuxedAccount) =>
            set((state) => {
              state.account.generatedMuxedAccount = {
                ...state.account.generatedMuxedAccount,
                ...value,
              };
            }),
          updateParsedMuxedAccount: (value: MuxedAccount) =>
            set((state) => {
              state.account.parsedMuxedAccount = {
                ...state.account.parsedMuxedAccount,
                ...value,
              };
            }),
          updatePublicKey: (value: string) =>
            set((state) => {
              state.account.publicKey = value;
            }),
          reset: () =>
            set((state) => {
              state.account.publicKey = "";
            }),
        },
        // Endpoints
        endpoints: {
          ...initEndpointState,
          updateNetwork: (network: Network) =>
            set((state) => {
              state.endpoints.network = network;
            }),
          updateCurrentEndpoint: (endpoint: string) =>
            set((state) => {
              state.endpoints.currentEndpoint = endpoint;
            }),
          updateParams: (params: AnyObject) =>
            set((state) => {
              state.endpoints.params = sanitizeObject({
                ...state.endpoints.params,
                ...params,
              });
            }),
          resetParams: () =>
            set((state) => {
              state.endpoints.params = {};
            }),
          reset: () =>
            set((state) => {
              state.endpoints = {
                ...state.endpoints,
                ...initEndpointState,
              };
            }),
        },
        // Transaction
        transaction: {
          ...initTransactionState,
          updateBuildActiveTab: (tabId: string) =>
            set((state) => {
              state.transaction.build.activeTab = tabId;
            }),
          updateBuildParams: (params: TransactionBuildParamsObj) =>
            set((state) => {
              state.transaction.build.params = {
                ...state.transaction.build.params,
                ...params,
              };
            }),
          resetBuild: () =>
            set((state) => {
              state.transaction.build = initTransactionState.build;
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
            endpoints: {
              params: true,
              isStreaming: true,
            },
            transaction: {
              build: true,
            },
          };
        },
        key: "||",
      },
    ),
  );
