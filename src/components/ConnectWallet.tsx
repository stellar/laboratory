import { useContext, useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
  FREIGHTER_ID,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

import { WalletKitContext } from "@/components/WalletKitContextProvider";
import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";

export const ConnectWallet = () => {
  const { network, setWalletKit, setWalletKitAddress } = useStore();
  const networkType = getWalletKitNetwork(network.id);

  const walletKitInstance = useContext(WalletKitContext);

  console.log("walletKitInstance: ", walletKitInstance.walletKit);

  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const [isStellarWalletInit, setIsStellarWalletInit] =
    useState<boolean>(false);

  // const kit: StellarWalletsKit = new StellarWalletsKit({
  //   network: networkType,
  //   selectedWalletId: XBULL_ID,
  //   modules: allowAllModules(),
  // });

  // console.log("kit: ", kit);
  // console.log("kit: ", kit.getAddress());
  // useEffect(() => {
  //   setWalletKit(kit);
  // }, []);

  const createWalletKitButton = async () => {
    await walletKitInstance.walletKit?.createButton({
      container: responseSuccessEl.current!,
      onConnect: ({ address }) => {
        setWalletKitAddress(address);
        console.log("onConnect");
      },
      onDisconnect: () => {
        setWalletKit(null);
        setWalletKitAddress(undefined);
        console.log("onDisconnect");
        // Do something when the user "disconnects" the wallet, like clearing all site data and reload
      },
    });
  };

  useEffect(() => {
    const initButton = async () => {
      await createWalletKitButton();
    };

    if (!isStellarWalletInit && walletKitInstance.walletKit) {
      setIsStellarWalletInit(true);
      initButton();
    }
  }, [isStellarWalletInit, walletKitInstance.walletKit]);

  return <div className="ConnectWallet" ref={responseSuccessEl}></div>;
};
