import { useEffect, useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";
import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { getSaveItemNetwork } from "@/helpers/getSaveItemNetwork";
import { useStore } from "@/store/useStore";

type SaveKeypairModalProps = (
  | {
      type: "save";
      keypairTimestamp?: undefined;
      publicKey: string;
      secretKey: string;
    }
  | {
      type: "editName";
      keypairTimestamp: number | undefined;
      publicKey?: undefined;
      secretKey?: undefined;
    }
) & {
  isVisible: boolean;
  onClose: (isUpdate?: boolean) => void;
};

export const SaveKeypairModal = ({
  type,
  publicKey,
  secretKey,
  isVisible,
  keypairTimestamp,
  onClose,
}: SaveKeypairModalProps) => {
  const { network } = useStore();
  const [savedKeypairName, setSavedKeypairName] = useState("");

  const allKeypairs = localStorageSavedKeypairs.get();
  const currentKeypair = allKeypairs.find(
    (kp) => kp.timestamp === keypairTimestamp,
  );
  const currentKeypairIndex = allKeypairs.findIndex(
    (kp) => kp.timestamp === keypairTimestamp,
  );
  const currentKeypairName = currentKeypair?.name || "";

  useEffect(() => {
    if (isVisible && type === "editName") {
      setSavedKeypairName(currentKeypairName);
    }
  }, [isVisible, type, currentKeypairName]);

  const handleClose = (isUpdate?: boolean) => {
    setSavedKeypairName("");
    onClose(isUpdate);
  };

  if (type === "editName" && keypairTimestamp !== undefined) {
    return (
      <Modal visible={isVisible} onClose={handleClose}>
        <Modal.Heading>Edit Saved Keypair</Modal.Heading>
        <div>
          <Input
            id="saved-kp-name"
            fieldSize="md"
            label="Name"
            value={savedKeypairName}
            onChange={(e) => {
              setSavedKeypairName(e.target.value);
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
              if (currentKeypairIndex >= 0) {
                localStorageSavedKeypairs.set(
                  arrayItem.update(allKeypairs, currentKeypairIndex, {
                    ...currentKeypair,
                    timestamp: Date.now(),
                    name: savedKeypairName,
                  }),
                );

                handleClose(true);
              }
            }}
            disabled={
              !savedKeypairName || savedKeypairName === currentKeypairName
            }
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
        <Modal.Heading>Save Keypair</Modal.Heading>
        <div>
          <Input
            id="saved-kp-name"
            fieldSize="md"
            label="Name"
            value={savedKeypairName}
            onChange={(e) => {
              setSavedKeypairName(e.target.value);
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
              const allCurrentKeypairs = localStorageSavedKeypairs.get();

              localStorageSavedKeypairs.set(
                arrayItem.add(allCurrentKeypairs, {
                  timestamp: Date.now(),
                  network: getSaveItemNetwork(network),
                  name: savedKeypairName,
                  publicKey,
                  secretKey,
                }),
              );

              handleClose();
            }}
            disabled={!savedKeypairName}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
};
