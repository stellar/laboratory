"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";
import StellarHDWallet from "stellar-hd-wallet";

import { arrayItem } from "@/helpers/arrayItem";
import { getSaveItemNetwork } from "@/helpers/getSaveItemNetwork";
import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";

import { Box } from "@/components/layout/Box";
import { validate } from "@/validate";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { SavedKeypair } from "@/types/types";

export const AddKeypairManuallyModal = ({
  isVisible,
  onClose,
  onDone,
}: {
  isVisible: boolean;
  onClose: () => void;
  onDone: () => void;
}) => {
  const { network } = useStore();

  const [nameInput, setNameInput] = useState("");
  const [secretOrRecoveryInput, setSecretOrRecoveryInput] = useState("");
  const [error, setError] = useState("");

  const validateSecretOrRecoveryPhrase = (input: string) => {
    if (!input) {
      return "Secret key or recovery phrase is required";
    }

    const isRecoveryPhraseValid = StellarHDWallet.validateMnemonic(input);
    const secretKeyError = validate.getSecretKeyError(input);

    if (!isRecoveryPhraseValid && secretKeyError) {
      return "Secret key or recovery phrase is invalid";
    }

    return "";
  };

  const handleSave = () => {
    if (!secretOrRecoveryInput || error) {
      return;
    }

    let recoveryPhrase = "";
    let secretKey = "";

    // Recovery phrase
    if (StellarHDWallet.validateMnemonic(secretOrRecoveryInput)) {
      const wallet = StellarHDWallet.fromMnemonic(secretOrRecoveryInput);
      recoveryPhrase = secretOrRecoveryInput;
      // Get the first account
      secretKey = wallet.getSecret(0);
    } else {
      // Secret key
      secretKey = secretOrRecoveryInput;
    }

    const publicKey = Keypair.fromSecret(secretKey).publicKey();
    const allSavedItems = localStorageSavedKeypairs.get();

    const updatedItems: SavedKeypair[] = arrayItem.add(allSavedItems, {
      timestamp: Date.now(),
      network: getSaveItemNetwork(network),
      name: nameInput,
      publicKey,
      secretKey,
      recoveryPhrase: recoveryPhrase || undefined,
    });

    localStorageSavedKeypairs.set(updatedItems);

    onDone();
    handleClose();

    trackEvent(TrackingEvent.ACCOUNT_SAVED_ADD_MANUALLY, {
      withRecoveryPhrase: Boolean(recoveryPhrase),
    });
  };

  const handleClose = () => {
    setNameInput("");
    setSecretOrRecoveryInput("");
    setError("");

    onClose();
  };

  return (
    <Modal visible={isVisible} onClose={handleClose}>
      <Modal.Heading>Add new keypair</Modal.Heading>
      <Box gap="sm">
        <Input
          id="kp-saved-manually-name"
          fieldSize="md"
          label="Name"
          placeholder="Enter name"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
          }}
        />

        <Input
          id="kp-saved-manually-secret-phrase"
          fieldSize="md"
          label="Secret key or recovery phrase"
          placeholder="Enter the secret key that starts with “S” or recovery phrase"
          value={secretOrRecoveryInput}
          onChange={(e) => {
            const value = e.target.value;
            const validationError = validateSecretOrRecoveryPhrase(value);

            setError("");
            setSecretOrRecoveryInput(value);

            if (validationError) {
              setError(validationError);
            }
          }}
          autoComplete="off"
          error={error}
        />
      </Box>
      <Modal.Footer>
        <Button size="md" variant="tertiary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={handleSave}
          disabled={Boolean(!nameInput || !secretOrRecoveryInput || error)}
        >
          Add keypair
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
