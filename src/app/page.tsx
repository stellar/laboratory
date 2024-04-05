"use client";

import { Card, Link, Text, Icon } from "@stellar/design-system";

import { NextLink } from "@/components/NextLink";
import { LayoutContentContainer } from "@/components/layout/LayoutContentContainer";
import { InfoCards } from "@/components/InfoCards";
import { SdsLink } from "@/components/SdsLink";
import { Routes } from "@/constants/routes";
import { openUrl } from "@/helpers/openUrl";

export default function Introduction() {
  const infoCards = [
    {
      id: "stellar-quest",
      title: "Stellar Quest",
      description:
        "Learn to build world-class applications on the Stellar network in a gamified experience",
      buttonLabel: "Go to site",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () => openUrl("https://quest.stellar.org/"),
    },
    {
      id: "tools",
      title: "Developer Tools",
      description:
        "Tools, like the Stellar CLI, for reading and interacting with smart contracts on the Stellar Network",
      buttonLabel: "See tools",
      buttonIcon: undefined,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/docs/tools/sdks"),
    },
    {
      id: "stellar-rpc",
      title: "Stellar RPC",
      description: "Learn about the Stellar RPC, a RPC gateway to Stellar",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/network/soroban-rpc"),
    },
    {
      id: "horizon",
      title: "Horizon",
      description:
        "Learn about the Horizon for interacting with the Stellar network",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/network/horizon"),
    },
  ];

  return (
    <LayoutContentContainer>
      <Card>
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Stellar Laboratory
          </Text>

          <Text size="sm" as="p">
            The Stellar Laboratory is a set of tools that enables people to try
            out and learn about the Stellar network. The Laboratory can{" "}
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
            . It can also make requests to RPC and Horizon endpoints. You can
            save your transactions and runbooks for future use.
          </Text>

          <Text size="sm" as="p">
            For Stellar docs, take a look at the{" "}
            <Link href="https://developers.stellar.org/">
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
