"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Icon, Input, Text } from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { useStore } from "@/store/useStore";
import { useSEContractInfo } from "@/query/external/useSEContractInfo";
import { useWasmGitHubAttestation } from "@/query/useWasmGitHubAttestation";
import { validate } from "@/validate";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { MessageField } from "@/components/MessageField";
import { TabView } from "@/components/TabView";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { ContractInfo } from "./components/ContractInfo";

export default function ContractExplorer() {
  const { network, smartContracts } = useStore();
  const [contractActiveTab, setContractActiveTab] = useState("contract-info");
  const [contractIdInput, setContractIdInput] = useState("");
  const [contractIdInputError, setContractIdInputError] = useState("");

  const {
    data: contractInfoData,
    error: contractInfoError,
    isLoading: isContractInfoLoading,
    isFetching: isContractInfoFetching,
    refetch: fetchContractInfo,
  } = useSEContractInfo({
    networkId: network.id,
    contractId: contractIdInput,
  });

  const rpcUrl = network.rpcUrl;
  const wasmHash = contractInfoData?.wasm || "";

  const {
    data: wasmData,
    error: wasmError,
    isLoading: isWasmLoading,
    isFetching: isWasmFetching,
  } = useWasmGitHubAttestation({
    wasmHash,
    rpcUrl,
    isActive: Boolean(rpcUrl && wasmHash),
    headers: getNetworkHeaders(network, "rpc"),
  });

  const queryClient = useQueryClient();
  const isLoading =
    isContractInfoLoading ||
    isContractInfoFetching ||
    isWasmLoading ||
    isWasmFetching;

  useEffect(() => {
    if (smartContracts.explorer.contractId) {
      setContractIdInput(smartContracts.explorer.contractId);
    }
    // On page load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFetchContractInfo = () => {
    if (contractInfoData) {
      queryClient.resetQueries({
        queryKey: ["useSEContractInfo"],
      });
      smartContracts.resetExplorerContractId();
    }

    if (contractIdInputError) {
      setContractIdInputError("");
    }
  };

  const isCurrentNetworkSupported = ["mainnet", "testnet"].includes(network.id);
  const isLoadContractDisabled =
    !isCurrentNetworkSupported ||
    !network.rpcUrl ||
    !contractIdInput ||
    Boolean(contractIdInputError);

  const renderContractInfoContent = () => {
    return contractInfoData ? (
      <ContractInfo
        infoData={contractInfoData}
        wasmData={wasmData}
        network={network}
        isLoading={isLoading}
      />
    ) : null;
  };

  const renderContractInvokeContent = () => {
    return (
      <Card>
        <Text as="div" size="sm">
          Coming soon
        </Text>
      </Card>
    );
  };

  const renderButtons = () => {
    if (isCurrentNetworkSupported) {
      return (
        <Box gap="sm" direction="row">
          <Button
            size="md"
            variant="secondary"
            type="submit"
            disabled={isLoadContractDisabled}
            isLoading={isLoading}
          >
            Load contract
          </Button>

          <>
            {contractIdInput ? (
              <Button
                size="md"
                variant="error"
                icon={<Icon.RefreshCw01 />}
                onClick={() => {
                  resetFetchContractInfo();
                  setContractIdInput("");

                  trackEvent(
                    TrackingEvent.SMART_CONTRACTS_EXPLORER_CLEAR_CONTRACT,
                  );
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
          page="contract explorer"
        />
      </Box>
    );
  };

  return (
    <Box gap="lg">
      <PageCard heading="Contract Explorer">
        {!network.rpcUrl ? (
          <Alert variant="warning" placement="inline" title="Attention">
            RPC URL is required to view contract information. You can add it in
            the network settings in the upper right corner.
          </Alert>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchContractInfo();
            smartContracts.updateExplorerContractId(contractIdInput);

            trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_LOAD_CONTRACT);
          }}
          className="ContractExplorer__form"
        >
          <Box gap="lg">
            <Input
              fieldSize="md"
              id="contract-id"
              label="Contract ID"
              leftElement={<Icon.FileCode02 />}
              placeholder="Ex: CCBWOUL7XW5XSWD3UKL76VWLLFCSZP4D4GUSCFBHUQCEAW23QVKJZ7ON"
              error={contractIdInputError}
              value={contractIdInput}
              onChange={(e) => {
                resetFetchContractInfo();
                setContractIdInput(e.target.value);

                const error =
                  e.target.value && validate.getContractIdError(e.target.value);

                setContractIdInputError(error || "");
              }}
              note={
                isCurrentNetworkSupported
                  ? ""
                  : "You must switch your network to Mainnet or Testnet in order to see contract info."
              }
            />

            <>{renderButtons()}</>

            <>
              {contractInfoError ? (
                <MessageField
                  message={contractInfoError.toString()}
                  isError={true}
                />
              ) : null}

              {wasmError ? (
                <MessageField message={wasmError.toString()} isError={true} />
              ) : null}
            </>
          </Box>
        </form>
      </PageCard>

      <>
        {contractInfoData ? (
          <>
            <TabView
              tab1={{
                id: "contract-info",
                label: "Contract Info",
                content: renderContractInfoContent(),
              }}
              tab2={{
                id: "contract-invoke",
                label: "Invoke Contract",
                content: renderContractInvokeContent(),
              }}
              activeTabId={contractActiveTab}
              onTabChange={(tabId) => {
                setContractActiveTab(tabId);
              }}
            />

            <PoweredByStellarExpert />
          </>
        ) : null}
      </>
    </Box>
  );
}
