"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { useImportFlowStore } from "@/store/createTransactionFlowStore";
import { delayedAction } from "@/helpers/delayedAction";

/**
 * Deep-link adapter for the Stellar CLI sign flow.
 *
 * The CLI opens `/transaction/cli-sign?xdr=...&networkPassphrase=...`. We
 * select the matching network, hand the XDR off to the import flow store, and
 * redirect to the import page — which parses the envelope and renders the
 * transaction overview.
 */
export default function CliSignTransaction() {
  const { updateIsDynamicNetworkSelect, selectNetwork } = useStore();
  const { setImportXdr } = useImportFlowStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getNetworkByPassphrase = (passphrase: string) =>
    NetworkOptions.find((network) => network.passphrase === passphrase);

  useEffect(() => {
    const networkPassphrase = searchParams?.get("networkPassphrase");
    const xdr = searchParams?.get("xdr");

    if (networkPassphrase) {
      const network = getNetworkByPassphrase(networkPassphrase);
      if (network) {
        updateIsDynamicNetworkSelect(true);
        selectNetwork(network);
      }
    }

    if (xdr) {
      setImportXdr(xdr);
    }

    trackEvent(TrackingEvent.TRANSACTION_CLI_SIGN);

    delayedAction({
      action() {
        router.push(Routes.IMPORT_TRANSACTION);
      },
      delay: 0,
    });

    // Run once for the deep link's search params; the import page owns parsing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <Loader />;
}
