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
  const { updateIsDynamicNetworkSelect, transaction, selectNetwork } =
    useStore();

  const searchParams = useSearchParams();

  const getNetworkByPassphrase = (passphrase: string) => {
    return NetworkOptions.find((network) => network.passphrase === passphrase);
  };

  useEffect(() => {
    const networkPassphrase = searchParams.get("networkPassphrase");
    const xdr = searchParams.get("xdr");

    if (networkPassphrase) {
      const network = getNetworkByPassphrase(networkPassphrase);
      if (network) {
        updateIsDynamicNetworkSelect(true);
        selectNetwork(network);
      }
    }

    if (xdr) {
      transaction.updateSignActiveView("overview");
      transaction.updateSignImportXdr(xdr);
    }
  }, [searchParams, selectNetwork, updateIsDynamicNetworkSelect, transaction]);

  return children;
};
