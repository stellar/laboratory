"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Link, Text, Icon } from "@stellar/design-system";

import { NextLink } from "@/components/NextLink";
import { LayoutContentContainer } from "@/components/layout/LayoutContentContainer";
import { InfoCards } from "@/components/InfoCards";
import { SdsLink } from "@/components/SdsLink";
import { AssetPicker } from "@/components/FormElements/AssetPicker";

import { Routes } from "@/constants/routes";
import { AssetType } from "@/types/types";
import { IncludeFailedPicker } from "@/components/FormElements/IncludeFailedPicker";
import { OrderPicker } from "@/components/FormElements/OrderPicker";

export default function Introduction() {
  const router = useRouter();

  const [stringAssetId, setStringAssetId] = useState<AssetType | undefined>(
    "issued",
  );
  const [stringAssetValue, setStringAssetValue] = useState<any>("aaa:bbb");

  const [objectAssetId, setObjectAssetId] = useState<AssetType | undefined>(
    "credit_alphanum4",
  );
  const [objectAssetValue, setObjectAssetValue] = useState<any>({
    code: "ccc",
    issuer: "ddd",
  });

  const infoCards = [
    {
      id: "stellar-quest",
      title: "Stellar Quest",
      description:
        "Learn to build world-class applications on the Stellar network in a gamified experience",
      buttonLabel: "Go to site",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () => window.open("https://quest.stellar.org/", "_blank"),
    },
    {
      id: "tools",
      title: "Tools",
      description:
        "Tools for reading and interacting with Soroban smart contracts on the Stellar Network",
      buttonLabel: "See tools",
      buttonIcon: undefined,
      buttonAction: () => router.push(Routes.SOROBAN_CONTRACT_EXPLORER),
    },
    {
      id: "soroban-rpc",
      title: "Learn about the Soroban RPC",
      description: "Learn about the Soroban RPC, a RPC gateway to Stellar",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open("https://soroban.stellar.org/docs/reference/rpc", "_blank"),
    },
    {
      id: "horizon",
      title: "Learn about Horizon",
      description:
        "Learn about the Horizon for interacting with the Stellar network",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        window.open("https://developers.stellar.org/api/horizon", "_blank"),
    },
  ];

  return (
    <LayoutContentContainer>
      {/* TODO: remove, for testing only */}
      <Card>
        <div style={{ display: "grid", gap: 30 }}>
          <AssetPicker
            label="Asset"
            id="test"
            variant="string"
            selectedOption={stringAssetId}
            includeNone
            value={stringAssetValue}
            onChange={(opId, opValue) => {
              setStringAssetId(opId);
              setStringAssetValue(opValue);
            }}
          />

          <AssetPicker
            label="Base Asset"
            id="test-1"
            variant="object"
            selectedOption={undefined}
            value={objectAssetValue}
            onChange={(opId, opValue) => {
              setObjectAssetId(opId);
              setObjectAssetValue(opValue);
            }}
          />

          <IncludeFailedPicker
            id="failed"
            selectedOption=""
            value={false}
            onChange={() => {}}
          />

          <OrderPicker
            id="order"
            selectedOption=""
            value="asc"
            onChange={() => {}}
          />
        </div>
      </Card>

      <Card>
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Stellar Laboratory
          </Text>

          <Text size="sm" as="p">
            The Stellar Laboratory is a set of tools that enables people to try
            out and learn about the Stellar network. The laboratory can{" "}
            <NextLink href={Routes.BUILD_TRANSACTION} sds-variant="primary">
              build transactions
            </NextLink>
            ,{" "}
            <NextLink href={Routes.SIGN_TRANSACTION} sds-variant="primary">
              sign them
            </NextLink>
            , and{" "}
            <NextLink href={Routes.SUBMIT_TRANSACTION} sds-variant="primary">
              submit them to the network
            </NextLink>
            . It can also make requests to any of the Horizon endpoints.
          </Text>

          <Text size="sm" as="p">
            For Stellar docs, take a look at the{" "}
            <Link href="https://developers.stellar.org/docs">
              Stellar developers site
            </Link>
            .
          </Text>
        </div>
      </Card>

      <InfoCards infoCards={infoCards} />

      <div className="IntroFooter">
        <SdsLink
          href="https://www.stellar.org/privacy-policy"
          variant="secondary"
        >
          Privacy Policy
        </SdsLink>
        <SdsLink
          href="https://www.stellar.org/terms-of-service"
          variant="secondary"
        >
          Terms of Service
        </SdsLink>
      </div>
    </LayoutContentContainer>
  );
}
