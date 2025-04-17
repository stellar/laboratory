import { useContext, useState } from "react";
import { Button, Modal, Text } from "@stellar/design-system";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useStore } from "@/store/useStore";

import { useAccountInfo } from "@/query/useAccountInfo";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { ConnectedModal } from "@/components/WalletKit/ConnectedModal";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const ConnectWallet = () => {
  const { account, network } = useStore();
  const { updateWalletKit, walletKit } = account;

  const [isModalVisible, setShowModal] = useState(false);
  const [errorMessageOnConnect, setErrorMessageOnConnect] = useState("");
  const walletKitInstance = useContext(WalletKitContext);

  const { data: accountInfo, refetch: fetchAccountInfo } = useAccountInfo({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network?.horizonUrl || "",
    headers: network ? getNetworkHeaders(network, "horizon") : {},
  });

  const resetWalletKit = () => {
    updateWalletKit({
      publicKey: undefined,
      walletType: undefined,
    });

    setShowModal(false);
  };

  const connectWallet = async () => {
    try {
      await walletKitInstance.walletKit?.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            walletKitInstance.walletKit?.setWallet(option.id);
            const addressResult =
              await walletKitInstance.walletKit?.getAddress();

            if (addressResult?.address) {
              updateWalletKit({
                publicKey: addressResult.address,
                walletType: option.id,
              });

              trackEvent(TrackingEvent.WALLET_KIT_SELECTED, {
                walletType: option.id,
              });
            }
          } catch (e: unknown) {
            // Ledger sends a message with the error code, so we need to check for that
            const errorMessage =
              (e as { message?: string })?.message || "Unknown error occurred";
            setErrorMessageOnConnect(errorMessage);
            resetWalletKit();
          }
        },
      });
    } catch (e) {
      resetWalletKit();
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
        onDisconnect={resetWalletKit}
        balance={`${xlmBalance?.balance} XLM` || "can't load the balance"}
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
