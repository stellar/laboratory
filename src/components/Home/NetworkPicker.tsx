import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, Modal, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { CardGrid } from "@/components/Home/CardGrid";
import { NetworkIndicator } from "@/components/NetworkIndicator";

import { capitalizeString } from "@/helpers/capitalizeString";
import { delayedAction } from "@/helpers/delayedAction";
import { openUrl } from "@/helpers/openUrl";

import { useStore } from "@/store/useStore";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";

import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { NetworkType } from "@/types/types";

type NetworkCard = {
  /** Matches the store's network id, so the active card can be highlighted. */
  id: string;
  title: string;
  description: string;
  actions: { label: string; url?: string }[];
};

const NETWORKS: NetworkCard[] = [
  {
    id: "testnet",
    title: "Testnet",
    description: "Safely test transactions without real funds.",
    actions: [{ label: "Switch" }],
  },
  {
    id: "mainnet",
    title: "Mainnet",
    description: "Build, test, and run real transactions on Stellar.",
    actions: [{ label: "Switch" }],
  },
  {
    id: "local",
    title: "Local network",
    description: "Run a local Stellar network for development.",
    actions: [
      { label: "Quickstart", url: "https://github.com/stellar/quickstart" },
      { label: "Stellar CLI", url: "https://github.com/stellar/stellar-cli" },
    ],
  },
];

export const NetworkPicker = () => {
  const { network, addFloatNotification } = useStore();
  const { getAndSetNetwork } = useSwitchNetwork();
  const router = useRouter();
  // The network the confirmation modal is asking about, or null when closed.
  const [pendingNetwork, setPendingNetwork] = useState<string | null>(null);

  const pendingLabel = pendingNetwork ? capitalizeString(pendingNetwork) : "";

  const confirmSwitch = () => {
    if (!pendingNetwork) {
      return;
    }

    const target = pendingNetwork;

    getAndSetNetwork(target as NetworkType);
    setPendingNetwork(null);

    // Matches the existing Networks flow: the confirmation closes first, then
    // the success notification lands.
    delayedAction({
      action: () => {
        addFloatNotification({
          id: `n-${target}`,
          title: `Network switched to ${capitalizeString(target)}`,
          description:
            target === "testnet"
              ? "Your network has been changed to Testnet. Start building by generating keypairs."
              : "Your network has been changed to Mainnet. Start by building a transaction.",
          type: "success",
          actions:
            target === "testnet"
              ? [
                  {
                    label: "Create Account",
                    onAction: () => router.push(Routes.ACCOUNT_CREATE),
                  },
                ]
              : [
                  {
                    label: "Build transaction",
                    onAction: () => router.push(Routes.BUILD_TRANSACTION),
                  },
                ],
        });
      },
      delay: 300,
    });
  };

  return (
    <>
      <CardGrid columns={3} addlClassName="NetworkPicker">
        {NETWORKS.map((item) => {
          const isActive = network.id === item.id;

          return (
            <CardGrid.Cell key={item.id}>
              <Box gap="xs">
                {/* NetworkIndicator always paints its per-network dot colour;
                    the wrapper greys the dot when this card isn't active. */}
                <div
                  className="NetworkPicker__indicator"
                  data-is-active={isActive}
                >
                  <NetworkIndicator
                    networkId={item.id}
                    networkLabel={item.title}
                  />
                </div>

                <Text
                  as="p"
                  size="sm"
                  addlClassName="NetworkPicker__description"
                >
                  {item.description}
                </Text>
              </Box>

              <div className="NetworkPicker__actions">
                {isActive ? (
                  <div className="NetworkPicker__status">
                    <Icon.CheckCircle />
                    <Text as="span" size="xs" weight="medium">
                      {`You’re on ${item.title}`}
                    </Text>
                  </div>
                ) : (
                  item.actions.map((action) => (
                    <Button
                      key={`${item.id}-${action.label}`}
                      size="md"
                      variant="tertiary"
                      // Convention: -> internal, external. Quickstart and
                      // Stellar CLI leave the app; Switch does not.
                      icon={
                        action.url ? (
                          <Icon.LinkExternal01 />
                        ) : (
                          <Icon.ArrowRight />
                        )
                      }
                      iconPosition="right"
                      onClick={() => {
                        trackEvent(TrackingEvent.HOME_NETWORKS_BTN, {
                          button: action.url
                            ? `${item.id}: ${action.label.toLowerCase()}`
                            : `switch to network: ${item.id}`,
                        });

                        if (action.url) {
                          openUrl(action.url);
                        } else {
                          setPendingNetwork(item.id);
                        }
                      }}
                    >
                      {action.label}
                    </Button>
                  ))
                )}
              </div>
            </CardGrid.Cell>
          );
        })}
      </CardGrid>

      <Modal
        visible={Boolean(pendingNetwork)}
        onClose={() => setPendingNetwork(null)}
      >
        <Modal.Heading>{`Switch to ${pendingLabel}`}</Modal.Heading>
        <Text as="div" size="sm">
          {`You’re currently on ${network.label}. Switch networks to try ${pendingLabel}.`}
        </Text>
        <Modal.Footer>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => setPendingNetwork(null)}
          >
            Cancel
          </Button>
          <Button size="md" variant="secondary" onClick={confirmSwitch}>
            {`Switch to ${pendingLabel}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
