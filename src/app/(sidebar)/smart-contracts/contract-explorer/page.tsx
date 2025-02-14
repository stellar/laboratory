"use client";

import { useEffect, useState } from "react";
import { Button, Card, Icon, Input, Link, Text } from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { useStore } from "@/store/useStore";
import { useSEContractInfo } from "@/query/external/useSEContractInfo";
import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { MessageField } from "@/components/MessageField";
import { TabView } from "@/components/TabView";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

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

  const queryClient = useQueryClient();

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

  const renderContractInfoContent = () => {
    return contractInfoData ? (
      <ContractInfo infoData={contractInfoData} network={network} />
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
            disabled={
              !isCurrentNetworkSupported ||
              !contractIdInput ||
              Boolean(contractIdInputError)
            }
            isLoading={isContractInfoLoading || isContractInfoFetching}
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
                }}
                disabled={isContractInfoLoading || isContractInfoFetching}
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
        />
      </Box>
    );
  };

  return (
    <Box gap="lg">
      <PageCard heading="Contract Explorer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchContractInfo();
            smartContracts.updateExplorerContractId(contractIdInput);
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

                const error = validate.getContractIdError(e.target.value);
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

            <Text as="div" size="xs">
              Powered by{" "}
              <Link href="https://stellar.expert">Stellar.Expert</Link>
            </Text>
          </>
        ) : null}
      </>
    </Box>
  );
}
