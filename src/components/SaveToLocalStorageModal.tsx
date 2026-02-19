"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";
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

  const isEditSaveDisabled =
    !savedItemName || savedItemName === currentItemName;
  const isSaveDisabled = !savedItemName;

  const handleClose = useCallback(
    (isUpdate?: boolean) => {
      setSavedItemName("");
      onClose(isUpdate);
    },
    [onClose],
  );

  const handleEditSave = useCallback(() => {
    if (currentItemIndex >= 0) {
      onUpdate(
        arrayItem.update(allSavedItems, currentItemIndex, {
          ...currentItem,
          timestamp: Date.now(),
          name: savedItemName,
        }),
      );

      handleClose(true);
    }
  }, [
    allSavedItems,
    currentItem,
    currentItemIndex,
    handleClose,
    onUpdate,
    savedItemName,
  ]);

  const handleSave = useCallback(() => {
    onUpdate(
      arrayItem.add(allSavedItems, {
        timestamp: Date.now(),
        network: getSaveItemNetwork(network),
        name: savedItemName,
        ...(itemProps || {}),
      }),
    );

    handleClose();
  }, [allSavedItems, handleClose, itemProps, network, onUpdate, savedItemName]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }

      if (event.key === "Enter") {
        if (type === "save" && !isSaveDisabled) {
          handleSave();
        }

        if (type === "editName" && !isEditSaveDisabled) {
          handleEditSave();
        }
      }
    },
    [
      handleClose,
      handleEditSave,
      handleSave,
      isEditSaveDisabled,
      isSaveDisabled,
      type,
    ],
  );

  useEffect(() => {
    if (isVisible && type === "editName") {
      setSavedItemName(currentItemName);
    }
  }, [isVisible, type, currentItemName]);

  useLayoutEffect(() => {
    if (isVisible) {
      document.addEventListener("keypress", handleKeyPress);
    } else {
      document.removeEventListener("keypress", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress, isVisible]);

  if (type === "editName" && itemTimestamp !== undefined) {
    return (
      <Modal visible={isVisible} onClose={handleClose}>
        <Modal.Heading>{`Edit saved ${itemTitle.toLowerCase()}`}</Modal.Heading>
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
            onClick={handleEditSave}
            disabled={isEditSaveDisabled}
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
        <Modal.Heading>{`Save ${itemTitle.toLowerCase()}`}</Modal.Heading>
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
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
};
