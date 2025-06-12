"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  Input,
  Icon,
  Button,
  Loader,
  Badge,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { arrayItem } from "@/helpers/arrayItem";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getNetworkById } from "@/helpers/getNetworkById";

import { useStore } from "@/store/useStore";
import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";
import { useFriendBot } from "@/query/useFriendBot";
import { useAccountInfo } from "@/query/useAccountInfo";

import { NetworkType, SavedKeypair } from "@/types/types";

export default function SavedKeypairs() {
  const { network, selectNetwork, updateIsDynamicNetworkSelect } = useStore();

  const [savedKeypairs, setSavedKeypairs] = useState<SavedKeypair[]>([]);
  const [currentKeypairTimestamp, setCurrentKeypairTimestamp] = useState<
    number | undefined
  >();

  const IS_TESTING_NETWORK = useIsTestingNetwork();

  const updateSavedKeypairs = useCallback(() => {
    const keypairs = localStorageSavedKeypairs
      .get()
      .filter((s) => s.network.id === network.id);
    setSavedKeypairs(keypairs);
  }, [network.id]);

  useEffect(() => {
    updateSavedKeypairs();
  }, [updateSavedKeypairs]);

  const getAndSetNetwork = (networkId: NetworkType) => {
    const newNetwork = getNetworkById(networkId);

    if (newNetwork) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(newNetwork);
    }
  };

  const renderOtherNetworkMessage = () => {
    if (network.id === "testnet" || network.id === "futurenet") {
      const otherNetworkLabel =
        network.id === "testnet" ? "Futurenet" : "Testnet";

      return (
        <Alert
          variant="primary"
          title={`Looking for ${otherNetworkLabel} keypairs?`}
          placement="inline"
          actionLabel={`Switch to ${otherNetworkLabel}`}
          onAction={() => {
            const newNetworkId =
              network.id === "testnet" ? "futurenet" : "testnet";

            getAndSetNetwork(newNetworkId);
          }}
        >
          {`You must switch your network to ${otherNetworkLabel} in order to see those saved
          keypairs. This feature is only available on Futurenet and Testnet for
          security reasons.`}
        </Alert>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (IS_TESTING_NETWORK) {
      return (
        <Box gap="md">
          <>
            {savedKeypairs.length === 0
              ? `There are no saved keypairs on ${network.label} network.`
              : savedKeypairs.map((kp) => (
                  <SavedKeypairItem
                    key={`saved-kp-${kp.timestamp}`}
                    keypair={kp}
                    setCurrentKeypairTimestamp={setCurrentKeypairTimestamp}
                    onDelete={(keypair) => {
                      const savedKeypairs = localStorageSavedKeypairs.get();
                      const indexToUpdate = savedKeypairs.findIndex(
                        (kp) => kp.timestamp === keypair.timestamp,
                      );

                      if (indexToUpdate >= 0) {
                        const updatedList = arrayItem.delete(
                          savedKeypairs,
                          indexToUpdate,
                        );

                        localStorageSavedKeypairs.set(updatedList);
                        updateSavedKeypairs();
                      }
                    }}
                  />
                ))}
          </>
        </Box>
      );
    }

    return (
      <Box gap="lg">
        <Text as="div" size="sm">
          You must switch your network to Futurenet or Testnet in order to see
          those saved keypairs. This feature is only available on Futurenet and
          Testnet for security reasons.
        </Text>

        <Box gap="sm" direction="row" wrap="wrap">
          <SwitchNetworkButtons
            includedNetworks={["futurenet", "testnet"]}
            buttonSize="md"
            page="saved accounts"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box gap="md">
      <PageCard heading="Saved Keypairs">
        <>
          {IS_TESTING_NETWORK ? (
            <Alert variant="warning" placement="inline">
              Saved keypairs are stored in the browser’s localstorage
              unencrypted and with no protection. Anyone using this browser will
              be able to access the keys and the keys could be easily lost. Do
              not save keys that are intended to hold or control value on
              mainnet. Do not reuse keypairs from futurenet or testnet on
              mainnet for security. For keys that will hold value, please
              consider using a Stellar wallet.
            </Alert>
          ) : null}
        </>

        {renderContent()}
      </PageCard>

      <>{renderOtherNetworkMessage()}</>

      <SaveToLocalStorageModal
        type="editName"
        itemTitle="Keypair"
        itemTimestamp={currentKeypairTimestamp}
        allSavedItems={localStorageSavedKeypairs.get()}
        isVisible={currentKeypairTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentKeypairTimestamp(undefined);

          if (isUpdate) {
            updateSavedKeypairs();
          }
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedKeypairs.set(updatedItems);
        }}
      />
    </Box>
  );
}

const SavedKeypairItem = ({
  keypair,
  setCurrentKeypairTimestamp,
  onDelete,
}: {
  keypair: SavedKeypair;
  setCurrentKeypairTimestamp: (timestamp: number) => void;
  onDelete: (keypair: SavedKeypair) => void;
}) => {
  const network = getNetworkById(keypair.network.id);
  const publicKey = keypair.publicKey;
  const horizonUrl = network?.horizonUrl || "";
  const headers = network ? getNetworkHeaders(network, "horizon") : {};

  const {
    error: friendbotError,
    isFetching: isFriendbotFetching,
    isLoading: isFriendbotLoading,
    isSuccess: isFriendbotSuccess,
    refetch: fundWithFriendbot,
  } = useFriendBot({
    network: network!,
    publicKey: publicKey,
    key: { type: "saved" },
    headers,
  });

  const {
    isFetching: isAccountFetching,
    isLoading: isAccountLoading,
    error: accountError,
    data: accountInfo,
    refetch: fetchAccountInfo,
  } = useAccountInfo({
    publicKey,
    horizonUrl,
    headers,
  });

  useEffect(() => {
    if (publicKey && horizonUrl) {
      fetchAccountInfo();
    }
  }, [publicKey, horizonUrl, fetchAccountInfo]);

  useEffect(() => {
    if (isFriendbotSuccess) {
      fetchAccountInfo();
    }
  }, [fetchAccountInfo, isFriendbotSuccess]);

  const renderAccountData = () => {
    if (
      isAccountFetching ||
      isAccountLoading ||
      isFriendbotFetching ||
      isFriendbotLoading
    ) {
      return <Loader />;
    }

    if (accountError || friendbotError) {
      return (
        <div className="FieldNote FieldNote--error FieldNote--md">
          {accountError?.message || friendbotError?.message}
        </div>
      );
    }

    if (accountInfo && !accountInfo.isFunded) {
      return (
        <Button
          variant="tertiary"
          size="md"
          onClick={() => fundWithFriendbot()}
        >
          Fund with Friendbot
        </Button>
      );
    }

    if (accountInfo?.isFunded) {
      const xlmAsset = accountInfo.details.balances.find(
        (b: any) => b.asset_type === "native",
      );

      if (xlmAsset) {
        return (
          <Badge
            variant="secondary"
            size="md"
          >{`Balance: ${xlmAsset.balance} XLM`}</Badge>
        );
      }
    }

    return null;
  };

  return (
    <Box
      gap="sm"
      addlClassName="PageBody__content"
      data-testid="saved-keypair-item"
    >
      <Input
        id={`saved-kp-${keypair.timestamp}-name`}
        data-testid="saved-keypair-name"
        fieldSize="md"
        value={keypair.name}
        readOnly
        leftElement="Name"
        rightElement={
          <InputSideElement
            variant="button"
            placement="right"
            onClick={() => {
              setCurrentKeypairTimestamp(keypair.timestamp);
            }}
            icon={<Icon.Edit05 />}
          />
        }
      />

      <Input
        id={`saved-kp-${keypair.timestamp}-pk`}
        data-testid="saved-keypair-pk"
        fieldSize="md"
        value={keypair.publicKey}
        readOnly
        leftElement="Public"
        copyButton={{ position: "right" }}
      />

      <Input
        id={`saved-kp-${keypair.timestamp}-sk`}
        data-testid="saved-keypair-sk"
        fieldSize="md"
        value={keypair.secretKey}
        readOnly
        leftElement="Secret"
        copyButton={{ position: "right" }}
        isPassword
      />

      {keypair.recoveryPhrase ? (
        <Input
          id={`saved-kp-${keypair.timestamp}-rp`}
          data-testid="saved-keypair-rp"
          fieldSize="md"
          value={keypair.recoveryPhrase}
          readOnly
          leftElement="Recovery Phrase"
          copyButton={{ position: "right" }}
          isPassword
        />
      ) : null}

      <Box
        gap="lg"
        direction="row"
        align="center"
        justify="space-between"
        addlClassName="Endpoints__urlBar__footer"
      >
        <Box gap="md">
          <>{renderAccountData()}</>
        </Box>

        <SavedItemTimestampAndDelete
          timestamp={keypair.timestamp}
          onDelete={() => onDelete(keypair)}
        />
      </Box>
    </Box>
  );
};
