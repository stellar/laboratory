import React from "react";
import { NetworkError, rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { TransactionBuildParams } from "@/store/createStore";

// =============================================================================
// Generic
// =============================================================================
export type AnyObject = { [key: string]: any };
export type EmptyObj = Record<PropertyKey, never>;
export type ThemeColorType = "sds-theme-dark" | "sds-theme-light";
export type LabSettings = Record<string, string>;

// =============================================================================
// Helpers
// =============================================================================
// Key union type from object keys
export type KeysOfUnion<T> = T extends infer P ? keyof P : never;

// =============================================================================
// Network
// =============================================================================
export type NetworkType = "testnet" | "mainnet" | "futurenet" | "custom";

export type Network = {
  id: NetworkType;
  label: string;
  horizonUrl: string;
  horizonHeaderName?: string;
  horizonHeaderValue?: string;
  rpcUrl: string;
  rpcHeaderName?: string;
  rpcHeaderValue?: string;
  passphrase: string;
};

export type NetworkHeaders = Record<string, string>;

export type StatusPageComponent = {
  [key: string]: any;
  id: string;
  name: string;
};

export type StatusPageIncident = {
  [key: string]: any;
  id: string;
  name: string;
  body: string;
};

export type StatusPageScheduled = {
  [key: string]: any;
  id: string;
  name: string;
  scheduled_for: string;
  components: StatusPageComponent[];
  incident_updates: StatusPageIncident[];
};

// =============================================================================
// Account
// =============================================================================
export type MuxedAccount = {
  id: string | undefined;
  baseAddress: string | undefined;
  muxedAddress: string | undefined;
};

export type MuxedAccountFieldType = MuxedAccount & {
  error: string;
};

// =============================================================================
// Asset
// =============================================================================
export type AssetType =
  | "native"
  | "issued"
  | "credit_alphanum4"
  | "credit_alphanum12"
  | "liquidity_pool_shares"
  | "pool_share";

export type AssetString = {
  id: AssetType;
  label: string;
  value: string | undefined;
};

export type AssetObjectValue = {
  type: AssetType | undefined;
  code: string;
  issuer: string;
};

export type AssetPoolShareObjectValue = {
  type: AssetType | undefined;
  asset_a: AssetObjectValue;
  asset_b: AssetObjectValue;
  fee: string;
};

export type AssetSinglePoolShareValue = {
  type: "pool_share";
  pool_share: string | undefined;
};

export type AssetObject = {
  id: AssetType;
  label: string;
  value:
    | AssetObjectValue
    | AssetPoolShareObjectValue
    | AssetSinglePoolShareValue;
};

export type AssetError = {
  code?: string;
  issuer?: string;
};

export type AssetPoolShareError = {
  asset_a?: AssetError;
  asset_b?: AssetError;
};

// =============================================================================
// Transaction
// =============================================================================
export type TimeBoundsValue = {
  min_time: number | string | undefined;
  max_time: number | string | undefined;
};

export type TxnOperation = {
  operation_type: string;
  params: AnyObject;
  source_account?: string;
};

export type OperationError = {
  operationType: string;
  error: { [key: string]: string };
  missingFields: string[];
  customMessage: string[];
};

export type OpBuildingError = { label?: string; errorList?: string[] };

export type LedgerErrorResponse = {
  message: string;
  errorCode: number;
};

export type SubmitRpcResponse = {
  hash: string;
  result: StellarRpc.Api.GetSuccessfulTransactionResponse;
  operationCount: number;
  fee: string;
};

export type SubmitRpcErrorStatus =
  | "TIMEOUT"
  | "FAILED"
  | "DUPLICATE"
  | "TRY_AGAIN_LATER"
  | "ERROR";

export type SubmitRpcError = {
  status: SubmitRpcErrorStatus;
  result: {
    status: SubmitRpcErrorStatus;
    latestLedger: number;
    latestLedgerCloseTime: number;
    hash?: string;
    ledger?: number;
    createdAt?: number;
    applicationOrder?: number;
    feeBump?: boolean;
    envelopeXdr?: xdr.TransactionEnvelope;
    resultXdr?: xdr.TransactionResult;
    resultMetaXdr?: xdr.TransactionMeta;
    errorResult?: xdr.TransactionResult;
    diagnosticEvents?: xdr.DiagnosticEvent[];
  };
};

export type SubmitHorizonError = NetworkError & {
  response: {
    data?: {
      extras?: {
        result_codes?: string;
        result_xdr?: string;
      };
    };
  };
};

// =============================================================================
// Component
// =============================================================================
export type InfoCard = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonIcon?: React.ReactNode;
  buttonAction: () => void;
};

// =============================================================================
// Operations
// =============================================================================
export type OptionFlag = {
  id: string;
  label: string;
  value: number;
};

export type OptionSigner = {
  type: string;
  key: string | undefined;
  weight: string | undefined;
};

export type NumberFractionValue = {
  type: string | undefined;
  value: string | FractionValue | undefined;
};

