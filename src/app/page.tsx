"use client";

import {
  Badge,
  Button,
  Heading,
  Icon,
  Logo,
  Text,
} from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { NextLink } from "@/components/NextLink";
import { SdsLink } from "@/components/SdsLink";
import { Box } from "@/components/layout/Box";
import {
  HomeSection,
  HomeResources,
  HomeNetworks,
  HomeTutorials,
  HomeSlider,
} from "@/components/HomeComponents";

import { Routes } from "@/constants/routes";
import { GITHUB_URL } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import "@/styles/home.scss";
import { openUrl } from "@/helpers/openUrl";

// Landing page
export default function Introduction() {
  const { theme, network } = useStore();
  const router = useRouter();

  const topImgSuffix = theme === "sds-theme-light" ? "light" : "dark";

  return (
    <Box gap="xl">
      <Box gap="custom" customValue="92px">
        <HomeSection>
          <div className="Lab__home__top">
            <div className="Lab__home__top__graphic">
              <Badge size="md" variant="secondary">
                Stellar Lab
              </Badge>

              <img
                src={`/images/lab-home-main-${topImgSuffix}.png`}
                alt="Home graphic image"
              />
            </div>
            <Heading as="h1" size="md" weight="semi-bold">
              Simulate, Analyze, and Explore — All in One place
            </Heading>
            <Text as="div" size="md">
              The all-in-one web tool to{" "}
              <NextLink href={Routes.BUILD_TRANSACTION} sds-variant="primary">
                build
              </NextLink>
              ,{" "}
              <NextLink href={Routes.SIGN_TRANSACTION} sds-variant="primary">
                sign
              </NextLink>
              ,{" "}
              <NextLink
                href={Routes.SIMULATE_TRANSACTION}
                sds-variant="primary"
              >
                simulate
              </NextLink>
              , and{" "}
              <NextLink href={Routes.SUBMIT_TRANSACTION} sds-variant="primary">
                submit transactions
              </NextLink>{" "}
              and interact with contracts on the Stellar network.
            </Text>

            <Box
              gap="md"
              direction="row"
              align="center"
              justify="center"
              wrap="wrap"
            >
              <Button
                size="lg"
                variant="secondary"
                icon={<Icon.ArrowRight />}
                onClick={() => {
                  router.push(Routes.ACCOUNT_CREATE);
                }}
              >
                Get started
              </Button>

              <Button
                size="lg"
                variant="tertiary"
                icon={<Icon.LinkExternal01 />}
                onClick={() => {
                  openUrl("https://developers.stellar.org/");
                }}
              >
                Read docs
              </Button>
            </Box>
          </div>
        </HomeSection>

        <HomeSection>
          <HomeSlider />
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
      </Box>

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
    </Box>
  );
}
