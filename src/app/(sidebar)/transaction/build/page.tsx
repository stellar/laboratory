"use client";

import { Alert, Card } from "@stellar/design-system";
import { TabView } from "@/components/TabView";
import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";

export default function BuildTransaction() {
  const { transaction } = useStore();
  const { activeTab } = transaction.build;
  const { updateBuildActiveTab } = transaction;

  const renderAttributes = () => {
    return (
      <Box gap="md">
        <>
          <Card>Attributes</Card>

          <Alert variant="primary" placement="inline">
            The transaction builder lets you build a new Stellar transaction.
            This transaction will start out with no signatures. To make it into
            the ledger, this transaction will then need to be signed and
            submitted to the network.
          </Alert>
        </>
      </Box>
    );
  };

  const renderOperations = () => {
    return <Card>Operations</Card>;
  };

  return (
    <div>
      <TabView
        heading={{ title: "Build Transaction" }}
        tab1={{
          id: "attributes",
          label: "Attributes",
          content: renderAttributes(),
        }}
        tab2={{
          id: "operations",
          label: "Operations",
          content: renderOperations(),
        }}
        activeTabId={activeTab}
        onTabChange={(id) => {
          updateBuildActiveTab(id);
        }}
      />
    </div>
  );
}
