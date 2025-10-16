"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Icon, Input, Text } from "@stellar/design-system";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";
import { TabView } from "@/components/TabView";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";
import { SdsLink } from "@/components/SdsLink";

import { STELLAR_EXPERT } from "@/constants/settings";
import { validate } from "@/validate";
import { useStore } from "@/store/useStore";
import { useFetchRpcTxDetails } from "@/query/useFetchRpcTxDetails";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getTxData } from "@/helpers/getTxData";
import { openUrl } from "@/helpers/openUrl";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { TransactionInfo } from "./components/TransactionInfo";
import { StateChange } from "./components/StateChange";
import { FeeBreakdown } from "./components/FeeBreakdown";
import { Signatures } from "./components/Signatures";

import "./styles.scss";

export default function TransactionDashboard() {
  type TxTabId =
    | "tx-token-summary"
    | "tx-contracts"
    | "tx-events"
    | "tx-state-change"
    | "tx-resource-profiler"
    | "tx-signatures"
    | "tx-fee-breakdown";

  const { network, txDashboard } = useStore();

  const [transactionHashInput, setTransactionHashInput] = useState("");
  const [transactionHashInputError, setTransactionHashInputError] =
    useState("");
  const [activeTab, setActiveTab] = useState<TxTabId>("tx-state-change");

  const {
    data: txDetails,
    isLoading: isTxDetailsLoading,
    isFetching: isTxDetailsFetching,
    error: txDetailsError,
    refetch: fetchTxDetails,
  } = useFetchRpcTxDetails({
    txHash: transactionHashInput,
    headers: getNetworkHeaders(network, "rpc"),
    rpcUrl: network.rpcUrl,
  });

  const isCurrentNetworkSupported = ["mainnet", "testnet", "custom"].includes(
    network.id,
  );
  const isLoadContractDisabled =
    !isCurrentNetworkSupported ||
    !network.rpcUrl ||
    !transactionHashInput ||
    Boolean(transactionHashInputError);
  const isLoading = isTxDetailsLoading || isTxDetailsFetching;
  const isDataLoaded = Boolean(txDetails);

  const { isSorobanTx } = getTxData(txDetails || null);
  const isTxNotFound = txDetails?.status === "NOT_FOUND";

  const queryClient = useQueryClient();

  const EXTERNAL_EXPLORERS = [
    {
      id: "stellar-expert",
      label: "Stellar.Expert",
      onClick: () => {
        if (transactionHashInput && network.id) {
          const seNetwork = getStellarExpertNetwork(network.id);
          openUrl(`${STELLAR_EXPERT}/${seNetwork}/tx/${transactionHashInput}`);
        }
      },
    },
    {
      id: "lumenscan",
      label: "Lumenscan",
      onClick: () => {
        if (transactionHashInput && network.id) {
          const lsUrl =
            network.id === "mainnet"
              ? "https://lumenscan.io/txns"
              : "https://testnet.lumenscan.io/txns";
          openUrl(`${lsUrl}/${transactionHashInput}`);
        }
      },
    },
    {
      id: "goldsky",
      label: "Goldsky",
      onClick: () => {
        openUrl("https://goldsky.com/chains/stellar");
      },
    },
  ];

  useEffect(() => {
    if (txDashboard.transactionHash) {
      setTransactionHashInput(txDashboard.transactionHash);
    }
    // Run this only when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFetchTxDetails = async () => {
    if (transactionHashInputError) {
      setTransactionHashInputError("");
    }

    if (txDetails) {
      await queryClient.resetQueries({
        queryKey: [
          "useFetchRpcTxDetails",
          network.rpcUrl,
          transactionHashInput,
        ],
      });
    }
  };

  const renderButtons = () => {
    if (isCurrentNetworkSupported) {
      return (
        <Box gap="sm" direction="row" wrap="wrap">
          <Button
            size="md"
            variant="secondary"
            type="submit"
            disabled={isLoadContractDisabled}
            isLoading={isLoading}
          >
            Load transaction
          </Button>

          <>
            {transactionHashInput ? (
              <Button
                size="md"
                variant="error"
                icon={<Icon.RefreshCw01 />}
                onClick={async () => {
                  setTransactionHashInput("");
                  txDashboard.resetTransactionHash();
                  await resetFetchTxDetails();

                  trackEvent(TrackingEvent.TRANSACTION_DASHBOARD_CLEAR_TX);
                }}
                disabled={isLoading}
              >
                Clear
              </Button>
            ) : null}
          </>
        </Box>
      );
    }

    return (
      <Box gap="sm" direction="row">
        <SwitchNetworkButtons
          includedNetworks={["testnet", "mainnet", "custom"]}
          buttonSize="md"
          page="transaction dashboard"
        />
      </Box>
    );
  };

  const renderExternalButtons = () => {
    return EXTERNAL_EXPLORERS.map((ex) => (
      <Button
        key={`ex-btn-${ex.id}`}
        variant="tertiary"
        size="md"
        icon={<Icon.LinkExternal01 />}
        iconPosition="right"
        disabled={
          !(transactionHashInput && network.id && network.id !== "custom")
        }
        onClick={ex.onClick}
        title={network.id === "custom" ? "Custom network is not supported" : ""}
      >
        {ex.label}
      </Button>
    ));
  };

  const ComingSoonText = () => (
    <Text as="div" size="sm" weight="regular">
      Coming soon
    </Text>
  );

  return (
    <Box gap="lg">
      <PageCard heading="Transaction Dashboard">
        {!network.rpcUrl ? (
          <Alert variant="warning" placement="inline" title="Attention">
            RPC URL is required to view transaction information. You can add it
            in the network settings in the upper right corner.
          </Alert>
        ) : null}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetchTxDetails();

            trackEvent(TrackingEvent.TRANSACTION_DASHBOARD_LOAD_TX, {});
          }}
          className="ContractExplorer__form"
        >
          <Box gap="lg">
            <Input
              fieldSize="md"
              id="transaction-hash"
              label="Transaction Hash"
              leftElement={<Icon.FileCode02 />}
              placeholder="Ex: 6a274e17afb878bc704bfe41ebf456b4c6d9df5ca59bd3e06f5c39263e484017"
              error={transactionHashInputError}
              value={transactionHashInput}
              onChange={async (e) => {
                setTransactionHashInput(e.target.value);
                txDashboard.updateTransactionHash(e.target.value);

                if (txDetails) {
                  await resetFetchTxDetails();
                }

                const error =
                  e.target.value &&
                  validate.getTransactionHashError(e.target.value);

                setTransactionHashInputError(error || "");
              }}
              note={
                isCurrentNetworkSupported
                  ? ""
                  : "You must switch your network to Mainnet, Testnet, or Custom in order to see transaction info."
              }
            />

            {renderButtons()}

            {txDetailsError ? (
              <MessageField
                message={txDetailsError.toString()}
                isError={true}
              />
            ) : null}
          </Box>
        </form>
      </PageCard>

      {isTxNotFound ? (
        <Alert
          variant="warning"
          placement="inline"
          title="This transaction can’t be found here."
        >
          :q
          <Box gap="md">
            <span>
              Check that you’re using the correct network (Mainnet/Testnet). If
              the transaction is old, it may be outside this{" "}
              <SdsLink href="https://developers.stellar.org/docs/data/apis/rpc#why-run-rpc">
                RPC’s retention
              </SdsLink>{" "}
              window. You can still look up the transaction on Explorers and
              Indexers:
            </span>

            <Box gap="sm" direction="row" align="center" wrap="wrap">
              {renderExternalButtons()}
            </Box>
          </Box>
        </Alert>
      ) : null}

      <TransactionInfo
        txDetails={txDetails || null}
        isTxNotFound={isTxNotFound}
      />

      {isSorobanTx ? (
        <Card>
          <Box
            gap="lg"
            data-testid="contract-info-contract-container"
            addlClassName="ContractInfo__tabs"
          >
            <Box gap="sm" direction="row" align="center">
              <Text as="h2" size="md" weight="semi-bold">
                Transaction
              </Text>
            </Box>

            <TabView
              tab1={{
                id: "tx-token-summary",
                label: "Token Summary",
                content: <ComingSoonText />,
                isDisabled: true,
              }}
              tab2={{
                id: "tx-contracts",
                label: "Contracts",
                content: <ComingSoonText />,
                isDisabled: true,
              }}
              tab3={{
                id: "tx-events",
                label: "Events",
                content: <ComingSoonText />,
                isDisabled: true,
              }}
              tab4={{
                id: "tx-state-change",
                label: "State Change",
                content: isDataLoaded ? (
                  <StateChange txDetails={txDetails} />
                ) : (
                  <NoInfoLoadedView message="Load a transaction" />
                ),
                isDisabled: !isDataLoaded,
              }}
              tab5={{
                id: "tx-resource-profiler",
                label: "Resources Profiler",
                content: <ComingSoonText />,
                isDisabled: true,
              }}
              tab6={{
                id: "tx-signatures",
                label: "Signatures",
                content: <Signatures txDetails={txDetails || null} />,
                isDisabled: !isDataLoaded,
              }}
              tab7={{
                id: "tx-fee-breakdown",
                label: "Fee Breakdown",
                content: <FeeBreakdown txDetails={txDetails} />,
                isDisabled: !isDataLoaded,
              }}
              activeTabId={activeTab}
              onTabChange={(tabId) => {
                setActiveTab(tabId as TxTabId);

                trackEvent(TrackingEvent.TRANSACTION_DASHBOARD_TAB, {
                  tab: tabId,
                });
              }}
            />
          </Box>
        </Card>
      ) : null}
    </Box>
  );
}
