import { NetworkType } from "@/types/types";

import { Networks } from "@creit-tech/stellar-wallets-kit/types";

export const getWalletKitNetwork = (network: NetworkType): Networks => {
  switch (network) {
    case "testnet":
      return Networks.TESTNET;
    case "mainnet":
      return Networks.PUBLIC;
    case "futurenet":
      return Networks.FUTURENET;
    // @TODO: stellar wallets kit doesn't support CUSTOM
    //   case "custom":
    default:
      return Networks.TESTNET;
  }
};
