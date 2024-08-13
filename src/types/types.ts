import React from "react";
import { SorobanRpc, xdr } from "@stellar/stellar-sdk";
import { TransactionBuildParams } from "@/store/createStore";

// =============================================================================
// Generic
// =============================================================================
export type AnyObject = { [key: string]: any };
export type EmptyObj = Record<PropertyKey, never>;

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
  rpcUrl: string;
  passphrase: string;
};

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

export type LocalStorageSavedNetwork = {
  id: NetworkType;
  label: string;
  horizonUrl?: string;
  rpcUrl?: string;
  passphrase?: string;
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
  | "liquidity_pool_shares";

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

export type AssetObject = {
  id: AssetType;
  label: string;
  value: AssetObjectValue | AssetPoolShareObjectValue;
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
// Endpoints
// =============================================================================
export type SavedEndpointHorizon = {
  url: string;
  method: string;
  timestamp: number;
  route: string;
  params: AnyObject;
  network: LocalStorageSavedNetwork;
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

export type LedgerErrorResponse = {
  message: string;
  errorCode: number;
};

export type SavedTransaction = {
  timestamp: number;
  network: LocalStorageSavedNetwork;
  params?: TransactionBuildParams;
  operations?: TxnOperation[];
  xdr: string;
  name: string;
  page: SavedTransactionPage;
};

export type SavedTransactionPage = "build" | "sign" | "simulate" | "submit";

export type SubmitRpcResponse = {
  hash: string;
  result: SorobanRpc.Api.GetSuccessfulTransactionResponse;
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
// RPC
// =============================================================================
export type FiltersType = "system" | "contract" | "diagnostic";

export type FiltersObject = {
  type: FiltersType;
  contract_ids: string[];
  topics: string[];
};
