import { useRedux } from "hooks/useRedux";

const futureNetPassphrase = "Test SDF Future Network ; October 2022";

export const useIsSoroban = () => {
  const { network } = useRedux("network", "routing");
  const { horizonURL, networkPassphrase } = network.current;

  let isOnFuturenet = false;
  if (
    // TODO - use futurenet url
    horizonURL === "https://horizon-testnet.stellar.org" &&
    networkPassphrase === futureNetPassphrase
  ) {
    isOnFuturenet = true;
  }
  return isOnFuturenet;
};
