"use client";

import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

// Component to set network if only password is given in query string
export const NetworkByPasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const { network, updateIsDynamicNetworkSelect, selectNetwork } = useStore();
  const getNetworkByPassphrase = (passphrase: string) => {
    return NetworkOptions.find((network) => network.passphrase === passphrase);
  };

  useEffect(() => {
      if (network?.passphrase) {
        const tx_network = getNetworkByPassphrase(network.passphrase);
        if (tx_network) {
          updateIsDynamicNetworkSelect(true);
          selectNetwork(tx_network);
        }
      }
  }, [network.passphrase, selectNetwork, updateIsDynamicNetworkSelect]);


  return children;
};
