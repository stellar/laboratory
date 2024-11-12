import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export const useNetworkChanged = (onChange: () => void) => {
  const { network, previousNetwork } = useStore();

  useEffect(() => {
    if (previousNetwork.id && previousNetwork.id !== network.id) {
      onChange();
    }
  }, [previousNetwork.id, network.id, onChange]);
};
