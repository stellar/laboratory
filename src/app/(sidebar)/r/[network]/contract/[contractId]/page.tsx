"use client";

import { Loader } from "@stellar/design-system";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Routes } from "@/constants/routes";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { delayedAction } from "@/helpers/delayedAction";

export default function ContractRedirect() {
  const params = useParams<{ network: string; contractId: string }>();
  const { updateIsDynamicNetworkSelect, selectNetwork } = useStore();
  const { smartContracts } = useStore();
  const router = useRouter();

  useEffect(() => {
    const network = NetworkOptions.find(
      (network) => network.id === params.network,
    );

    if (network) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(network);
    }

    smartContracts.updateExplorerContractId(params.contractId);

    delayedAction({
      action() {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.network, params.contractId]);

  return <Loader />;
}
