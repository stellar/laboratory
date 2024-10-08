import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { querystring } from "zustand-querystring";
import {
  MemoType,
  FeeBumpTransaction,
  Transaction,
  xdr,
} from "@stellar/stellar-sdk";

import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import {
  AnyObject,
  EmptyObj,
  Network,
  MuxedAccount,
  TxnOperation,
  OpBuildingError,
  ThemeColorType,
} from "@/types/types";

export type FeeBumpParams = {
  source_account: string;
  fee: string;
  xdr: string;
};

type FeeBumpParamsObj = {
  [K in keyof FeeBumpParams]?: FeeBumpParams[K];
};

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [T in Exclude<MemoType, "none">]?: string;
      }
    | EmptyObj;
};

type TransactionBuildParamsObj = {
  [K in keyof TransactionBuildParams]?: TransactionBuildParams[K];
};

export type SignTxActiveView = "import" | "overview";

export interface Store {
  // Shared
  network: Network | EmptyObj;
  // Theme Color
  theme: ThemeColorType | undefined;
  // isDynamicNetworkSelect flag to indicate network update outside of the dropdown
  isDynamicNetworkSelect: boolean;
  selectNetwork: (network: Network) => void;
  // updateIsDynamicNetworkSelect:
  //   set to true when updating outside of the network dropdown;
  //   set to false when changing network from the dropdown, no need to clear it
  //     in other places because it will stay for the session (not saved in URL)
  updateIsDynamicNetworkSelect: (isDynamic: boolean) => void;
  setTheme: (theme: ThemeColorType) => void;
  resetStoredData: () => void;

  // Account
  account: {
    publicKey: string | undefined;
    secretKey: string | undefined;
    walletKitPubKey: string | undefined;
    generatedMuxedAccountInput: Partial<MuxedAccount> | EmptyObj;
    parsedMuxedAccountInput: string | undefined;
    generatedMuxedAccount: MuxedAccount | EmptyObj;
    parsedMuxedAccount: MuxedAccount | EmptyObj;
    updateKeypair: (publicKey: string, secretKey?: string) => void;
    updateGeneratedMuxedAccountInput: (value: Partial<MuxedAccount>) => void;
    updateParsedMuxedAccountInput: (value: string) => void;
    updateGeneratedMuxedAccount: (value: MuxedAccount) => void;
    updateParsedMuxedAccount: (value: MuxedAccount) => void;
    updateWalletKitPubKey: (value?: string) => void;
    reset: () => void;
  };

  // Endpoints
  endpoints: {
    network: Network | EmptyObj;
    currentEndpoint: string | undefined;
    params: AnyObject;
    saved: {
      activeTab: string;
    };
    updateNetwork: (network: Network) => void;
    updateCurrentEndpoint: (endpoint: string) => void;
    updateParams: (params: AnyObject) => void;
    updateSavedActiveTab: (tabId: string) => void;
    setParams: (params: AnyObject) => void;
    resetParams: () => void;
    reset: () => void;
  };

