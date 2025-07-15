import { Networks } from "@stellar/stellar-sdk";
import { useStore } from "@/store/useStore";

export const useIsTestingNetwork = (): boolean => {
  const { network } = useStore();

  return (
    ["testnet", "futurenet", "custom"].includes(network.id) &&
    network.passphrase !== Networks.PUBLIC
  );
};
