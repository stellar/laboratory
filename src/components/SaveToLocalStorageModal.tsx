import { useEffect, useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";
// import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { getSaveItemNetwork } from "@/helpers/getSaveItemNetwork";
import { useStore } from "@/store/useStore";
import { AnyObject, LocalStorageSavedItem } from "@/types/types";

type SaveToLocalStorageModalProps<T, K> = (
  | {
      type: "save";
      itemTimestamp?: undefined;
      itemProps: K;
    }
  | {
      type: "editName";
      itemTimestamp: number | undefined;
      itemProps?: undefined;
    }
) & {
  isVisible: boolean;
  allSavedItems: T[];
  itemTitle: string;
  onClose: (isUpdate?: boolean) => void;
  onUpdate: (updatedItemsList: T[]) => void;
};

export const SaveToLocalStorageModal = <
  T extends LocalStorageSavedItem,
  K extends AnyObject,
>({
  type,
  itemProps,
  itemTimestamp,
  allSavedItems,
  itemTitle,
  isVisible,
  onClose,
  onUpdate,
}: SaveToLocalStorageModalProps<T, K>) => {
  const { network } = useStore();
  const [savedItemName, setSavedItemName] = useState("");

  const currentItem = allSavedItems.find((s) => s.timestamp === itemTimestamp);
  const currentItemIndex = allSavedItems.findIndex(
    (s) => s.timestamp === itemTimestamp,
  );
  const currentItemName = currentItem?.name || "";

  useEffect(() => {
    if (isVisible && type === "editName") {
      setSavedItemName(currentItemName);
    }
  }, [isVisible, type, currentItemName]);

  const handleClose = (isUpdate?: boolean) => {
    setSavedItemName("");
    onClose(isUpdate);
  };

  if (type === "editName" && itemTimestamp !== undefined) {
    return (
      <Modal visible={isVisible} onClose={handleClose}>
        <Modal.Heading>{`Edit Saved ${itemTitle}`}</Modal.Heading>
        <div>
          <Input
            id="saved-ls-name"
            fieldSize="md"
            label="Name"
            value={savedItemName}
            onChange={(e) => {
              setSavedItemName(e.target.value);
            }}
          />
        </div>
        <Modal.Footer>
          <Button size="md" variant="tertiary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              if (currentItemIndex >= 0) {
                // localStorageSavedKeypairs.set(
                //   arrayItem.update(allSavedItems, currentItemIndex, {
                //     ...currentItem,
                //     timestamp: Date.now(),
                //     name: savedItemName,
                //   }),
                // );

                onUpdate(
                  arrayItem.update(allSavedItems, currentItemIndex, {
                    ...currentItem,
                    timestamp: Date.now(),
                    name: savedItemName,
                  }),
                );

                handleClose(true);
              }
            }}
            disabled={!savedItemName || savedItemName === currentItemName}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (type === "save") {
    return (
      <Modal visible={isVisible} onClose={handleClose}>
        <Modal.Heading>{`Save ${itemTitle}`}</Modal.Heading>
        <div>
          <Input
            id="saved-ls-name"
            fieldSize="md"
            label="Name"
            value={savedItemName}
            onChange={(e) => {
              setSavedItemName(e.target.value);
            }}
          />
        </div>
        <Modal.Footer>
          <Button size="md" variant="tertiary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              // const allCurrentKeypairs = localStorageSavedKeypairs.get();

              // localStorageSavedKeypairs.set(
              //   arrayItem.add(allCurrentKeypairs, {
              //     timestamp: Date.now(),
              //     network: getSaveItemNetwork(network),
              //     name: savedItemName,
              //     publicKey,
              //     secretKey,
              //   }),
              // );
              onUpdate(
                arrayItem.add(allSavedItems, {
                  timestamp: Date.now(),
                  network: getSaveItemNetwork(network),
                  name: savedItemName,
                  ...itemProps,
                }),
              );

              handleClose();
            }}
            disabled={!savedItemName}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
};
