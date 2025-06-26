import { useContext, useEffect, useState } from "react";
import { Button, Modal, Text } from "@stellar/design-system";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useStore } from "@/store/useStore";

import { useAccountInfo } from "@/query/useAccountInfo";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { ConnectedModal } from "@/components/WalletKit/ConnectedModal";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

export const ConnectWallet = () => {
  const { network, walletKit, updateWalletKit } = useStore();
  const [connected, setConnected] = useState<boolean>(false);
  const [isModalVisible, setShowModal] = useState(false);
  const [errorMessageOnConnect, setErrorMessageOnConnect] = useState("");
  const walletKitInstance = useContext(WalletKitContext);
  const savedWallet = localStorageSavedWallet.get();

  const { data: accountInfo, refetch: fetchAccountInfo } = useAccountInfo({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network?.horizonUrl || "",
    headers: network ? getNetworkHeaders(network, "horizon") : {},
  });

  const disconnect = () => {
    updateWalletKit({
      publicKey: undefined,
      walletType: undefined,
    });

    setShowModal(false);
    setConnected(false);
    localStorageSavedWallet.remove();
  };

  useEffect(() => {
    if (
      !connected &&
      ![undefined, "false", "wallet_connect"].includes(savedWallet?.id)
    ) {
      // timeout ensures chrome has the ability to load extensions
      setTimeout(() => {
        walletKitInstance.walletKit?.setWallet(savedWallet?.id);
        handleSetWalletAddress();
      }, 750);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedWallet?.id, connected]);

  async function handleSetWalletAddress(): Promise<boolean> {
    try {
      const addressResult = await walletKitInstance.walletKit?.getAddress();

      if (!addressResult?.address) {
        return false;
      }
      const publicKey = addressResult.address;

      if (publicKey === "" || publicKey == undefined) {
        return false;
      }

      updateWalletKit({
        publicKey,
        walletType: savedWallet?.id,
      });
      setConnected(true);

      return true;
    } catch (e: any) {
      console.error("Unable to load wallet information: ", e);
      return false;
    }
  }

  const connectWallet = async () => {
    try {
      await walletKitInstance.walletKit?.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          walletKitInstance.walletKit?.setWallet(option.id);
          const isWalletConnected = await handleSetWalletAddress();

          if (!isWalletConnected) {
            const errorMessage = "Unable to load wallet information";
            setErrorMessageOnConnect(errorMessage);
            disconnect();
            return;
          }

          localStorageSavedWallet.set({
            id: option.id,
            network: {
              id: network.id,
              label: network.label,
            },
          });

          trackEvent(TrackingEvent.WALLET_KIT_SELECTED, {
            walletType: option.id,
          });
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const errorMessage =
        (e as { message?: string })?.message || "Unknown error occurred";
      setErrorMessageOnConnect(errorMessage);
      disconnect();
    }
  };

  const renderModal = () => {
    let xlmBalance;

    if (accountInfo?.isFunded) {
      xlmBalance = accountInfo?.details?.balances?.find(
        (b: any) => b.asset_type === "native",
      );
    }

    return (
      <ConnectedModal
        isVisible={isModalVisible}
        showModal={setShowModal}
        publicKey={walletKit?.publicKey || ""}
        onDisconnect={disconnect}
        balance={
          xlmBalance?.balance
            ? `${xlmBalance.balance} XLM`
            : "can't load the balance"
        }
      />
    );
  };

  const renderErrorModal = () => {
    return (
      <Modal
        visible={Boolean(errorMessageOnConnect)}
        onClose={() => setErrorMessageOnConnect("")}
      >
        <Modal.Body>
          <Text size="md" as="div" weight="bold">
            {errorMessageOnConnect}
          </Text>
        </Modal.Body>
      </Modal>
    );
  };

  return walletKit?.publicKey ? (
    <>
      <Button
        size="md"
        variant="secondary"
        onClick={() => {
          fetchAccountInfo();
          setShowModal(true);
        }}
      >
        {shortenStellarAddress(walletKit.publicKey)}
      </Button>

      {renderModal()}
    </>
  ) : (
    <Button size="md" variant="secondary" onClick={connectWallet}>
      Connect Wallet
      {renderErrorModal()}
    </Button>
  );
};
