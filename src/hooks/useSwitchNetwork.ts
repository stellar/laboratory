import { useStore } from "@/store/useStore";
import { getNetworkById } from "@/helpers/getNetworkById";
import { NetworkType } from "@/types/types";

export const useSwitchNetwork = () => {
  const { selectNetwork, updateIsDynamicNetworkSelect } = useStore();

  const getAndSetNetwork = (networkId: NetworkType) => {
    const newNetwork = getNetworkById(networkId);

    if (newNetwork) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(newNetwork);
    }
  };

  return { getAndSetNetwork };
};
