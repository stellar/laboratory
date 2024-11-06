"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Text, Card, Input, Icon, Button } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { SaveKeypairModal } from "@/components/SaveKeypairModal";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";

import { useStore } from "@/store/useStore";
import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { NetworkOptions } from "@/constants/settings";
import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";

import { NetworkType, SavedKeypair } from "@/types/types";
import { arrayItem } from "@/helpers/arrayItem";

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

  const SavedKeypair = ({ keypair }: { keypair: SavedKeypair }) => {
    return (
      <Box gap="sm" addlClassName="PageBody__content">
        <Input
          id={`saved-kp-${keypair.timestamp}-name`}
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
          fieldSize="md"
          value={keypair.publicKey}
          readOnly
          leftElement="Public"
          copyButton={{ position: "right" }}
        />

        <Input
          id={`saved-kp-${keypair.timestamp}-sk`}
          fieldSize="md"
          value={keypair.secretKey}
          readOnly
          leftElement="Secret"
          copyButton={{ position: "right" }}
          isPassword
        />

        <Box
          gap="lg"
          direction="row"
          align="center"
          justify="end"
          addlClassName="Endpoints__urlBar__footer"
        >
          <SavedItemTimestampAndDelete
            timestamp={keypair.timestamp}
            onDelete={() => {
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
        </Box>
      </Box>
    );
  };

  const getNetworkById = (networkId: NetworkType) => {
    const newNetwork = NetworkOptions.find((n) => n.id === networkId);

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

            getNetworkById(newNetworkId);
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
                  <SavedKeypair key={`saved-kp-${kp.timestamp}`} keypair={kp} />
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
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              getNetworkById("futurenet");
            }}
          >
            Switch to Futurenet
          </Button>

          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              getNetworkById("testnet");
            }}
          >
            Switch to Testnet
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box gap="md">
      <Box gap="md">
        <div className="PageHeader">
          <Text size="md" as="h1" weight="medium">
            Saved Keypairs
          </Text>
        </div>

        <Card>{renderContent()}</Card>
      </Box>

      <>{renderOtherNetworkMessage()}</>

      <SaveKeypairModal
        type="editName"
        isVisible={currentKeypairTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentKeypairTimestamp(undefined);

          if (isUpdate) {
            updateSavedKeypairs();
          }
        }}
        keypairTimestamp={currentKeypairTimestamp}
      />
    </Box>
  );
}