export type FractionValue = {
  n: string | undefined;
  d: string | undefined;
};

export type RevokeSponsorshipValue = {
  type: SponsorshipType | string;
  data: AnyObject;
};

export type SponsorshipType =
  | "account"
  | "trustline"
  | "offer"
  | "data"
  | "claimable_balance"
  | "signer";

// =============================================================================
// Soroban Operations
// =============================================================================
export type SorobanOpType = "extend_footprint_ttl" | "invoke_contract_function";

export type SorobanInvokeValue = {
  contract_id: string;
  function_name: string;
  args: AnyObject;
  scValsXdr?: string[];
};

// =============================================================================
// RPC
// =============================================================================
export type FiltersType = "system" | "contract" | "diagnostic";

export type FiltersObject = {
  type: FiltersType;
  contract_ids: string[];
  topics: string[];
};

export type XdrType = "TransactionEnvelope" | "LedgerKey" | "ScVal";

export type LedgerKeyType =
  | "account"
  | "trustline"
  | "offer"
  | "data"
  | "claimable_balance"
  | "liquidity_pool"
  | "contract_data"
  | "contract_code"
  | "config_setting"
  | "ttl";

export type LedgerKeyEntryTypeProps =
  | "accountID"
  | "asset"
  | "sellerID"
  | "offerID"
  | "dataName"
  | "balanceID"
  | "liquidityPoolID"
  | "contract"
  | "key"
  | "durability"
  | "hash"
  | "configSettingID"
  | "keyHash";

export type LedgerKeyFieldsType = {
  id: LedgerKeyType;
  label: string;
  templates: string;
  custom?: AnyObject;
};

export type ConfigSettingIdType =
  | "contract_max_size_bytes"
  | "contract_compute_v0"
  | "contract_ledger_cost_v0"
  | "contract_historical_data_v0"
  | "contract_events_v0"
  | "contract_bandwidth_v0"
  | "contract_cost_params_cpu_instructions"
  | "contract_cost_params_memory_bytes"
  | "contract_data_key_size_bytes"
  | "contract_data_entry_size_bytes"
  | "state_archival"
  | "contract_execution_lanes"
  | "bucketlist_size_window"
  | "eviction_iterator";

// =============================================================================
// Local storage items
// =============================================================================
export type LocalStorageSavedNetwork = {
  id: NetworkType;
  label: string;
  horizonUrl?: string;
  rpcUrl?: string;
  passphrase?: string;
};

export interface LocalStorageSavedItem {
  timestamp: number;
  network: LocalStorageSavedNetwork;
  name: string;
}

export interface SavedKeypair extends LocalStorageSavedItem {
  publicKey: string;
  secretKey: string;
}

export interface SavedTransaction extends LocalStorageSavedItem {
  params?: TransactionBuildParams;
  operations?: TxnOperation[];
  xdr: string;
  page: SavedTransactionPage;
  shareableUrl: string | undefined;
}

export type SavedTransactionPage = "build" | "sign" | "simulate" | "submit";

export interface SavedEndpointHorizon extends LocalStorageSavedItem {
  url: string;
  method: string;
  route: string;
  params: AnyObject;
  shareableUrl: string | undefined;
}

export interface SavedRpcMethod extends LocalStorageSavedItem {
  url: string;
  method: string;
  rpcMethod: string;
  route: string;
  params: AnyObject;
  shareableUrl: string | undefined;
  payload: AnyObject;
}

// =============================================================================
// Smart Contract Explorer
// =============================================================================
export type ContractInfoApiResponse = {
  contract: string;
  created: number;
  creator: string;
  account?: string;
  payments?: number;
  trades?: number;
  wasm?: string;
  storage_entries?: number;
  validation?: {
    status?: "verified" | "unverified";
    repository?: string;
    commit?: string;
    package?: string;
    make?: string;
    ts?: number;
  };
  versions?: number;
  salt?: string;
  asset?: string;
  code?: string;
  issuer?: string;
  functions?: {
    invocations: number;
    subinvocations: number;
    function: string;
  }[];
};

export type ContractVersionHistoryResponseItem = {
  operation: string;
  paging_token: string;
  ts: number;
  wasm: string;
};

export type ContractStorageDurability = "instance" | "persistent" | "temporary";

export type ContractStorageResponseItem = {
  durability: ContractStorageDurability;
  key: string;
  paging_token: string;
  ttl: number;
  updated: number;
  value: any;
  expired?: boolean;
};

export type ContractStorageProcessedItem<T> = T & {
  keyJson?: AnyObject | null;
  valueJson?: AnyObject | null;
};

// =============================================================================
// Data table
// =============================================================================
export type SortDirection = "default" | "asc" | "desc";

export type DataTableHeader = {
  id: string;
  value: string;
  isSortable?: boolean;
  filter?: string[];
};

export type DataTableCell = {
  value: React.ReactNode;
  isBold?: boolean;
};
