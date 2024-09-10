"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";

export default function CliSignTransaction() {
  const { network, updateIsDynamicNetworkSelect, transaction, selectNetwork } =
    useStore();
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
  }, [transaction.sign.importXdr, network.id]);

  return <Loader />;
}