  // Transaction
  transaction: {
    build: {
      params: TransactionBuildParams;
      operations: TxnOperation[];
      error: {
        params: string[];
        operations: OpBuildingError[];
      };
      xdr: string;
      isValid: {
        params: boolean;
        operations: boolean;
      };
    };
    sign: {
      activeView: SignTxActiveView;
      importTx: FeeBumpTransaction | Transaction | undefined;
      importXdr: string;
      signedTx: string;
      bipPath: string;
      hardWalletSigs: xdr.DecoratedSignature[] | [];
    };
    simulate: {
      instructionLeeway?: string;
      triggerOnLaunch?: boolean;
    };
    feeBump: FeeBumpParams;
    // [Transaction] Build Transaction actions
    updateBuildParams: (params: TransactionBuildParamsObj) => void;
    updateBuildOperations: (operations: TxnOperation[]) => void;
    updateBuildXdr: (xdr: string) => void;
    updateBuildSingleOperation: (
      index: number,
      operation: TxnOperation,
    ) => void;
    updateBuildIsValid: ({
      params,
      operations,
    }: {
      params?: boolean;
      operations?: boolean;
    }) => void;
    setBuildParams: (params: TransactionBuildParamsObj) => void;
    setBuildParamsError: (error: string[]) => void;
    setBuildOperationsError: (error: OpBuildingError[]) => void;
    resetBuildParams: () => void;
    resetBuild: () => void;
    // [Transaction] Sign Transaction actions
    updateSignActiveView: (viewId: SignTxActiveView) => void;
    updateSignImportTx: (tx: FeeBumpTransaction | Transaction) => void;
    updateSignImportXdr: (xdr: string) => void;
    updateSignedTx: (tx: string) => void;
    updateBipPath: (bipPath: string) => void;
    updateHardWalletSigs: (signer: xdr.DecoratedSignature[]) => void;
    resetSign: () => void;
    resetSignHardWalletSigs: () => void;
    updateFeeBumpParams: (params: FeeBumpParamsObj) => void;
    resetBaseFee: () => void;
    // [Transaction] Simulate Transaction actions
    updateSimulateInstructionLeeway: (instrLeeway?: string) => void;
    updateSimulateTriggerOnLaunch: (trigger: boolean) => void;
  };

  // XDR
  xdr: {
    blob: string;
    jsonString: string;
    type: string;
    updateXdrBlob: (blob: string) => void;
    updateJsonString: (jsonString: string) => void;
    updateXdrType: (type: string) => void;
    resetXdr: () => void;
    resetJsonString: () => void;
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
  saved: {
    activeTab: "horizon",
  },
};

const initTransactionParamsState = {
  source_account: "",
  fee: "100",
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
    params: initTransactionParamsState,
    operations: [],
    error: {
      params: [],
      operations: [],
    },
    xdr: "",
    isValid: {
      params: false,
      operations: false,
    },
  },
  sign: {
    activeView: "import" as SignTxActiveView,
    importTx: undefined,
    importXdr: "",
    signedTx: "",
    bipPath: "44'/148'/0'",
    hardWalletSigs: [],
  },
  simulate: {
    instructionLeeway: undefined,
    triggerOnLaunch: undefined,
  },
  feeBump: {
    source_account: "",
    fee: "",
    xdr: "",
  },
};

const initAccountState = {
  publicKey: undefined,
  secretKey: undefined,
  walletKitPubKey: undefined,
  generatedMuxedAccountInput: {},
  parsedMuxedAccountInput: undefined,
  generatedMuxedAccount: {},
  parsedMuxedAccount: {},
};

const initXdrState = {
  blob: "",
  jsonString: "",
  type: XDR_TYPE_TRANSACTION_ENVELOPE,
};

