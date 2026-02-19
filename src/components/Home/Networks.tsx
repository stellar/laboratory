"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Modal, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { Box } from "@/components/layout/Box";

import { capitalizeString } from "@/helpers/capitalizeString";
import { openUrl } from "@/helpers/openUrl";
import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { delayedAction } from "@/helpers/delayedAction";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { Routes } from "@/constants/routes";

import { EmptyObj, Network, NetworkType } from "@/types/types";

export const Networks = ({
  imgTheme,
  network,
}: {
  imgTheme: "light" | "dark";
  network: Network | EmptyObj;
}) => {
  type BtnNetwork = string | null;

  type NetworkItem = {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    links: { label: string; url?: string }[];
  };

  const { addFloatNotification } = useStore();
  const router = useRouter();
  const { getAndSetNetwork } = useSwitchNetwork();
  const [btnNetwork, setBtnNetwork] = useState<BtnNetwork>(null);

  const getNetworkLabel = (network: BtnNetwork) =>
    network ? capitalizeString(network) : "";

  const networkLabel = btnNetwork ? getNetworkLabel(btnNetwork) : "";

  const networkItems: NetworkItem[] = [
    {
      id: "testnet",
      title: "Testnet",
      description: "Safely test transactions without real funds.",
      imagePath: getPublicResourcePath(
        `/images/lab-home-net-test-${imgTheme}.png`,
      ),
      links: [
        {
          label: "Switch to testnet",
        },
      ],
    },
    {
      id: "mainnet",
      title: "Mainnet",
      description: "Build, test, and run real transactions on Stellar.",
      imagePath: getPublicResourcePath(
        `/images/lab-home-net-main-${imgTheme}.png`,
      ),
      links: [
        {
          label: "Switch to mainnet",
        },
      ],
    },
    {
      id: "local",
      title: "Local Network",
      description: "Run a local Stellar network for development.",
      imagePath: getPublicResourcePath(
        `/images/lab-home-net-local-${imgTheme}.png`,
      ),
      links: [
        {
          label: "Quickstart",
          url: "https://github.com/stellar/quickstart",
        },
        {
          label: "Stellar CLI",
          url: "https://github.com/stellar/stellar-cli",
        },
      ],
    },
  ];

  const handleModalClose = () => {
    setBtnNetwork(null);
  };

  const renderButtons = (item: NetworkItem) => {
    if (item.id === "local" && item.links.length > 1) {
      return item.links.map((l, idx) => (
        <Button
          variant="tertiary"
          size="lg"
          key={`networkItem-${item.id}-btn-${idx}`}
          // Not having URL here is unlikely
          onClick={() => {
            if (l.url) {
              trackEvent(TrackingEvent.HOME_NETWORKS_BTN, {
                button: `local: ${l.label.toLowerCase()}`,
              });
              openUrl(l.url);
            }

            return false;
          }}
        >
          {l.label}
        </Button>
      ));
    }

    if (["testnet", "mainnet"].includes(item.id) && item.links.length === 1) {
      return (
        <Button
          variant="tertiary"
          size="lg"
          key={`networkItem-${item.id}-btn`}
          onClick={() => {
            setBtnNetwork(item.id);
            trackEvent(TrackingEvent.HOME_NETWORKS_BTN, {
              button: `switch to network: ${item.id}`,
            });
          }}
          disabled={network.id === item.id}
        >
          {item.links[0].label}
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <div className="Lab__home__networks">
        {networkItems.map((i) => (
          <div
            key={`networkItem-${i.id}`}
            className="Lab__home__networks__item"
            data-id={i.id}
          >
            <div className="Lab__home__networks__image">
              <Image
                src={i.imagePath}
                alt={`${i.title} image`}
                width={304}
                height={200}
              />
            </div>
            <Box gap="md" addlClassName="Lab__home__networks__content">
              <Box gap="xs">
                <Text
                  size="xl"
                  as="div"
                  weight="semi-bold"
                  addlClassName="Lab__home__networks__title"
                >
                  {i.title}
                </Text>
                <Text
                  size="md"
                  as="div"
                  addlClassName="Lab__home__networks__description"
                >
                  {i.description}
                </Text>
              </Box>
              <Box gap="sm" direction="row" wrap="wrap">
                {renderButtons(i)}
              </Box>
            </Box>
          </div>
        ))}
      </div>

      <Modal visible={Boolean(btnNetwork)} onClose={handleModalClose}>
        <Modal.Heading>{`Switch to ${networkLabel}`}</Modal.Heading>
        <Text
          as="div"
          size="sm"
          addlClassName="Lab__home__networks__modalText"
        >{`You’re currently on ${network.label}. Switch networks to try ${networkLabel}.`}</Text>
        <Modal.Footer>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => handleModalClose()}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => {
              getAndSetNetwork(btnNetwork as NetworkType);
              handleModalClose();

              delayedAction({
                action: () => {
                  addFloatNotification({
                    id: `n-${networkLabel}`,
                    title: `Network switched to ${networkLabel}`,
                    description:
                      btnNetwork === "testnet"
                        ? "Your network has been changed to Testnet. Start building by generating keypairs."
                        : "Your network has been changed to Mainnet. Start by building a transaction.",
                    type: "success",
                    actions:
                      btnNetwork === "testnet"
                        ? [
                            {
                              label: "Create Account",
                              onAction: () => {
                                router.push(Routes.ACCOUNT_CREATE);
                              },
                            },
                          ]
                        : [
                            {
                              label: "Build transaction",
                              onAction: () => {
                                router.push(Routes.BUILD_TRANSACTION);
                              },
                            },
                          ],
                  });
                },
                delay: 300,
              });
            }}
          >
            {`Switch to ${networkLabel}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
