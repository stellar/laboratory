"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button, Modal, Text } from "@stellar/design-system";
import {
  KitEventType,
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit";
import { useStore } from "@/store/useStore";

import { useAccountInfo } from "@/query/useAccountInfo";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSavedWallet } from "@/helpers/localStorageSavedWallet";

import { ConnectedModal } from "@/components/WalletKit/ConnectedModal";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";
import {
  hasLiveWalletConnectSession,
  WALLET_CONNECT_ID,
} from "@/components/WalletKit/walletConnect";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const ConnectWallet = () => {
  const { network, walletKit, updateWalletKit } = useStore();
  const [connected, setConnected] = useState<boolean>(false);
  const [isModalVisible, setShowModal] = useState<boolean>(false);
  const [errorMessageOnConnect, setErrorMessageOnConnect] = useState("");
  const [isPreparingWallets, setIsPreparingWallets] = useState<boolean>(false);
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] =
    useState<boolean>(false);
  const walletKitInstance = useContext(WalletKitContext);
  const savedWallet = localStorageSavedWallet.get();
  const isSavedWalletConnect = savedWallet?.id === WALLET_CONNECT_ID;

  const { data: accountInfo, refetch: fetchAccountInfo } = useAccountInfo({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network?.horizonUrl || "",
    headers: network ? getNetworkHeaders(network, "horizon") : {},
  });

  const clearWalletState = useCallback(() => {
    updateWalletKit({
      publicKey: undefined,
      walletType: undefined,
    });

    setShowModal(false);
    setConnected(false);
    setHasAttemptedAutoConnect(false);
    localStorageSavedWallet.remove();
  }, [updateWalletKit]);

  // Let the kit tear down its own state too. For WalletConnect this closes the
  // session with the wallet; other wallets have nothing to close.
  const disconnectKit = async () => {
    try {
      await StellarWalletsKit.disconnect();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Clearing Lab's state matters more than a clean wallet-side teardown
    }
  };

  const disconnect = async () => {
    await disconnectKit();
    clearWalletState();
  };

  // The kit can end a session on its own — a WalletConnect session the wallet
  // dropped while Lab was closed surfaces here once the relay reconnects — so
  // mirror that into Lab's state instead of showing a stale connected address.
  useEffect(() => {
    return StellarWalletsKit.on(KitEventType.DISCONNECT, clearWalletState);
  }, [clearWalletState]);

  useEffect(() => {
    let t: NodeJS.Timeout;

    if (
      !connected &&
      !hasAttemptedAutoConnect &&
      !!savedWallet?.id &&
      ![undefined, "false"].includes(savedWallet?.id) &&
      savedWallet.network.id === network.id
    ) {
      t = setTimeout(async () => {
        if (!walletKitInstance.isInitialized) {
          return;
        }

        // WalletConnect isn't registered at startup, so restoring a saved
        // session has to pull in its chunk first.
        if (
          isSavedWalletConnect &&
          !(await walletKitInstance.ensureWalletConnect())
        ) {
          setHasAttemptedAutoConnect(true);
          return;
        }

        try {
          StellarWalletsKit.setWallet(savedWallet.id);
          const success = await handleSetWalletAddress({
            skipRequestAccess: true,
          });

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
  }, [
    savedWallet?.id,
    isSavedWalletConnect,
    connected,
    hasAttemptedAutoConnect,
    walletKitInstance,
  ]);

  // Reset auto-connect attempt when network changes
  useEffect(() => {
    setHasAttemptedAutoConnect(false);
  }, [network.id]);

  // A WalletConnect session is approved for a single chain, and updating
  // `allowedChains` only affects the next pairing — it can't renegotiate a
  // session the wallet already approved. After an in-app mainnet/testnet
  // switch the kit would keep signing over the same topic with the new chain
  // id, which the session never authorized, so signing fails with no
  // explanation. End the session instead and let the user pair again.
  //
  // The ref guard means this only runs on an actual switch, never on mount,
  // where it would tear down a session that was just restored.
  const previousNetworkId = useRef(network.id);

  useEffect(() => {
    if (previousNetworkId.current === network.id) {
      return;
    }

    previousNetworkId.current = network.id;

    if (walletKit?.walletType === WALLET_CONNECT_ID) {
      disconnect();
    }
    // `disconnect` is recreated every render; including it would re-run this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network.id, walletKit?.walletType]);

  const handleSetWalletAddress = async ({
    skipRequestAccess,
  }: {
    skipRequestAccess: boolean;
  }): Promise<boolean> => {
    try {
      // The WalletConnect module ignores `skipRequestAccess` and always starts
      // a fresh pairing, which would pop a QR code modal on every page load.
      // Its session outlives the page though — the kit rehydrates the address
      // and the session topic from localStorage — so read the restored address
      // from the kit rather than asking the module for it.
      const addressResult = isSavedWalletConnect
        ? await StellarWalletsKit.getAddress()
        : await StellarWalletsKit.selectedModule.getAddress({
            skipRequestAccess,
          });

      const publicKey = addressResult?.address;

      if (!publicKey) {
        return false;
      }

      // The cached address survives independently of the session, so confirm
      // the sign client actually restored one that still authorizes this
      // address on this chain. Otherwise Lab would show a connected wallet
      // whose every signing request fails, and the user would have no way to
      // tell why. Clearing the stale state sends them back to a fresh pairing.
      if (
        isSavedWalletConnect &&
        !(await hasLiveWalletConnectSession({
          address: publicKey,
          networkId: network.id,
        }))
      ) {
        await disconnectKit();
        clearWalletState();

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
      // Register WalletConnect before the modal opens: the kit snapshots its
      // wallet list on open, so a module added later wouldn't appear. This
      // fetches a chunk and waits for the sign client, roughly a second, so the
      // button shows a loading state until the modal is ready to open. Only this
      // step is covered — `authModal` then waits on the user scanning a QR code.
      setIsPreparingWallets(true);

      try {
        await walletKitInstance.ensureWalletConnect();
      } finally {
        setIsPreparingWallets(false);
      }

      const { address } = await StellarWalletsKit.authModal();

      if (!address) {
        setErrorMessageOnConnect("No wallet address received");
        return;
      }

      const walletId = StellarWalletsKit.selectedModule.productId;

      updateWalletKit({
        publicKey: address,
        walletType: walletId,
      });
      setConnected(true);

      localStorageSavedWallet.set({
        id: walletId,
        network: {
          id: network.id,
          label: network.label,
        },
      });

      trackEvent(TrackingEvent.WALLET_KIT_SELECTED, {
        walletType: walletId,
      });
    } catch (e) {
      const err = e as { code?: number; message?: string };
      // Kit rejects with code -1 when the user dismisses the modal
      if (err?.code === -1) {
        return;
      }
      setErrorMessageOnConnect(err?.message || "Unknown error occurred");
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
    <Button
      size="md"
      variant="secondary"
      isLoading={isPreparingWallets}
      disabled={isPreparingWallets}
      onClick={connectWallet}
    >
      Connect wallet
      {renderErrorModal()}
    </Button>
  );
};
