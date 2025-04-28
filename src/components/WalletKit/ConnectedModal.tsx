import React from "react";
import {
  Avatar,
  Button,
  CopyText,
  Modal,
  Icon,
  Text,
} from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { Box } from "@/components/layout/Box";

import "./styles.scss";

export const ConnectedModal = ({
  isVisible,
  publicKey,
  balance,
  showModal,
  onDisconnect,
}: {
  isVisible: boolean;
  publicKey: string;
  balance?: string;
  showModal: (isShown: boolean) => void;
  onDisconnect: () => void;
}) => {
  return (
    <Modal onClose={() => showModal(false)} visible={isVisible}>
      <Modal.Body>
        <Box gap="md" align="center">
          <Avatar size="lg" publicAddress={publicKey} />
          <div className="ConnectedModal">
            <Text size="md" as="div" weight="bold">
              {shortenStellarAddress(publicKey)}
            </Text>
            <Text size="sm" as="div" weight="semi-bold">
              {balance}
            </Text>
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer itemAlignment="stack">
        <CopyText textToCopy={publicKey} variant="headless">
          <Button
            isFullWidth
            size="md"
            variant="tertiary"
            icon={<Icon.Copy01 />}
            iconPosition="right"
            onClick={(e) => e.preventDefault()}
          >
            Copy address
          </Button>
        </CopyText>

        <Button
          size="md"
          variant="tertiary"
          onClick={onDisconnect}
          icon={<Icon.LogOut01 />}
          iconPosition="right"
        >
          Disconnect
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
