"use client";

import { useState } from "react";
import { Text } from "@stellar/design-system";

import { TabView } from "@/components/TabView";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { RecentList } from "./components/RecentList";
import { PopularList } from "./components/PopularList";

export default function ContractList() {
  const { network } = useStore();

  type ContractListTabId = "popular" | "recent";

  const [activeTab, setActiveTab] = useState<ContractListTabId>("recent");

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

    return (
      <TabView
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
      <PageCard heading="Smart Contract List">{renderContent()}</PageCard>
    </Box>
  );
}
