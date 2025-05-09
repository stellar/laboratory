"use client";

import { useCallback, useEffect, useState } from "react";
import { Input, Icon, Button } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { ShareUrlButton } from "@/components/ShareUrlButton";

import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { arrayItem } from "@/helpers/arrayItem";
import { delayedAction } from "@/helpers/delayedAction";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { SavedContract } from "@/types/types";

export default function SavedSmartContracts() {
  const { network } = useStore();

  const [savedContracts, setSavedContracts] = useState<SavedContract[]>([]);
  const [currentContractTimestamp, setCurrentContractTimestamp] = useState<
    number | undefined
  >();

  const updateSavedContracts = useCallback(() => {
    const contracts = localStorageSavedContracts
      .get()
      .filter((s) => s.network.id === network.id);
    setSavedContracts(contracts);
  }, [network.id]);

  useEffect(() => {
    updateSavedContracts();
  }, [updateSavedContracts]);

  return (
    <Box gap="md">
      <PageCard heading="Saved Smart Contract IDs">
        <Box gap="md">
          <>
            {savedContracts.length === 0
              ? `There are no saved smart contract IDs on ${network.label} network.`
              : savedContracts.map((c) => (
                  <SavedContractItem
                    key={`saved-contract-${c.timestamp}`}
                    contract={c}
                    setCurrentContractTimestamp={setCurrentContractTimestamp}
                    onDelete={(contract) => {
                      const savedContracts = localStorageSavedContracts.get();
                      const indexToUpdate = savedContracts.findIndex(
                        (c) => c.timestamp === contract.timestamp,
                      );

                      if (indexToUpdate >= 0) {
                        const updatedList = arrayItem.delete(
                          savedContracts,
                          indexToUpdate,
                        );

                        localStorageSavedContracts.set(updatedList);
                        updateSavedContracts();
                      }
                    }}
                  />
                ))}
          </>
        </Box>
      </PageCard>

      <SaveToLocalStorageModal
        type="editName"
        itemTitle="Smart Contract ID"
        itemTimestamp={currentContractTimestamp}
        allSavedItems={localStorageSavedContracts.get()}
        isVisible={currentContractTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentContractTimestamp(undefined);

          if (isUpdate) {
            updateSavedContracts();
          }
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedContracts.set(updatedItems);
        }}
      />
    </Box>
  );
}

const SavedContractItem = ({
  contract,
  setCurrentContractTimestamp,
  onDelete,
}: {
  contract: SavedContract;
  setCurrentContractTimestamp: (timestamp: number) => void;
  onDelete: (contract: SavedContract) => void;
}) => {
  const { setSavedContractId } = useStore();
  const router = useRouter();

  return (
    <Box
      gap="sm"
      addlClassName="PageBody__content SavedContractItem"
      data-testid="saved-contract-item"
    >
      <Input
        id={`saved-contract-${contract.timestamp}-name`}
        data-testid="saved-contract-name"
        fieldSize="md"
        value={contract.name}
        readOnly
        leftElement="Name"
        rightElement={
          <InputSideElement
            variant="button"
            placement="right"
            onClick={() => {
              setCurrentContractTimestamp(contract.timestamp);
            }}
            icon={<Icon.Edit05 />}
          />
        }
      />

      <Input
        id={`saved-contract-${contract.timestamp}-id`}
        data-testid="saved-contract-id"
        fieldSize="md"
        value={contract.contractId}
        readOnly
        leftElement="Contract ID"
        copyButton={{ position: "right" }}
      />

      <Box
        gap="lg"
        direction="row"
        align="center"
        justify="space-between"
        addlClassName="Endpoints__urlBar__footer"
      >
        <Box gap="sm" direction="row">
          <Button
            size="md"
            variant="tertiary"
            type="button"
            onClick={() => {
              // Set a temporary param in URL that we will remove when the route
              // loads.
              setSavedContractId(contract.contractId);
              trackEvent(TrackingEvent.SMART_CONTRACTS_SAVED_VIEW_IN_EXPLORER);

              delayedAction({
                action: () => {
                  router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
                },
                delay: 300,
              });
            }}
          >
            View in Contract Explorer
          </Button>

          <ShareUrlButton shareableUrl={contract.shareableUrl} />
        </Box>

        <SavedItemTimestampAndDelete
          timestamp={contract.timestamp}
          onDelete={() => onDelete(contract)}
        />
      </Box>
    </Box>
  );
};
