"use client";

import { useEffect, useState } from "react";
import {
  Notification,
  Badge,
  Button,
  Icon,
  Input,
} from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import { useSEContractInfo } from "@/query/external/useSEContractInfo";
import { useWasmGitHubAttestation } from "@/query/useWasmGitHubAttestation";
import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";
import { useGetContractDataFromRpcById } from "@/query/useGetContractDataFromRpcById";
import { useBackendHealthCheck } from "@/query/external/useBackendHealthCheck";
import { useContractSpecFromWasm } from "@/hooks/useContractSpecFromWasm";
import { validate } from "@/validate";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { delayedAction } from "@/helpers/delayedAction";
import { SAC_SPEC } from "@/helpers/sacSpec";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { MessageField } from "@/components/MessageField";
import { TabView } from "@/components/TabView";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { AddressSelector } from "@/components/AddressSelector";

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
  const [isContractSelectorOpen, setIsContractSelectorOpen] = useState(false);

  const rpcUrl = network.rpcUrl;
  const rpcHeaders = getNetworkHeaders(network, "rpc");

  // Queries run declaratively off the contract ID, so a contract that is
  // already in the cache renders immediately without hitting the network.
  // Only the "Load contract" button forces a refetch.
  const canLoadContract = Boolean(
    rpcUrl && contractIdInput && !validate.getContractIdError(contractIdInput),
  );

  const {
    data: contractData,
    isSuccess: isContractDataSuccess,
    isLoading: isContractDataLoading,
    isFetching: isContractDataFetching,
    error: contractDataError,
    refetch: fetchContractData,
  } = useGetContractDataFromRpcById({
    contractId: contractIdInput,
    rpcUrl,
    headers: rpcHeaders,
    enabled: canLoadContract,
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
    enabled: canLoadContract,
  });

  const {
    data: backendHealthStatus,
    isLoading: isBackendHealthLoading,
    isSuccess: isBackendHealthSuccess,
  } = useBackendHealthCheck({
    networkId: network.id,
  });

  const isBackendHealthy =
    isBackendHealthSuccess && backendHealthStatus?.status === "healthy";
  const wasmHash = contractData?.wasmHash || "";
  const isDataLoaded = Boolean(contractData);

  // Download the Wasm once (cached by hash) and reuse it for the build
  // attestation, the contract spec (Invoke tab), and the spec/meta tabs. This
  // page is the only observer; children get the result as props.
  const {
    data: wasmBinary,
    isLoading: isWasmBinaryLoading,
    isError: isWasmBinaryError,
    error: wasmBinaryError,
    refetch: fetchWasmBinary,
  } = useWasmBinaryFromRpc({
    wasmHash,
    rpcUrl,
    isActive: Boolean(wasmHash),
    headers: rpcHeaders,
  });

  const {
    data: buildVerification,
    error: wasmError,
    isLoading: isAttestationLoading,
  } = useWasmGitHubAttestation({
    wasmHash,
    wasmBinary,
  });

  const { spec: wasmContractSpec, error: wasmContractSpecError } =
    useContractSpecFromWasm(wasmBinary);

  // `isLoading` is only true while there is no data yet. Background refetches
  // of cached data must not replace the rendered contract with a loader.
  const isInitialLoading =
    isContractDataLoading ||
    isContractInfoLoading ||
    isWasmBinaryLoading ||
    isAttestationLoading;
  const isFetching =
    isInitialLoading || isContractDataFetching || isContractInfoFetching;

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

  // Once a contract loads (from the network or the cache), keep its ID in the
  // URL so a refresh or shared link restores it
  useEffect(() => {
    if (isContractDataSuccess && contractData) {
      smartContracts.updateExplorerContractId(contractIdInput);
      trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_LOAD_CONTRACT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContractDataSuccess, contractIdInput]);

  const resetFetchContractInfo = () => {
    // Cached query data is keyed by contract ID, so changing the ID is enough
    // to stop showing the previous contract. Don't reset the queries: that
    // would throw away the cache we want to reuse on revisit.
    if (contractData) {
      smartContracts.resetExplorerContractId();
    }

    if (contractIdInputError) {
      setContractIdInputError("");
    }
  };

  const handleContractIdChange = (value: string) => {
    resetFetchContractInfo();
    setContractIdInput(value);

    const error = value && validate.getContractIdError(value);
    setContractIdInputError(error || "");
  };

  // If the entered contract ID matches one saved in localStorage for the
  // current network, surface its name as a badge next to the label.
  const matchedSavedContract = contractIdInput
    ? localStorageSavedContracts
        .get()
        .find(
          (contract) =>
            contract.network.id === network.id &&
            contract.contractId === contractIdInput,
        )
    : undefined;

  const isLoadContractDisabled =
    !network.rpcUrl || !contractIdInput || Boolean(contractIdInputError);

  const isSacType = contractData?.contractType
    ? contractData.contractType === "contractExecutableStellarAsset"
    : false;

  const invokeContractSpec = isSacType ? SAC_SPEC : wasmContractSpec;

  const renderContractInvokeContent = () => {
    return invokeContractSpec ? (
      <InvokeContract
        contractSpec={invokeContractSpec}
        contractId={contractIdInput}
        isLoading={isWasmBinaryLoading}
        contractClientError={wasmContractSpecError}
      />
    ) : null;
  };

  // Explicit "Load contract": bypass the cache and refetch. The Wasm and its
  // attestation are keyed by Wasm hash, so they refetch on their own if the
  // contract was upgraded to a new hash. A failed Wasm download stays failed
  // while the page is mounted, so retry it here.
  const handleLoadContract = async () => {
    if (!canLoadContract) {
      return;
    }

    await Promise.all([
      fetchContractData(),
      fetchContractInfo(),
      ...(isWasmBinaryError ? [fetchWasmBinary()] : []),
    ]);
    trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_LOAD_CONTRACT);
  };

  const renderButtons = () => {
    return (
      <Box gap="sm" direction="row" wrap="wrap">
        <Button
          size="md"
          variant="secondary"
          type="submit"
          disabled={isLoadContractDisabled}
          isLoading={isFetching}
        >
          Load contract
        </Button>

        <>
          {contractIdInput ? (
            <>
              <Button
                disabled={isLoadContractDisabled || isFetching}
                size="md"
                variant="tertiary"
                icon={<Icon.Save01 />}
                onClick={(e) => {
                  e.preventDefault();
                  setIsSaveModalVisible(true);
                }}
              >
                Save contract ID
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
                disabled={isFetching}
              >
                Clear
              </Button>
            </>
          ) : null}
        </>
      </Box>
    );
  };

  return (
    <Box gap="lg">
      <PageHeader heading="Contract explorer" />
      <PageCard>
        {!network.rpcUrl ? (
          <Notification variant="warning" title="Attention">
            RPC URL is required to view contract information. You can add it in
            the network settings in the upper right corner.
          </Notification>
        ) : null}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleLoadContract();
          }}
          className="ContractExplorer__form"
        >
          <Box gap="lg">
            <div className="ContractSelector__wrapper">
              <Input
                fieldSize="md"
                id="contract-id"
                label={
                  <Box
                    gap="xs"
                    direction="row"
                    align="center"
                    data-testid="contract-id-label"
                  >
                    Contract ID
                    {matchedSavedContract ? (
                      <Badge variant="secondary" size="sm">
                        {matchedSavedContract.name}
                      </Badge>
                    ) : null}
                  </Box>
                }
                placeholder="Ex: CCBWOUL7XW5XSWD3UKL76VWLLFCSZP4D4GUSCFBHUQCEAW23QVKJZ7ON"
                error={contractIdInputError}
                value={contractIdInput}
                onChange={(e) => {
                  handleContractIdChange(e.target.value);
                }}
                rightElement={
                  <AddressSelector.Button
                    mode="contract"
                    onClick={() =>
                      setIsContractSelectorOpen(!isContractSelectorOpen)
                    }
                  />
                }
              />

              <AddressSelector.Dropdown
                mode="contract"
                isOpen={isContractSelectorOpen}
                onClose={() => setIsContractSelectorOpen(false)}
                onChange={(val) => {
                  handleContractIdChange(val);
                  setIsContractSelectorOpen(false);
                }}
              />
            </div>

            <>{renderButtons()}</>

            <>
              {contractInfoError && !contractDataError ? (
                <MessageField
                  message={contractInfoError.toString()}
                  isError={true}
                />
              ) : null}

              {contractDataError ? (
                <MessageField
                  message={contractDataError.toString()}
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
              label: "Contract info",
              content: (
                <ContractInfo
                  infoData={contractInfoData}
                  contractId={contractIdInput}
                  backendStatus={isBackendHealthy ? "healthy" : "unhealthy"}
                  buildVerification={buildVerification}
                  wasmHash={wasmHash}
                  wasmBinary={wasmBinary}
                  isWasmBinaryLoading={isWasmBinaryLoading}
                  wasmBinaryError={wasmBinaryError}
                  network={network}
                  isLoading={isInitialLoading || isBackendHealthLoading}
                  isSacType={isSacType}
                />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab2={{
              id: "contract-invoke",
              label: "Invoke contract",
              content: renderContractInvokeContent(),
              isDisabled: !isDataLoaded || !invokeContractSpec,
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
