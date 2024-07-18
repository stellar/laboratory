"use client";

import { Card, Text, Button } from "@stellar/design-system";

import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import { NetworkType } from "@/types/types";

import "../../styles.scss";

export const SwitchNetwork = () => {
  const { selectNetwork, updateIsDynamicNetworkSelect } = useStore();
  const onSwitchNetwork = (network: NetworkType) => {
    const selectedNetwork = NetworkOptions.find((n) => n.id === network);
    if (selectedNetwork) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(selectedNetwork);
    }
  };

  return (
    <Card>
      <div className="Account__card">
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Friendbot: fund a Futurenet or Testnet network account
          </Text>

          <Text size="sm" as="p">
            You must switch your network to Futurenet or Testnet in order to
            fund keypairs. The friendbot is a horizon API endpoint that will
            fund an account with 10,000 lumens on the futurenet network.
          </Text>
        </div>
        <div className="Account__CTA" data-testid="fundAccount-buttons">
          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              onSwitchNetwork("futurenet");
            }}
          >
            Switch to Futurenet
          </Button>

          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              onSwitchNetwork("testnet");
            }}
          >
            Switch to Testnet
          </Button>
        </div>
      </div>
    </Card>
  );
};
