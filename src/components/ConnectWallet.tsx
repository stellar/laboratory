import { useContext, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

import { WalletKitContext } from "@/components/WalletKitContextProvider";

export const ConnectWallet = () => {
  const { network, account } = useStore();
  const { updateWalletKitPubKey } = account;

  // using Ref because it needs to be called only once
  // on dev, strict mode is calling it twice
  const isStellarWalletInit = useRef(false);
  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const walletKitInstance = useContext(WalletKitContext);

  const createWalletKitButton = async () => {
    await walletKitInstance.walletKit?.createButton({
      container: responseSuccessEl.current!,
      onConnect: ({ address }) => {
        updateWalletKitPubKey(address);
      },
      onDisconnect: () => {
        updateWalletKitPubKey(undefined);
      },
      horizonUrl: network.horizonUrl || "",
    });
  };

  useEffect(() => {
    const initButton = async () => {
      await createWalletKitButton();
    };

    if (!isStellarWalletInit.current) {
      isStellarWalletInit.current = true;
      initButton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="ConnectWallet" ref={responseSuccessEl}></div>;
};
