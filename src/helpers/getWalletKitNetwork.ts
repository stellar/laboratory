import { NetworkType } from "@/types/types";
import type { Networks } from "@creit.tech/stellar-wallets-kit";

const WALLET_KIT_NETWORKS = {
  PUBLIC: "Public Global Stellar Network ; September 2015" as Networks,
  TESTNET: "Test SDF Network ; September 2015" as Networks,
  FUTURENET: "Test SDF Future Network ; October 2022" as Networks,
};

export const getWalletKitNetwork = (network: NetworkType) => {
  switch (network) {
    case "testnet":
      return WALLET_KIT_NETWORKS.TESTNET;
    case "mainnet":
      return WALLET_KIT_NETWORKS.PUBLIC;
    case "futurenet":
      return WALLET_KIT_NETWORKS.FUTURENET;
    // @TODO: stellar wallets kit doesn't support CUSTOM
    //   case "custom":
    default:
      return WALLET_KIT_NETWORKS.TESTNET;
  }
};
