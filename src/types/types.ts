export type EmptyObj = Record<PropertyKey, never>;

export type NetworkType = "testnet" | "mainnet" | "futurenet" | "custom";

export type Network = {
  id: NetworkType;
  label: string;
  horizonUrl: string;
  rpcUrl: string;
  passphrase: string;
};
