import { useState } from "react";
import Image from "next/image";
import { Button, Modal, Text } from "@stellar/design-system";

import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { Box } from "@/components/layout/Box";

import { capitalizeString } from "@/helpers/capitalizeString";
import { openUrl } from "@/helpers/openUrl";

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
      imagePath: `/images/lab-home-net-test-${imgTheme}.png`,
      links: [
        {
          label: "Switch to Testnet",
        },
      ],
    },
    {
      id: "mainnet",
      title: "Mainnet",
      description: "Build, test, and run real transactions on Stellar.",
      imagePath: `/images/lab-home-net-main-${imgTheme}.png`,
      links: [
        {
          label: "Switch to Mainnet",
        },
      ],
    },
    {
      id: "local",
      title: "Local Network",
      description: "Run a local Stellar network for development.",
      imagePath: `/images/lab-home-net-local-${imgTheme}.png`,
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
          onClick={() => (l.url ? openUrl(l.url) : false)}
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
            variant="primary"
            onClick={() => {
              getAndSetNetwork(btnNetwork as NetworkType);
              handleModalClose();
            }}
          >
            {`Switch to ${networkLabel}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
