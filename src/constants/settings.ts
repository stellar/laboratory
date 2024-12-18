import { Networks } from "@stellar/stellar-sdk";
import { Network } from "@/types/types";

export const LOCAL_STORAGE_SETTINGS = "stellar_lab_settings";
export const LOCAL_STORAGE_SAVED_NETWORK = "stellar_lab_network";
export const LOCAL_STORAGE_SAVED_ENDPOINTS_HORIZON =
  "stellar_lab_saved_horizon_endpoints";
export const LOCAL_STORAGE_SAVED_RPC_METHODS =
  "stellar_lab_saved_rpc_endpoints";
export const LOCAL_STORAGE_SAVED_TRANSACTIONS =
  "stellar_lab_saved_transactions";
export const LOCAL_STORAGE_SAVED_KEYPAIRS = "stellar_lab_saved_keypairs";
export const LOCAL_STORAGE_SAVED_THEME = "stellarTheme:Laboratory";

export const XDR_TYPE_TRANSACTION_ENVELOPE = "TransactionEnvelope";

export const NetworkOptions: Network[] = [
  {
    id: "futurenet",
    label: "Futurenet",
    horizonUrl: "https://horizon-futurenet.stellar.org",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    passphrase: Networks.FUTURENET,
  },
  {
    id: "testnet",
    label: "Testnet",
    horizonUrl: "https://horizon-testnet.stellar.org",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: Networks.TESTNET,
  },
  {
    id: "mainnet",
    label: "Mainnet",
    horizonUrl: "https://horizon.stellar.org",
    rpcUrl: "",
    passphrase: Networks.PUBLIC,
  },
  {
    id: "custom",
    label: "Custom",
    horizonUrl: "",
    rpcUrl: "",
    passphrase: "",
  },
];

export const OP_SET_TRUST_LINE_FLAGS = "set_trust_line_flags";

export const OPERATION_SET_FLAGS = [
  {
    id: "set-auth-required",
    label: "Authorization required",
    value: 1,
  },
  {
    id: "set-auth-revocable",
    label: "Authorization revocable",
    value: 2,
  },
  {
    id: "set-auth-immutable",
    label: "Authorization immutable",
    value: 4,
  },
  {
    id: "set-auth-clawback",
    label: "Authorization clawback enabled",
    value: 8,
  },
];

export const OPERATION_CLEAR_FLAGS = [
  {
    id: "clear-auth-required",
    label: "Authorization required",
    value: 1,
  },
  {
    id: "clear-auth-revocable",
    label: "Authorization revocable",
    value: 2,
  },
  {
    id: "clear-auth-clawback",
    label: "Authorization clawback enabled",
    value: 8,
  },
];

export const OPERATION_TRUSTLINE_SET_FLAGS = [
  {
    id: "trustline-set-authorized",
    label: "Authorized",
    value: 1,
  },
  {
    id: "trustline-set-liabilites",
    label: "Authorized to maintain liabilites",
    value: 2,
  },
];

export const OPERATION_TRUSTLINE_CLEAR_FLAGS = [
  {
    id: "trustline-clear-authorized",
    label: "Authorized",
    value: 1,
  },
  {
    id: "trustline-clear-liabilites",
    label: "Authorized to maintain liabilites",
    value: 2,
  },
  {
    id: "trustline-clear-clawback",
    label: "Clawback enabled",
    value: 4,
  },
];

export const GITHUB_URL = "https://github.com/stellar/laboratory";
export const STELLAR_EXPERT = "https://stellar.expert/explorer";
export const STELLAR_EXPERT_API = "https://api.stellar.expert/explorer";
