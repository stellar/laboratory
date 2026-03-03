"use client";

import { Card, Text } from "@stellar/design-system";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";
import { AssetCode } from "@/components/AssetCode";
import { NetworkName } from "@/components/NetworkName";

import "../../styles.scss";

export const SwitchNetwork = () => {
  return (
    <Card>
      <div className="Account__card">
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Fund a{" "}<NetworkName>Futurenet</NetworkName>{" "}or{" "}<NetworkName>Testnet</NetworkName>{" "}network account or contract with XLM,{" "}
            <AssetCode>USDC</AssetCode>, and <AssetCode>EURC</AssetCode>
          </Text>

          <Text size="sm" as="p">
            You must switch your network to{" "}<NetworkName>Testnet</NetworkName>{" "}or{" "}<NetworkName>Futurenet</NetworkName>{" "}in order to
            fund keypairs. Friendbot is a standalone service that funds your
            account or contract with XLM. Adding a trustline is required to
            fund assets such as{" "}<AssetCode>USDC</AssetCode>{" "}and{" "}<AssetCode>EURC</AssetCode>.
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
