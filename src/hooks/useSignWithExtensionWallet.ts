import { useCallback, useContext, useEffect, useState } from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";

import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";
import { getWalletKitNetwork } from "@/helpers/getWalletKitNetwork";
import { useStore } from "@/store/useStore";

export const useSignWithExtensionWallet = ({
  isEnabled,
  isClear,
  txXdr,
}: {
  isEnabled: boolean;
  isClear: boolean;
  txXdr: string | null;
}) => {
  const { network, walletKit, updateWalletKit } = useStore();
  const networkPassphrase = getWalletKitNetwork(network.id);

  const walletKitContext = useContext(WalletKitContext);

  const [signedTxXdr, setSignedTxXdr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isInProgress, setIsInProgress] = useState(false);

  const SUCCESS_MSG = "1 signature added";

  const reset = () => {
    setSignedTxXdr("");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const getErrorMsg = (error: any) => {
    const errorMessage =
      error?.message || error || "Something went wrong, please try again";
    const busyMessage = "is busy";

    // Wallets Kit's Ledger returns a busy message as an error when the device is busy
    // ex: TransportError: Ledger Device is busy (lock signHash)
    // We don't want to show this error to the user
    if (errorMessage.includes(busyMessage)) {
      return "";
    }

    return errorMessage;
  };

  const signTx = useCallback(async () => {
    if (isInProgress || !walletKitContext.isInitialized) {
      return;
    }

    setIsInProgress(true);

    if (walletKit?.publicKey && txXdr) {
      try {
        const result = await StellarWalletsKit.signTransaction(txXdr, {
          address: walletKit.publicKey,
          networkPassphrase,
        });

        setSignedTxXdr(result.signedTxXdr);
        setSuccessMsg(SUCCESS_MSG);
      } catch (error: any) {
        if (error?.message) {
          setErrorMsg(getErrorMsg(error));
        }
      }
    } else {
      // if a user didn't log in via stellar wallet kit in the main nav
      // open a wallet kit modal to sign in
      try {
        const { address } = await StellarWalletsKit.authModal();

        if (address && txXdr) {
          updateWalletKit({ publicKey: address });

          const result = await StellarWalletsKit.signTransaction(txXdr, {
            address,
            networkPassphrase,
          });

          if (result?.signedTxXdr) {
            setSignedTxXdr(result.signedTxXdr);
            setSuccessMsg(SUCCESS_MSG);
          } else {
            throw {
              message: "Couldn't sign with wallet, please try again",
            };
          }
        }
      } catch (error: any) {
        if (error?.message) {
          // Don't show error if user just closed the modal
          if (error.message !== "The user closed the modal.") {
            setErrorMsg(getErrorMsg(error));
          }
        }
      }
    }
  }, [
    isInProgress,
    networkPassphrase,
    txXdr,
    updateWalletKit,
    walletKitContext.isInitialized,
    walletKit,
  ]);

  useEffect(() => {
    if (isEnabled) {
      reset();
      signTx();
    }
  }, [isEnabled, signTx]);

  useEffect(() => {
    reset();
  }, [isClear]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      setIsInProgress(false);
    }
  }, [errorMsg, successMsg]);

  return { signedTxXdr, successMsg, errorMsg };
};
