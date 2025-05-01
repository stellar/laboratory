import { Button, Modal, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { Network } from "@/types/types";

type LoadNetworkModalProps = {
  onClose: () => void;
  onAccept: () => void;
  loadedNetwork: Network | null;
};

export const LoadNetworkModal = ({
  onClose,
  onAccept,
  loadedNetwork,
}: LoadNetworkModalProps) => {
  if (!loadedNetwork) {
    return null;
  }

  return (
    <Modal visible={Boolean(loadedNetwork)} onClose={onClose}>
      <Modal.Heading>Review Network Settings</Modal.Heading>

      <Modal.Body>
        <Text as="div" size="sm">
          You haven’t used these network settings on Mainnet before. Please
          review them carefully and confirm.
        </Text>

        <Box gap="sm" direction="column">
          <NetworkItem label="RPC URL" value={loadedNetwork.rpcUrl} />
          <NetworkItem label="Horizon URL" value={loadedNetwork.horizonUrl} />
          <NetworkItem
            label="Network Passphrase"
            value={loadedNetwork.passphrase}
          />
        </Box>
      </Modal.Body>

      <Modal.Footer>
        <Button size="md" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            onAccept();
            onClose();
          }}
        >
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NetworkItem = ({ label, value }: { label: string; value: string }) => (
  <Box gap="xs" direction="column">
    <Text as="div" size="sm" weight="semi-bold">
      {label}
    </Text>
    <Text as="div" size="sm">
      {value}
    </Text>
  </Box>
);
