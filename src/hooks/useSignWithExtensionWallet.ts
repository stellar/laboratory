import { useCallback, useContext, useEffect, useState } from "react";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";

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
  txXdr: string;
}) => {
  const { network, walletKit, updateWalletKit } = useStore();
  const networkPassphrase = getWalletKitNetwork(network.id);

  const walletKitInstance = useContext(WalletKitContext);

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
    if (isInProgress || !walletKitInstance?.walletKit) {
      return;
    }

    setIsInProgress(true);

    if (walletKit?.publicKey) {
      try {
        const result = await walletKitInstance.walletKit.signTransaction(
          txXdr,
          {
            address: walletKit.publicKey,
            networkPassphrase,
          },
        );

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
      await walletKitInstance.walletKit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            walletKitInstance.walletKit?.setWallet(option.id);
            const addressResult =
              await walletKitInstance.walletKit?.getAddress();

            if (addressResult?.address) {
              updateWalletKit({ publicKey: addressResult.address });

              const result = await walletKitInstance.walletKit?.signTransaction(
                txXdr,
                {
                  // You could send multiple public keys in case the wallet needs to handle multi signatures
                  address: addressResult.address,
                  networkPassphrase,
                },
              );

              if (result?.signedTxXdr) {
                setSignedTxXdr(result.signedTxXdr);
                setSuccessMsg(SUCCESS_MSG);
              } else {
                throw {
                  message: "Couldn’t sign with wallet, please try again",
                };
              }
            }
          } catch (error: any) {
            if (error?.message) {
              setErrorMsg(getErrorMsg(error));
            }
          }
        },
        onClosed: () => {
          setErrorMsg("The user closed the modal.");
        },
      });
    }
  }, [
    isInProgress,
    networkPassphrase,
    txXdr,
    updateWalletKit,
    walletKitInstance.walletKit,
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
