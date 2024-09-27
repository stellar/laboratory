import { NetworkType } from "@/types/types";

import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

export const getWalletKitNetwork = (network: NetworkType) => {
  switch (network) {
    case "testnet":
      return WalletNetwork.TESTNET;
    case "mainnet":
      return WalletNetwork.PUBLIC;
    case "futurenet":
      return WalletNetwork.FUTURENET;
    // @TODO: stellar wallets kit doesn't support CUSTOM
    //   case "custom":
    default:
      return WalletNetwork.TESTNET;
  }
};
