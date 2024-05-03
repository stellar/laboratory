"use client";

import { TabView } from "@/components/TabView";
import { Box } from "@/components/layout/Box";
import { useStore } from "@/store/useStore";

import { Params } from "./components/Params";
import { Operations } from "./components/Operations";
import { TransactionXdr } from "./components/TransactionXdr";

export default function BuildTransaction() {
  const { transaction } = useStore();
  const { activeTab } = transaction.build;
  const { updateBuildActiveTab } = transaction;

  return (
    <Box gap="md">
      <TabView
        heading={{ title: "Build Transaction" }}
        tab1={{
          id: "params",
          label: "Params",
          content: activeTab === "params" ? <Params /> : null,
        }}
        tab2={{
          id: "operations",
          label: "Operations",
          content: activeTab === "operations" ? <Operations /> : null,
        }}
        activeTabId={activeTab}
        onTabChange={(id) => {
          updateBuildActiveTab(id);
        }}
      />

      <>{activeTab === "operations" ? <TransactionXdr /> : null}</>
    </Box>
  );
}
