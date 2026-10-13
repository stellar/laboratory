"use client";

import { Heading, Logo, Text } from "@stellar/design-system";

import { SdsLink } from "@/components/SdsLink";
import { Box } from "@/components/layout/Box";
import { AskInput } from "@/components/Home/AskInput";
import { SectionHeader } from "@/components/Home/SectionHeader";
import { StartBuilding } from "@/components/Home/StartBuilding";
import { ExploreInspect } from "@/components/Home/ExploreInspect";
import { NetworkPicker } from "@/components/Home/NetworkPicker";
import { LearnByBuilding } from "@/components/Home/LearnByBuilding";
import { SaveAndShare } from "@/components/Home/SaveAndShare";

import { GITHUB_URL } from "@/constants/settings";

import "@/styles/home.scss";

// Landing page
export default function Introduction() {
  return (
    <div className="Lab__home" data-no-padding="true">
      {/* 96px between the hero block and the first section */}
      <Box gap="custom" customValue="96px" addlClassName="Lab__home__column">
        <Box gap="custom" customValue="40px" addlClassName="Lab__home__hero">
          <Box gap="lg">
            <Heading as="h1" size="md" weight="medium">
              Simulate, analyze, and explore — all in one place
            </Heading>

            <Text as="p" size="md" addlClassName="Lab__home__hero__subtitle">
              Everything you need to build and test on Stellar, right in your
              browser.
            </Text>
          </Box>

          <AskInput />
        </Box>

        <Box gap="custom" customValue="40px">
          <Box gap="lg">
            <SectionHeader title="Start building" />
            <StartBuilding />
          </Box>

          <Box gap="lg">
            <SectionHeader title="Explore & inspect" />
            <ExploreInspect />
          </Box>

          <Box gap="lg">
            <SectionHeader
              title="Network"
              description="Switch between Testnet, Mainnet, or a local network for development."
            />
            <NetworkPicker />
          </Box>

          <Box gap="lg">
            <SectionHeader
              title="Learn by building"
              description="Step-by-step tutorials to help you get started with Stellar Lab."
            />
            <LearnByBuilding />
          </Box>

          <SaveAndShare />
        </Box>
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
    </div>
  );
}
