"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Icon, Input } from "@stellar/design-system";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { validate } from "@/validate";
import { useStore } from "@/store/useStore";
import { useFetchRpcTxDetails } from "@/query/useFetchRpcTxDetails";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { TransactionInfo } from "./components/TransactionInfo";

export default function TransactionDashboard() {
  const { network, smartContracts } = useStore();

  const [transactionHashInput, setTransactionHashInput] = useState("");
  const [transactionHashInputError, setTransactionHashInputError] =
    useState("");

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

  const isCurrentNetworkSupported = ["mainnet", "testnet"].includes(network.id);
  const isLoadContractDisabled =
    !isCurrentNetworkSupported ||
    !network.rpcUrl ||
    !transactionHashInput ||
    Boolean(transactionHashInputError);
  const isLoading = isTxDetailsLoading || isTxDetailsFetching;

  const queryClient = useQueryClient();

  const resetFetchTxDetails = async () => {
    if (txDetails) {
      await queryClient.resetQueries({
        queryKey: [
          "useFetchRpcTxDetails",
          network.rpcUrl,
          transactionHashInput,
        ],
      });
      smartContracts.resetExplorerTransactionHash();
    }

    if (transactionHashInputError) {
      setTransactionHashInputError("");
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
                  await resetFetchTxDetails();
                  setTransactionHashInput("");

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
          includedNetworks={["testnet", "mainnet"]}
          buttonSize="md"
          page="transaction dashboard"
        />
      </Box>
    );
  };

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
                if (txDetails) {
                  await resetFetchTxDetails();
                }
                setTransactionHashInput(e.target.value);

                const error =
                  e.target.value &&
                  validate.getTransactionHashError(e.target.value);

                setTransactionHashInputError(error || "");
              }}
              note={
                isCurrentNetworkSupported
                  ? ""
                  : "You must switch your network to Mainnet or Testnet in order to see transaction info."
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

      <TransactionInfo txDetails={txDetails || null} />
    </Box>
  );
}
