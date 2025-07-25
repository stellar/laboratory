"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Icon, Input } from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { useStore } from "@/store/useStore";
import { useSEContractInfo } from "@/query/external/useSEContractInfo";
import { useWasmGitHubAttestation } from "@/query/useWasmGitHubAttestation";
import { useContractClientFromRpc } from "@/query/useContractClientFromRpc";
import { useGetContractTypeFromRpcById } from "@/query/useGetContractTypeFromRpcById";
import { validate } from "@/validate";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { delayedAction } from "@/helpers/delayedAction";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { MessageField } from "@/components/MessageField";
import { TabView } from "@/components/TabView";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { ContractInfo } from "./components/ContractInfo";
import { InvokeContract } from "./components/InvokeContract";

export default function ContractExplorer() {
  const { network, smartContracts, savedContractId, clearSavedContractId } =
    useStore();

  const [contractActiveTab, setContractActiveTab] = useState("contract-info");
  const [contractIdInput, setContractIdInput] = useState("");
  const [contractIdInputError, setContractIdInputError] = useState("");
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const {
    data: contractType,
    isLoading: isContractTypeLoading,
    isFetching: isContractTypeFetching,
    error: contractTypeError,
    refetch: fetchContractType,
  } = useGetContractTypeFromRpcById({
    contractId: contractIdInput,
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
  });

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

  const {
    data: contractClient,
    isFetching: isFetchingContractClient,
    error: contractClientError,
    refetch: fetchWasmContractClient,
  } = useContractClientFromRpc({
    contractId: contractIdInput,
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
  });

  const rpcUrl = network.rpcUrl;
  const wasmHash = contractInfoData?.wasm || "";
  const isDataLoaded = Boolean(contractInfoData);

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
    isContractTypeLoading ||
    isContractTypeFetching ||
    isContractInfoLoading ||
    isContractInfoFetching ||
    isWasmLoading ||
    isWasmFetching;

  useEffect(() => {
    // Pre-fill on page refresh and initial load
    if (smartContracts.explorer.contractId) {
      setContractIdInput(smartContracts.explorer.contractId);
    }

    // Pre-fill only on initial load when navigating from the Saved Smart
    // Contract IDs view.
    if (savedContractId) {
      setContractIdInput(savedContractId);

      // Remove temporary savedContractId from URL
      delayedAction({
        action: () => {
          clearSavedContractId();
        },
        delay: 200,
      });
    }
    // On page load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFetchContractInfo = () => {
    if (contractInfoData) {
      queryClient.resetQueries({
        queryKey: ["useSEContractInfo", "useClientFromRpc"],
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

  const isSacType = contractType
    ? contractType === "contractExecutableStellarAsset"
    : undefined;

  const renderContractInvokeContent = () => {
    const wasmSpec = contractClient?.spec;

    return contractInfoData && wasmSpec ? (
      <InvokeContract
        contractSpec={wasmSpec}
        infoData={contractInfoData}
        network={network}
        isLoading={isFetchingContractClient}
        contractClientError={contractClientError}
      />
    ) : null;
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
            Load contract
          </Button>

          <>
            {contractIdInput ? (
              <>
                <Button
                  disabled={isLoadContractDisabled || isLoading}
                  size="md"
                  variant="tertiary"
                  icon={<Icon.Save01 />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSaveModalVisible(true);
                  }}
                >
                  Save Contract ID
                </Button>

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
              </>
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
          onSubmit={async (e) => {
            e.preventDefault();
            await fetchContractType();
            await fetchContractInfo();
            await fetchWasmContractClient();
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

              {contractTypeError ? (
                <MessageField
                  message={contractTypeError.toString()}
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
        <>
          <TabView
            tab1={{
              id: "contract-info",
              label: "Contract Info",
              content: (
                <ContractInfo
                  infoData={contractInfoData}
                  wasmData={wasmData}
                  network={network}
                  isLoading={isLoading}
                  isSacType={isSacType}
                />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab2={{
              id: "contract-invoke",
              label: "Invoke Contract",
              content: renderContractInvokeContent(),
              isDisabled:
                !isDataLoaded || !(contractInfoData && contractClient?.spec),
            }}
            activeTabId={contractActiveTab}
            onTabChange={(tabId) => {
              setContractActiveTab(tabId);
            }}
          />
        </>
      </>

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Smart Contract"
        itemProps={{
          contractId: contractIdInput,
          shareableUrl: `${window.location.origin}${buildContractExplorerHref(contractIdInput)}`,
        }}
        allSavedItems={localStorageSavedContracts.get()}
        isVisible={isSaveModalVisible}
        onClose={() => {
          setIsSaveModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedContracts.set(updatedItems);
          trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_SAVE);
        }}
      />
    </Box>
  );
}
