"use client";

import { Routes } from "@/constants/routes";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { Loader } from "@stellar/design-system";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CliSignTransaction() {
  const { network, updateIsDynamicNetworkSelect, transaction, selectNetwork } =
    useStore();
  const { sign } = transaction;
  const searchParams = useSearchParams();

  const getNetworkByPassphrase = (passphrase: string) => {
    return NetworkOptions.find((network) => network.passphrase === passphrase);
  };
  const router = useRouter();

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

    router.push(Routes.SIGN_TRANSACTION);
  }, [sign.importXdr, network, router, searchParams, updateIsDynamicNetworkSelect, selectNetwork, transaction]);

  return <Loader />;
}
