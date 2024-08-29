"use client";

import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Component to set Network and Xdr if only password is given in query string
export const NetworkByPasswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { updateIsDynamicNetworkSelect, transaction, selectNetwork } = useStore();

  const searchParams = useSearchParams();

  const getNetworkByPassphrase = (passphrase: string) => {
    return NetworkOptions.find((network) => network.passphrase === passphrase);
  };

  useEffect(() => {
    let networkPassphrase = searchParams.get("networkPassphrase");
    if (networkPassphrase) {
      let network = getNetworkByPassphrase(networkPassphrase);
      if (network) {
        updateIsDynamicNetworkSelect(true);
        selectNetwork(network);
      }
    }

    let xdr = searchParams.get("xdr");
    if (xdr) {
      transaction.updateSignActiveView("overview");
      transaction.updateSignImportXdr(xdr);
    }
  }, [searchParams, selectNetwork, updateIsDynamicNetworkSelect, transaction]);

  return children;
};
