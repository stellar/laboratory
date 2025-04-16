import React from "react";
import {
  Avatar,
  Button,
  CopyText,
  Modal,
  Icon,
  Text,
  IconButton,
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
        <Button size="md" variant="tertiary">
          <CopyText textToCopy={publicKey}>Copy address</CopyText>
          <IconButton
            altText="Default"
            customColor="var(--sds-clr-gray-09)"
            customSize="14px"
            icon={<Icon.Copy01 />}
          />
        </Button>
        <Button size="md" variant="tertiary" onClick={onDisconnect}>
          Disconnect
          <IconButton
            altText="Default"
            customColor="var(--sds-clr-gray-09)"
            customSize="14px"
            icon={<Icon.LogOut01 />}
          />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
