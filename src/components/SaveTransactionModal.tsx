import { useEffect, useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";
import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";
import { getSaveItemNetwork } from "@/helpers/getSaveItemNetwork";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

type SaveTransactionModalProps = (
  | {
      type: "save";
      txnTimestamp?: undefined;
    }
  | {
      type: "editName";
      txnTimestamp: number | undefined;
    }
) & {
  isVisible: boolean;
  onClose: (isUpdate?: boolean) => void;
};

export const SaveTransactionModal = ({
  type,
  isVisible,
  txnTimestamp,
  onClose,
}: SaveTransactionModalProps) => {
  const { network, transaction } = useStore();
  const [savedTxnName, setSavedTxnName] = useState("");

  const allTxns = localStorageSavedTransactions.get();
  const currentTxn = allTxns.find((t) => t.timestamp === txnTimestamp);
  const currentTxnIndex = allTxns.findIndex(
    (t) => t.timestamp === txnTimestamp,
  );
  const currentTxnName = currentTxn?.name || "";

  useEffect(() => {
    if (isVisible && type === "editName") {
      setSavedTxnName(currentTxnName);
    }
  }, [isVisible, type, currentTxnName]);

  const handleClose = (isUpdate?: boolean) => {
    setSavedTxnName("");
    onClose(isUpdate);
  };

  if (type === "editName" && txnTimestamp !== undefined) {
    return (
      <Modal visible={isVisible} onClose={handleClose}>
        <Modal.Heading>Edit Saved Transaction</Modal.Heading>
        <div>
          <Input
            id="saved-txn-name"
            fieldSize="md"
            label="Name"
            value={savedTxnName}
            onChange={(e) => {
              setSavedTxnName(e.target.value);
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
              if (currentTxnIndex >= 0) {
                localStorageSavedTransactions.set(
                  arrayItem.update(allTxns, currentTxnIndex, {
                    ...currentTxn,
                    timestamp: Date.now(),
                    name: savedTxnName,
                  }),
                );

                handleClose(true);
                trackEvent(TrackingEvent.TRANSACTION_BUILD_SAVE_SAVE);
              }
            }}
            disabled={!savedTxnName || savedTxnName === currentTxnName}
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
        <Modal.Heading>Save Transaction</Modal.Heading>
        <div>
          <Input
            id="saved-txn-name"
            fieldSize="md"
            label="Name"
            value={savedTxnName}
            onChange={(e) => {
              setSavedTxnName(e.target.value);
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
              const allTxns = localStorageSavedTransactions.get();

              localStorageSavedTransactions.set(
                arrayItem.add(allTxns, {
                  timestamp: Date.now(),
                  network: getSaveItemNetwork(network),
                  params: transaction.build.params,
                  operations: transaction.build.operations,
                  name: savedTxnName,
                }),
              );

              handleClose();
              trackEvent(TrackingEvent.TRANSACTION_SAVED_EDIT_SAVE);
            }}
            disabled={!savedTxnName}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
};
