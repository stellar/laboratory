"use client";

import { Routes } from "@/constants/routes";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";
import { NetworkType } from "@/types/types";
import { Button, Card, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

export default function CliSign() {
  const router = useRouter();
  const { selectNetwork, updateIsDynamicNetworkSelect } = useStore();

  const onSwitchNetwork = (network: NetworkType) => {
    const selectedNetwork = NetworkOptions.find((n) => n.id === network);
    if (selectedNetwork) {
      updateIsDynamicNetworkSelect(true);
      selectNetwork(selectedNetwork);
    }

    router.push(Routes.SIGN_TRANSACTION);
  };

  return (
    <Card>
      <div className="Account__card">
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Sign a transaction from the CLI
          </Text>

          <Text size="sm" as="p">
            Choose the network you want to sign the transaction on.
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
            Futurenet
          </Button>

          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              onSwitchNetwork("testnet");
            }}
          >
            Testnet
          </Button>

          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              onSwitchNetwork("mainnet");
            }}
          >
            Mainnet
          </Button>

          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              onSwitchNetwork("custom");
            }}
          >
            Custom
          </Button>
        </div>
      </div>
    </Card>
  );
}
