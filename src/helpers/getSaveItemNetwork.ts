import { EmptyObj, Network } from "@/types/types";

export const getSaveItemNetwork = (network: Network | EmptyObj) => {
  return {
    id: network.id,
    label: network.label,
    // Mainnet with custom RPC URL
    ...(network.id === "mainnet" && network.rpcUrl
      ? {
          rpcUrl: network.rpcUrl,
        }
      : {}),
    // Custom network
    ...(network.id === "custom"
      ? {
          horizonUrl: network.horizonUrl,
          rpcUrl: network.rpcUrl,
          passphrase: network.passphrase,
        }
      : {}),
  };
};
