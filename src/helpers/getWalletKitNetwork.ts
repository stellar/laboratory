import { Networks } from "@stellar/stellar-sdk";

import { NetworkType } from "@/types/types";

export const getWalletKitNetwork = (network: NetworkType) => {
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
