"use client";

import { Alert, Button, Card } from "@stellar/design-system";

import { TabView } from "@/components/TabView";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { MemoPicker } from "@/components/FormElements/MemoPicker";
import { TimeBoundsPicker } from "@/components/FormElements/TimeBoundsPicker";
import { InputSideElement } from "@/components/InputSideElement";

import { useStore } from "@/store/useStore";
import { Routes } from "@/constants/routes";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";

export default function BuildTransaction() {
  const { transaction, network } = useStore();
  const { activeTab } = transaction.build;
  const { updateBuildActiveTab } = transaction;

  const {
    // data,
    // error,
    refetch: fetchSequenceNumber,
  } = useAccountSequenceNumber({
    // TODO: pass source account
    publicKey: "",
    horizonUrl: network.horizonUrl,
  });

  // useEffect(() => {
  //   if (data || error) {
  //     // TODO: set data ?? ""
  //     // TODO: set error?.toString() ?? ""
  //   }
  // }, [data, error]);

  // TODO: add info links
  // TODO: use store values
  // TODO: validation
  const renderParams = () => {
    return (
      <Box gap="md">
        <>
          <Card>
            <Box gap="lg">
              <>
                <PubKeyPicker
                  id="source_account"
                  label="Source Account"
                  // TODO: handle value
                  value={""}
                  // TODO: handle error
                  error={""}
                  // TODO: handle change
                  onChange={() => {}}
                  note={
                    <>
                      If you don’t have an account yet, you can create and fund
                      a test net account with the{" "}
                      <SdsLink href={Routes.ACCOUNT_CREATE}>
                        account creator
                      </SdsLink>
                      .
                    </>
                  }
                />

                <PositiveIntPicker
                  id="sequence_number"
                  label="Transaction Sequence Number"
                  placeholder="Ex: 559234806710273"
                  // TODO: handle value
                  value={""}
                  // TODO: handle error
                  error={""}
                  // TODO: handle change
                  onChange={() => {}}
                  note="The transaction sequence number is usually one higher than current account sequence number."
                  rightElement={
                    <InputSideElement
                      variant="button"
                      onClick={() => fetchSequenceNumber()}
                      placement="right"
                      // TODO: disable if no valid source account
                      // disabled={}
                    >
                      Fetch next sequence
                    </InputSideElement>
                  }
                />

                <PositiveIntPicker
                  id="base_fee"
                  label="Base Fee"
                  // TODO: handle value
                  value=""
                  // TODO: handle error
                  error=""
                  // TODO: handle change
                  onChange={() => {}}
                  note={
                    <>
                      The{" "}
                      <SdsLink href="https://developers.stellar.org/docs/learn/glossary#base-fee">
                        network base fee
                      </SdsLink>{" "}
                      is currently set to 100 stroops (0.00001 lumens). Based on
                      current network activity, we suggest setting it to 100
                      stroops. Final transaction fee is equal to base fee times
                      number of operations in this transaction.
                    </>
                  }
                />

                <MemoPicker
                  id="memo"
                  // TODO: handle value
                  value={undefined}
                  labelSuffix="optional"
                  // TODO: handle error
                  error=""
                  // TODO: handle change
                  onChange={() => {}}
                />

                <TimeBoundsPicker
                  // TODO: handle value
                  value={undefined}
                  labelSuffix="optional"
                  // TODO: handle error
                  error={undefined}
                  // TODO: handle change
                  onChange={() => {}}
                />

                <div>
                  {/* TODO: add validation */}
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => {
                      updateBuildActiveTab("operations");
                    }}
                  >
                    Add Operations
                  </Button>
                </div>
              </>
            </Box>
          </Card>

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
          id: "params",
          label: "Params",
          content: renderParams(),
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
