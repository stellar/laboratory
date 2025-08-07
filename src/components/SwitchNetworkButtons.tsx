import { Button } from "@stellar/design-system";
import { capitalizeString } from "@/helpers/capitalizeString";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { NetworkType } from "@/types/types";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";

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
          {`Switch to ${capitalizeString(n)}`}
        </Button>
      ))}
    </>
  );
};
