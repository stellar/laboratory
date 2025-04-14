import { Button } from "@stellar/design-system";
import { getNetworkById } from "@/helpers/getNetworkById";
import { capitalizeString } from "@/helpers/capitalizeString";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { NetworkType } from "@/types/types";

export const SwitchNetworkButtons = ({
  includedNetworks,
  buttonSize,
  page,
}: {
  includedNetworks: NetworkType[];
  buttonSize: "sm" | "md" | "lg";
  page: string;
}) => {
  const { selectNetwork, updateIsDynamicNetworkSelect } = useStore();

  const getAndSetNetwork = (networkId: NetworkType) => {
    const newNetwork = getNetworkById(networkId);

    if (newNetwork) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(newNetwork);
    }
  };

  return (
    <>
      {includedNetworks.map((n) => (
        <Button
          key={`switch-${n}`}
          variant="tertiary"
          size={buttonSize}
          onClick={() => {
            getAndSetNetwork(n);
            trackEvent(TrackingEvent.NETWORK_SWITCH, {
              to: n,
              location: `${page} button`,
            });
          }}
        >
          {`Switch to ${capitalizeString(n)}`}
        </Button>
      ))}
    </>
  );
};
