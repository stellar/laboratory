import { useContext, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

import { WalletKitContext } from "@/components/WalletKitContextProvider";

export const ConnectWallet = () => {
  const { network, account } = useStore();
  const { updateWalletKitPubKey } = account;

  // using Ref because it needs to be called only once
  // on dev, strict mode forces it to call it twice which prompts an error modal
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

    if (!walletKitInstance.walletKit?.isButtonCreated()) {
      initButton();
    }

    return () => {
      walletKitInstance.walletKit?.removeButton({ skipDisconnect: true });
    };
  }, []);

  return <div className="ConnectWallet" ref={responseSuccessEl}></div>;
};
