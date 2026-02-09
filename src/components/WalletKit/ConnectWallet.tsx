"use client";

import { useContext, useEffect, useState } from "react";
import { Button, Modal, Text } from "@stellar/design-system";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { useStore } from "@/store/useStore";

import { useAccountInfo } from "@/query/useAccountInfo";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

import { ConnectedModal } from "@/components/WalletKit/ConnectedModal";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const ConnectWallet = () => {
  const { network, walletKit, updateWalletKit } = useStore();
  const [connected, setConnected] = useState<boolean>(false);
  const [isModalVisible, setShowModal] = useState<boolean>(false);
  const [errorMessageOnConnect, setErrorMessageOnConnect] = useState("");
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] =
    useState<boolean>(false);
  const walletKitContext = useContext(WalletKitContext);
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

    StellarWalletsKit.disconnect();
    setShowModal(false);
    setConnected(false);
    setHasAttemptedAutoConnect(false);
    localStorageSavedWallet.remove();
  };

  useEffect(() => {
    let t: NodeJS.Timeout;

    if (
      !connected &&
      !hasAttemptedAutoConnect &&
      !!savedWallet?.id &&
      ![undefined, "false", "wallet_connect"].includes(savedWallet?.id) &&
      savedWallet.network.id === network.id &&
      walletKitContext.isInitialized
    ) {
      t = setTimeout(async () => {
        try {
          StellarWalletsKit.setWallet(savedWallet.id);
          const success = await handleSetWalletAddress();

          // Only set the flag if connection failed, so we can retry on successful connections
          if (!success) {
            setHasAttemptedAutoConnect(true);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // Set flag on exception as well
          setHasAttemptedAutoConnect(true);
        }
        clearTimeout(t);
      }, 750);
    }

    return () => {
      clearTimeout(t);
    };
    // Not including savedWallet.network.id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedWallet?.id, connected, hasAttemptedAutoConnect, walletKitContext.isInitialized]);

  // Reset auto-connect attempt when network changes
  useEffect(() => {
    setHasAttemptedAutoConnect(false);
  }, [network.id]);

  const handleSetWalletAddress = async (): Promise<boolean> => {
    try {
      const addressResult = await StellarWalletsKit.getAddress();

      if (!addressResult?.address) {
        return false;
      }
      const publicKey = addressResult.address;

      if (!publicKey) {
        return false;
      }

      updateWalletKit({
        publicKey,
        walletType: savedWallet?.id,
      });
      setConnected(true);

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();

      if (!address) {
        const errorMessage = "Unable to load wallet information";
        setErrorMessageOnConnect(errorMessage);
        disconnect();
        return;
      }

      updateWalletKit({
        publicKey: address,
      });
      setConnected(true);

      // Get the selected wallet ID to save
      const wallets = await StellarWalletsKit.refreshSupportedWallets();
      const availableWallet = wallets.find((w) => w.isAvailable);

      if (availableWallet) {
        localStorageSavedWallet.set({
          id: availableWallet.id,
          network: {
            id: network.id,
            label: network.label,
          },
        });

        trackEvent(TrackingEvent.WALLET_KIT_SELECTED, {
          walletType: availableWallet.id,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const errorMessage =
        (e as { message?: string })?.message || "Unknown error occurred";
      // Don't show error if user just closed the modal
      if (errorMessage !== "The user closed the modal.") {
        setErrorMessageOnConnect(errorMessage);
      }
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
