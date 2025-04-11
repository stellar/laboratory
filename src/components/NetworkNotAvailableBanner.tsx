import { useLayoutEffect, useState } from "react";
import { Banner } from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import { useHorizonHealthCheckUntilReady } from "@/query/useHorizonHealthCheckUntilReady";
import { useRpcHealthCheckUntilReady } from "@/query/useRpcHealthCheckUntilReady";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

export const NetworkNotAvailableBanner = () => {
  const { network } = useStore();
  const [isDelay, setIsDelay] = useState(true);

  const {
    error: horizonError,
    isLoading: isHorizonLoading,
    isFetching: isHorizonFetching,
  } = useHorizonHealthCheckUntilReady(
    network.horizonUrl,
    getNetworkHeaders(network, "horizon"),
  );

  const {
    error: rpcError,
    isLoading: isRpcLoading,
    isFetching: isRpcFetching,
  } = useRpcHealthCheckUntilReady(
    network.rpcUrl,
    getNetworkHeaders(network, "rpc"),
  );

  useLayoutEffect(() => {
    // Adding slight delay to avoid banner flicker when the status check is fast
    const t = setTimeout(() => {
      setIsDelay(false);
      clearTimeout(t);
    }, 3000);

    return () => {
      clearTimeout(t);
    };
  }, []);

  const isHorizonInProgress = isHorizonFetching || isHorizonLoading;
  const isRpcInProgress = isRpcFetching || isRpcLoading;

  const getMessage = () => {
    let msg = "";

    if (isHorizonInProgress && isRpcInProgress) {
      msg = "Horizon and RPC networks are";
    }

    if (isHorizonInProgress) {
      msg = "Horizon network is";
    }

    if (isRpcInProgress) {
      msg = "RPC network is";
    }

    if (msg) {
      return `${msg} still ingesting data, which can take several minutes. Until this process completes, network requests will fail.`;
    }

    return null;
  };

  if (isDelay) {
    return null;
  }

  const message = getMessage();

  if (horizonError || rpcError) {
    return (
      <Banner variant="error">
        {horizonError?.toString()}
        {rpcError?.toString()}
      </Banner>
    );
  }

  if (message) {
    return <Banner variant="warning">{message}</Banner>;
  }

  return null;
};
