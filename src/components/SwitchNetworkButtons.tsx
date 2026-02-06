import { Button } from "@stellar/design-system";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
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
  const { getAndSetNetwork } = useSwitchNetwork();

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
          {`Switch to ${n}`}
        </Button>
      ))}
    </>
  );
};