// Store
export const createStore = (options: CreateStoreOptions) =>
  create<Store>()(
    // https://github.com/nitedani/zustand-querystring
    querystring(
      immer((set) => ({
        // Shared
        network: {},
        theme: undefined,
        isDynamicNetworkSelect: false,
        selectNetwork: (network: Network) =>
          set((state) => {
            state.network = network;
          }),
        updateIsDynamicNetworkSelect: (isDynamic: boolean) =>
          set((state) => {
            state.isDynamicNetworkSelect = isDynamic;
          }),
        setTheme: (theme: ThemeColorType) =>
          set((state) => {
            state.theme = theme;
          }),
        resetStoredData: () =>
          set((state) => {
            // Add stores that need global reset
            state.account = { ...state.account, ...initAccountState };
            state.endpoints = {
              ...state.endpoints,
              ...initEndpointState,
            };
            state.transaction = {
              ...state.transaction,
              ...initTransactionState,
            };
            state.xdr = {
              ...state.xdr,
              ...initXdrState,
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
            }),
          updateWalletKitPubKey: (value?: string) =>
            set((state) => {
              state.account.walletKitPubKey = value;
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
          updateSavedActiveTab: (tabId: string) =>
            set((state) => {
              state.endpoints.saved.activeTab = tabId;
            }),
          setParams: (params: AnyObject) =>
            set((state) => {
              state.endpoints.params = params;
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
          updateBuildXdr: (xdr) =>
            set((state) => {
              state.transaction.build.xdr = xdr;
            }),
          updateBuildSingleOperation: (index, operation) =>
            set((state) => {
              state.transaction.build.operations[index] = operation;
            }),
          updateBuildIsValid: ({
            params,
            operations,
          }: {
            params?: boolean;
            operations?: boolean;
          }) =>
            set((state) => {
              if (params !== undefined) {
                state.transaction.build.isValid.params = params;
              }
              if (operations !== undefined) {
                state.transaction.build.isValid.operations = operations;
              }
            }),
          setBuildParams: (params: TransactionBuildParamsObj) =>
            set((state) => {
              state.transaction.build.params = {
                ...initTransactionParamsState,
                ...params,
              };
            }),
          setBuildParamsError: (error: string[]) =>
            set((state) => {
              state.transaction.build.error.params = error;
            }),
          setBuildOperationsError: (error: OpBuildingError[]) =>
            set((state) => {
              state.transaction.build.error.operations = error;
            }),
          resetBuildParams: () =>
            set((state) => {
              state.transaction.build.params = initTransactionParamsState;
            }),
          resetBuild: () =>
            set((state) => {
              state.transaction.build = initTransactionState.build;
            }),
          updateSignActiveView: (viewId: SignTxActiveView) =>
            set((state) => {
              state.transaction.sign.activeView = viewId;
            }),
          updateSignImportTx: (tx: FeeBumpTransaction | Transaction) =>
            set((state) => {
              state.transaction.sign.importTx = tx;
            }),
          updateSignImportXdr: (xdr: string) =>
            set((state) => {
              state.transaction.sign.importXdr = xdr;
            }),
          updateSignedTx: (tx: string) =>
            set((state) => {
              state.transaction.sign.signedTx = tx;
            }),
          updateBipPath: (bipPath: string) =>
            set((state) => {
              state.transaction.sign.bipPath = bipPath;
            }),
          updateHardWalletSigs: (signer: xdr.DecoratedSignature[]) =>
            set((state) => {
              state.transaction.sign.hardWalletSigs = signer;
            }),
          resetSign: () =>
            set((state) => {
              state.transaction.sign = initTransactionState.sign;
            }),
          resetSignHardWalletSigs: () =>
            set((state) => {
              state.transaction.sign.hardWalletSigs =
                initTransactionState.sign.hardWalletSigs;
            }),
          updateSimulateInstructionLeeway: (instrLeeway?: string) =>
            set((state) => {
              state.transaction.simulate.instructionLeeway = instrLeeway;
            }),
          updateSimulateTriggerOnLaunch: (trigger: boolean) =>
            set((state) => {
              state.transaction.simulate.triggerOnLaunch = trigger;
            }),
          updateFeeBumpParams: (params: FeeBumpParamsObj) =>
            set((state) => {
              state.transaction.feeBump = {
                ...state.transaction.feeBump,
                ...params,
              };
            }),
          resetBaseFee: () =>
            set((state) => {
              state.transaction.feeBump = initTransactionState.feeBump;
            }),
        },
        xdr: {
          ...initXdrState,
          updateXdrBlob: (blob: string) =>
            set((state) => {
              state.xdr.blob = blob;
            }),
          updateJsonString: (jsonString: string) =>
            set((state) => {
              state.xdr.jsonString = jsonString;
            }),
          updateXdrType: (type: string) =>
            set((state) => {
              state.xdr.type = type;
            }),
          resetXdr: () =>
            set((state) => {
              state.xdr.blob = initXdrState.blob;
              state.xdr.type = initXdrState.type;
            }),
          resetJsonString: () =>
            set((state) => {
              state.xdr.jsonString = initXdrState.jsonString;
              state.xdr.type = initXdrState.type;
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
              saved: true,
            },
            transaction: {
              build: {
                params: true,
                operations: true,
                error: false,
                isValid: true,
                xdr: false,
              },
              sign: {
                activeView: true,
                importXdr: true,
                bipPath: true,
              },
              simulate: true,
              feeBump: true,
            },
            xdr: {
              blob: true,
              jsonString: true,
              type: true,
            },
          };
        },
      },
    ),
  );
