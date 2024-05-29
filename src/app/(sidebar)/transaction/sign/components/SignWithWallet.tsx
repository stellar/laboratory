"use client";

import { Button } from "@stellar/design-system";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

import { useStore } from "@/store/useStore";

import { NetworkType } from "@/types/types";

export const SignWithWallet = () => {
  const kit: StellarWalletsKit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
  });

  const { network, transaction } = useStore();
  const { sign, updateSignedTx } = transaction;

  const getWalletNetwork = (network: NetworkType) => {
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

  const onSignWithWallet = async () => {
    await kit.openModal({
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);
        const publicKey = await kit.getPublicKey();

        const networkType = getWalletNetwork(network.id);

        const { result } = await kit.signTx({
          xdr: sign.importXdr,
          // You could send multiple public keys in case the wallet needs to handle multi signatures
          publicKeys: [publicKey],
          network: networkType,
        });

        updateSignedTx(result);
      },
    });
  };

  return (
    <Button size="md" variant="secondary" onClick={onSignWithWallet}>
      Sign with wallet
    </Button>
  );
};
