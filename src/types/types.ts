import React from "react";

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

export type AssetObject = {
  id: AssetType;
  label: string;
  value: AssetObjectValue;
};

// =============================================================================
// Transaction
// =============================================================================
export type TimeBoundsValue = {
  min_time: number | string | undefined;
  max_time: number | string | undefined;
};

export type TxnOperation = {
  operationType: string;
  params: AnyObject[];
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
