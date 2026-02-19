"use client";

import { useState, useEffect } from "react";
import { Text } from "@stellar/design-system";

import { TabView } from "@/components/TabView";
import { Tabs } from "@/components/Tabs";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { RecentList } from "./components/RecentList";
import { PopularList } from "./components/PopularList";

export default function ContractList() {
  const { network } = useStore();

  type ContractListTabId = "popular" | "recent";

  // Default to "recent" on testnet, "popular" on mainnet
  const [activeTab, setActiveTab] = useState<ContractListTabId>(
    network.id === "testnet" ? "recent" : "popular",
  );

  useEffect(() => {
    if (network.id === "testnet") {
      setActiveTab("recent");
    } else if (network.id === "mainnet") {
      setActiveTab("popular");
    }
  }, [network.id]);

  const renderContent = () => {
    if (network.id === "futurenet") {
      return (
        <div>
          <Text size="sm" as="p">
            No contract list found on Futurenet. Please switch to Testnet or
            Mainnet to view available contracts.
          </Text>

          <Box gap="md" direction="row">
            <SwitchNetworkButtons
              includedNetworks={["testnet", "mainnet"]}
              buttonSize="md"
              page="contract list"
            />
          </Box>
        </div>
      );
    }

    // On testnet, show tabs but only "Recent" tab (hide "Popular")
    if (network.id === "testnet") {
      return (
        <Box gap="lg" addlClassName="TabView">
          <div className="TabView__heading">
            <PageHeader heading="Smart contract list" />
            <div className="TabView__tabContainer">
              <Tabs
                tabs={[{ id: "recent", label: "Recent" }]}
                activeTabId="recent"
                onChange={() => {
                  // Single tab - no action needed
                }}
              />
            </div>
          </div>
          <div className="TabView__content">
            {/* data-is-active is required for TabView CSS styling */}
            <div data-is-active={true}>
              <RecentList />
            </div>
          </div>
        </Box>
      );
    }

    // On mainnet, show tabs with Popular and Recent
    return (
      <TabView
        heading={{ title: "Smart contract list" }}
        tab1={{
          id: "popular",
          label: "Popular",
          content: activeTab === "popular" ? <PopularList /> : null,
          isDisabled: network.id !== "mainnet",
        }}
        tab2={{
          id: "recent",
          label: "Recent",
          content: activeTab === "recent" ? <RecentList /> : null,
        }}
        activeTabId={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId as ContractListTabId);
        }}
      />
    );
  };

  return (
    <Box gap="lg">
      <PageCard>{renderContent()}</PageCard>
    </Box>
  );
}
