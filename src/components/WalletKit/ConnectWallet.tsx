import { useContext, useState } from "react";
import { Button } from "@stellar/design-system";
import { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useStore } from "@/store/useStore";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { ConnectedModal } from "@/components/WalletKit/ConnectedModal";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { useAccountInfo } from "@/query/useAccountInfo";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

export const ConnectWallet = () => {
  const { account, network } = useStore();
  const { updateWalletKit, walletKit } = account;

  const [isModalVisible, setShowModal] = useState(false);
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
          walletKitInstance.walletKit?.setWallet(option.id);
          const addressResult = await walletKitInstance.walletKit?.getAddress();

          if (addressResult?.address) {
            updateWalletKit({
              publicKey: addressResult.address,
              walletType: option.id,
            });

            trackEvent(TrackingEvent.WALLET_KIT_SELECTED, {
              walletType: option.id,
            });
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
    </Button>
  );
};
