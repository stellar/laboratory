"use client";

import { Card, Text } from "@stellar/design-system";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import "../../styles.scss";

export const SwitchNetwork = () => {
  return (
    <Card>
      <div className="Account__card">
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Fund a Futurenet or Testnet network account with XLM, USDC, and EURC
          </Text>

          <Text size="sm" as="p">
            You must switch your network to Futurenet or Testnet in order to
            fund keypairs. The friendbot is an API endpoint that will fund an
            account with 10,000 XLM, 10 USDC, or 10 EURC on Futurenet or
            Testnet.
          </Text>
        </div>

        <div className="Account__CTA" data-testid="fundAccount-buttons">
          <SwitchNetworkButtons
            includedNetworks={["futurenet", "testnet"]}
            buttonSize="md"
            page="fund account"
          />
        </div>
      </div>
    </Card>
  );
};
