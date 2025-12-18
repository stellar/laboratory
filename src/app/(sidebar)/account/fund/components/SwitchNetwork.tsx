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
            Fund a Futurenet or Testnet network account or contract with XLM,
            USDC, and EURC
          </Text>

          <Text size="sm" as="p">
            You must switch your network to Testnet or Futurenet in order to
            fund keypairs. Friendbot is a standalone service that funds your
            account or contract with XLM. To fund assets such as USDC and EURC,
            you’ll need to add a trustline manually before funding.
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
