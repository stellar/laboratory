import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export const useNetworkChanged = (onChange: () => void) => {
  const { network } = useStore();
  const networkIdRef = useRef(network.id);

  useEffect(() => {
    if (networkIdRef.current && networkIdRef.current !== network.id) {
      onChange();
    }
    networkIdRef.current = network.id;
  }, [network.id, onChange]);
};
