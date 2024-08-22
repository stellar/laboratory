import { useStore } from "@/store/useStore";

export const useIsTestingNetwork = (): boolean => {
  const { network } = useStore();

  return network.id === "testnet" || network.id === "futurenet";
};
