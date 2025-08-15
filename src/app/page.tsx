"use client";

import { Logo } from "@stellar/design-system";

import { NextLink } from "@/components/NextLink";
import { SdsLink } from "@/components/SdsLink";
import { Box } from "@/components/layout/Box";
import {
  HomeSection,
  HomeResources,
  HomeNetworks,
  HomeTutorials,
  HomeIntro,
} from "@/components/HomeComponents";

import { Routes } from "@/constants/routes";
import { GITHUB_URL } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import "@/styles/home.scss";

// Landing page
export default function Introduction() {
  const { theme, network } = useStore();

  return (
    <>
      <HomeSection
        title="Build and Test Stellar Transactions With No Code"
        description={
          <>
            Stellar Lab is a web-based toolkit for exploring the Stellar
            blockchain, allowing you to{" "}
            <NextLink href={Routes.BUILD_TRANSACTION} sds-variant="primary">
              build
            </NextLink>
            ,{" "}
            <NextLink href={Routes.SIGN_TRANSACTION} sds-variant="primary">
              sign
            </NextLink>
            ,{" "}
            <NextLink href={Routes.SIMULATE_TRANSACTION} sds-variant="primary">
              simulate
            </NextLink>
            , and{" "}
            <NextLink href={Routes.SUBMIT_TRANSACTION} sds-variant="primary">
              submit transactions
            </NextLink>
            , interact with RPC and Horizon APIs, convert between XDR and JSON,
            and explore smart contracts.
          </>
        }
        isTopSection={true}
      >
        <HomeIntro />
      </HomeSection>

      <HomeSection
        title="Follow our step-by-step tutorials to start building"
        eyebrow="Learn from tutorials"
      >
        <HomeTutorials />
      </HomeSection>

      <HomeSection
        title="Choose your network to get started"
        eyebrow="Use on multiple networks"
        description="Test safely in testnet and localnet, or connect to the mainnet — Stellar Lab gives you full control."
      >
        <HomeNetworks theme={theme} network={network} />
      </HomeSection>

      <HomeSection
        title="Everything you need to build and connect"
        eyebrow="Resources"
      >
        <HomeResources />
      </HomeSection>

      <Box
        gap="md"
        wrap="wrap"
        direction="row"
        align="end"
        justify="space-between"
        addlClassName="Lab__home__footer"
      >
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
      </Box>
    </>
  );
}
