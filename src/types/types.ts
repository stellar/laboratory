export type EmptyObj = Record<PropertyKey, never>;

export type NetworkType = "testnet" | "mainnet" | "futurenet" | "custom";

export type Network = {
  id: NetworkType;
  label: string;
  url: string;
  passphrase: string;
};
