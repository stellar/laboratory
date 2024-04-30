import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import { MemoType } from "@stellar/stellar-sdk";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import {
  AnyObject,
  EmptyObj,
  Network,
  MuxedAccount,
  TxnOperation,
} from "@/types/types";

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
    publicKey: string | undefined;
    secretKey: string | undefined;
    registeredNetwork: Network | EmptyObj;
    generatedMuxedAccountInput: Partial<MuxedAccount> | EmptyObj;
    parsedMuxedAccountInput: string | undefined;
    generatedMuxedAccount: MuxedAccount | EmptyObj;
    parsedMuxedAccount: MuxedAccount | EmptyObj;
    updateKeypair: (publicKey: string, secretKey?: string) => void;
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
      operations: TxnOperation[];
    };
    // TODO: update as needed
    // sign: AnyObject;
    // simulate: AnyObject;
    // submit: AnyObject;
    // feeBump: AnyObject;
    // Transaction actions
    updateBuildActiveTab: (tabId: string) => void;
    updateBuildParams: (params: TransactionBuildParamsObj) => void;
    updateBuildOperations: (operations: TxnOperation[]) => void;
    updateBuildSingleOperation: (
      index: number,
      operation: TxnOperation,
    ) => void;
    resetBuildParams: () => void;
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

const initTransactionParamsState = {
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
};

const initTransactionState = {
  build: {
    activeTab: "params",
    params: initTransactionParamsState,
    operations: [],
  },
};

const initAccountState = {
  publicKey: undefined,
  secretKey: undefined,
  registeredNetwork: {},
  generatedMuxedAccountInput: {},
  parsedMuxedAccountInput: undefined,
  generatedMuxedAccount: {},
  parsedMuxedAccount: {},
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
          ...initAccountState,
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
          updateKeypair: (publicKey: string, secretKey?: string) =>
            set((state) => {
              state.account.publicKey = publicKey;
              state.account.secretKey = secretKey || "";
              state.account.registeredNetwork = state.network;
            }),
          reset: () =>
            set((state) => {
              state.account = { ...state.account, ...initAccountState };
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
          updateBuildOperations: (operations) =>
            set((state) => {
              state.transaction.build.operations = operations;
            }),
          updateBuildSingleOperation: (index, operation) =>
            set((state) => {
              state.transaction.build.operations[index] = operation;
            }),
          resetBuildParams: () =>
            set((state) => {
              state.transaction.build.params = initTransactionParamsState;
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
