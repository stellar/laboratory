import { Button } from "@stellar/design-system";
import { getNetworkById } from "@/helpers/getNetworkById";
import { useStore } from "@/store/useStore";
import { NetworkType } from "@/types/types";
import { capitalizeString } from "@/helpers/capitalizeString";

export const SwitchNetworkButtons = ({
  includedNetworks,
  buttonSize,
}: {
  includedNetworks: NetworkType[];
  buttonSize: "sm" | "md" | "lg";
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
          }}
        >
          {`Switch to ${capitalizeString(n)}`}
        </Button>
      ))}
    </>
  );
};
