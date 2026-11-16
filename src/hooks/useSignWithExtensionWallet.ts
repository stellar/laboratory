import { useContext, useRef, useState } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";
import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { useStore } from "@/store/useStore";

export const useSignWithExtensionWallet = () => {
  const { network, walletKit, updateWalletKit } = useStore();
  const walletKitInstance = useContext(WalletKitContext);
  const isInProgress = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sign only on an explicit user action. Store updates (including switching
  // accounts in the chooser) must not trigger another signing request.
  const signTx = async (txXdr: string, chooseWallet = false) => {
    if (isInProgress.current || !walletKitInstance.isInitialized) {
      return null;
    }

    isInProgress.current = true;
    setIsLoading(true);

    try {
      let address = walletKit?.publicKey;
      if (chooseWallet || !address) {
        await walletKitInstance.ensureWalletConnect();
        ({ address } = await StellarWalletsKit.authModal());
        if (address) {
          updateWalletKit({ publicKey: address });
        }
      }

      if (!address) {
        return null;
      }

      const result = await StellarWalletsKit.signTransaction(txXdr, {
        address,
        networkPassphrase: getWalletKitNetwork(network.id),
      });

      if (!result?.signedTxXdr) {
        throw new Error("Couldn’t sign with wallet, please try again");
      }

      return result.signedTxXdr;
    } catch (error: any) {
      // Kit rejects with code -1 when the user dismisses the modal.
      if (error?.code === -1) {
        return null;
      }
      throw error;
    } finally {
      isInProgress.current = false;
      setIsLoading(false);
    }
  };

  return { signTx, isLoading };
};
