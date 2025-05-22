"use client";

import { Link, Text, Icon, Logo } from "@stellar/design-system";

import { NextLink } from "@/components/NextLink";
import { LayoutContentContainer } from "@/components/layout/LayoutContentContainer";
import { InfoCards } from "@/components/InfoCards";
import { SdsLink } from "@/components/SdsLink";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";

import { Routes } from "@/constants/routes";
import { GITHUB_URL } from "@/constants/settings";
import { openUrl } from "@/helpers/openUrl";

// Landing page
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
      buttonAction: () => openUrl("https://developers.stellar.org/docs/tools"),
    },
    {
      id: "stellar-rpc",
      title: "Stellar RPC",
      description: "Learn about Stellar RPC, a gateway to the Stellar network",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/docs/data/rpc"),
    },
    {
      id: "horizon",
      title: "Horizon",
      description:
        "Learn about Horizon, the REST API for interacting with the Stellar network",
      buttonLabel: "Go to docs",
      buttonIcon: <Icon.LinkExternal01 />,
      buttonAction: () =>
        openUrl("https://developers.stellar.org/network/horizon"),
    },
  ];

  return (
    <LayoutContentContainer>
      <PageCard heading="Stellar Lab">
        <Text size="sm" as="p">
          The Stellar Lab is an interactive toolkit for exploring the Stellar
          network. It helps developers and builders experiment with{" "}
          <NextLink href={Routes.BUILD_TRANSACTION} sds-variant="primary">
            building
          </NextLink>
          ,{" "}
          <NextLink href={Routes.SIGN_TRANSACTION} sds-variant="primary">
            signing
          </NextLink>
          ,{" "}
          <NextLink href={Routes.SIMULATE_TRANSACTION} sds-variant="primary">
            simulating
          </NextLink>
          , and{" "}
          <NextLink href={Routes.SUBMIT_TRANSACTION} sds-variant="primary">
            submitting transactions
          </NextLink>
          , as well as making requests to both RPC and Horizon APIs. With
          built-in tools for saving and sharing transactions, converting between
          XDR and JSON, and exploring smart contracts on Stellar, the Stellar
          Lab is ideal for testing, learning, and exploring on Stellar.
        </Text>

        <Text size="sm" as="p">
          For Stellar docs, take a look at the{" "}
          <Link href="https://developers.stellar.org/">
            Stellar developers site
          </Link>
          .
        </Text>
      </PageCard>

      {/*TODO: for testing; remove before merging */}
      <button
        type="button"
        onClick={() => {
          throw new Error("Test Sentry error");
        }}
      >
        Trigger test error
      </button>

      <InfoCards infoCards={infoCards} />

      <div className="IntroFooter">
        <Box gap="sm" direction="row">
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
        </Box>

        <Box gap="sm" direction="row">
          <>
            {process.env.NEXT_PUBLIC_COMMIT_HASH ? (
              <div>{`Commit hash: ${process.env.NEXT_PUBLIC_COMMIT_HASH}`}</div>
            ) : null}

            <SdsLink
              addlClassName="Link--withLogo"
              href={GITHUB_URL}
              variant="secondary"
              icon={<Logo.Github />}
            />
          </>
        </Box>
      </div>
    </LayoutContentContainer>
  );
}
