"use client";

import { useMemo, useState } from "react";
import { Card, Icon, Input, Text } from "@stellar/design-system";

import { TabView } from "@/components/TabView";
import { Tabs } from "@/components/Tabs";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";

import { KNOWN_ASSETS } from "@/constants/knownAssets";

import { RecentList } from "./components/RecentList";
import { DefiList } from "./components/DefiList";
import { KnownAssetsList } from "./components/KnownAssetsList";

import { ContractListTabId } from "@/types/types";

export default function ContractList() {
  const { network, smartContracts } = useStore();
  const { contractList, updateContractListActiveTab } = smartContracts;

  // Persisted to the URL so a tab can be shared; defaults to "defi".
  const isContractListTabId = (value: string): value is ContractListTabId =>
    value === "defi" || value === "known-assets" || value === "recent";
  const activeTab: ContractListTabId = isContractListTabId(
    contractList.activeTab,
  )
    ? contractList.activeTab
    : "defi";
  const setActiveTab = (tabId: string) => {
    if (isContractListTabId(tabId)) {
      updateContractListActiveTab(tabId);
    }
  };

  // Search (tab row) applies to DeFi and Known assets; asset class filter
  // lives in the Known assets table header
  const [assetSearch, setAssetSearch] = useState("");
  const [assetClassFilter, setAssetClassFilter] = useState("");

  // Distinct asset classes, in the order they first appear in the list
  const assetClasses = useMemo(
    () =>
      KNOWN_ASSETS.reduce<string[]>((res, a) => {
        if (a.assetClass && !res.includes(a.assetClass)) {
          res.push(a.assetClass);
        }
        return res;
      }, []),
    [],
  );

  const filteredAssets = useMemo(() => {
    const query = assetSearch.trim().toLowerCase();

    return KNOWN_ASSETS.filter((a) => {
      if (assetClassFilter && a.assetClass !== assetClassFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        a.assetCode.toLowerCase().includes(query) ||
        a.entity.toLowerCase().includes(query)
      );
    });
  }, [assetSearch, assetClassFilter]);

  const renderSearch = () => (
    <div className="ContractList__search">
      <Input
        id="contract-list-search"
        fieldSize="md"
        placeholder="Search DeFi, asset, or entity"
        leftElement={<Icon.SearchSm />}
        value={assetSearch}
        onChange={(e) => setAssetSearch(e.target.value)}
        autoComplete="off"
      />
    </div>
  );

  const renderContent = () => {
    if (network.id === "futurenet") {
      return (
        <PageCard heading="Smart contract list">
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
        </PageCard>
      );
    }

    // On testnet, show tabs but only "Recent" tab (hide "Popular")
    if (network.id === "testnet") {
      return (
        <Box gap="lg" addlClassName="TabView">
          <div className="TabView__heading">
            <PageHeader heading="Smart contract list" />
          </div>
          <div className="TabView__tabContainer">
            <Tabs
              tabs={[{ id: "recent", label: "Recent" }]}
              activeTabId="recent"
              onChange={() => {
                // Single tab - no action needed
              }}
            />
          </div>
          <div className="TabView__content">
            {/* data-is-active is required for TabView CSS styling */}
            <div data-is-active={true}>
              <Card>
                <RecentList />
              </Card>
            </div>
          </div>
        </Box>
      );
    }

    // On mainnet, show tabs with DeFi, Known assets, and Recent
    return (
      <TabView
        heading={{ title: "Smart contract list" }}
        tab1={{
          id: "defi",
          label: "DeFi",
          content:
            activeTab === "defi" ? (
              <DefiList searchValue={assetSearch} />
            ) : null,
          isDisabled: network.id !== "mainnet",
        }}
        tab2={{
          id: "known-assets",
          label: "Known assets",
          content:
            activeTab === "known-assets" ? (
              <KnownAssetsList
                assets={filteredAssets}
                assetClasses={assetClasses}
                assetClassFilter={assetClassFilter}
                onAssetClassChange={setAssetClassFilter}
              />
            ) : null,
          isDisabled: network.id !== "mainnet",
        }}
        tab3={{
          id: "recent",
          label: "Recent",
          content:
            activeTab === "recent" ? (
              <Card>
                <RecentList searchValue={assetSearch} />
              </Card>
            ) : null,
        }}
        activeTabId={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
        }}
        rightElement={renderSearch()}
      />
    );
  };

  // Heading and tabs sit outside the card, like the other pages; only the
  // tab content is in a card
  return <Box gap="lg">{renderContent()}</Box>;
}
