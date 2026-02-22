"use client";

import { useState } from "react";
import {
  Alert,
  Avatar,
  Card,
  Icon,
  Link,
  Loader,
  Logo,
  Text,
  Tooltip,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { TabView } from "@/components/TabView";
import { InfoFieldItem } from "@/components/InfoFieldItem";
import { NoInfoLoadedView } from "@/components/NoInfoLoadedView";
import { BuildVerifiedBadge } from "@/components/BuildVerifiedBadge";

import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";

import { STELLAR_ASSET_CONTRACT } from "@/constants/stellarAssetContractData";
import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  ContractInfoApiResponse,
  ContractSectionName,
  EmptyObj,
  Network,
  WasmData,
} from "@/types/types";

import { ContractSpecMeta } from "./ContractSpecMeta";
import { ContractStorage } from "./ContractStorage";
import { VersionHistory } from "./VersionHistory";
import { BuildInfo } from "./BuildInfo";
import { SourceCode } from "./SourceCode";
import { Bindings } from "./Bindings";

export const ContractInfo = ({
  infoData,
  contractId,
  backendHealthStatus,
  isBackendHealthLoaded,
  wasmData,
  wasmHash,
  network,
  isLoading,
  isSacType,
}: {
  infoData: ContractInfoApiResponse | undefined;
  contractId: string;
  backendHealthStatus?: string;
  isBackendHealthLoaded: boolean;
  wasmData: WasmData | null | undefined;
  wasmHash: string | null | undefined;
  network: Network | EmptyObj;
  isLoading: boolean;
  isSacType?: boolean;
}) => {
  type ContractTabId =
    | "contract-bindings"
    | "contract-contract-spec"
    | "contract-contract-meta"
    | "contract-source-code"
    | "contract-contract-storage"
    | "contract-version-history"
    | "contract-build-info";

  const [activeTab, setActiveTab] = useState<ContractTabId>(
    "contract-contract-spec",
  );

  // We won’t get data on a custom network for SAC, because we get infoData from
  // StellarExpert (supports only Testnet and Mainnet), and SAC won’t have a
  // Wasm hash. All the other cases should work.
  const isDataLoaded = Boolean(infoData || wasmHash);

  const getRepoData = () => ({
    sourceRepo: isSacType
      ? STELLAR_ASSET_CONTRACT.sourceRepo
      : wasmData?.sourceRepo ||
        infoData?.validation?.repository?.replace("https://github.com/", "") ||
        "",
    sourceCommit: isSacType
      ? STELLAR_ASSET_CONTRACT.sourceTag
      : wasmData?.build.commit || infoData?.validation?.commit || "",
  });

  const { sourceRepo, sourceCommit } = getRepoData();

  type ContractExplorerInfoField = {
    id: string;
    label: string;
  };

  const INFO_FIELDS: ContractExplorerInfoField[] = [
    {
      id: "created",
      label: "Created",
    },
    {
      id: "creator",
      label: "Creator",
    },
    ...(isSacType
      ? [{ id: "asset", label: "Asset" }]
      : [
          {
            id: "wasm",
            label: "Wasm hash",
          },
        ]),
    {
      id: "repository",
      label: "Source code",
    },
    {
      id: "storage_entries",
      label: "Contract storage",
    },
  ];

  const formatEntriesText = (entriesCount: number) => {
    if (!entriesCount) {
      return "";
    }

    if (entriesCount === 1) {
      return `1 entry`;
    }

    return `${formatNumber(entriesCount)} entries`;
  };

  const renderInfoField = (field: ContractExplorerInfoField) => {
    switch (field.id) {
      case "repository":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={
              sourceRepo && sourceCommit ? (
                <SdsLink
                  href={`https://github.com/${sourceRepo}/tree/${sourceCommit}`}
                  addlClassName="Link--external"
                >
                  <Logo.Github />
                  {sourceRepo}
                  <Icon.LinkExternal01 />
                </SdsLink>
              ) : (
                <Box align="center" direction="row" gap="xs">
                  Unavailable
                  <Tooltip
                    triggerEl={
                      <div className="Label__infoButton" role="button">
                        <Icon.InfoCircle />
                      </div>
                    }
                  >
                    This contract has no build verification configured. Please
                    see{" "}
                    <Link href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md#attestation-verification-flow">
                      verification setup instructions
                    </Link>{" "}
                    for more info.
                  </Tooltip>
                </Box>
              )
            }
          />
        );
      case "created":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={
              infoData?.created ? formatEpochToDate(infoData.created) : null
            }
          />
        );
      case "wasm":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={wasmHash}
          />
        );
      case "asset":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={infoData?.asset}
          />
        );
      case "versions":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={infoData?.versions}
          />
        );
      case "creator":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={
              infoData?.creator ? (
                <SdsLink
                  href={stellarExpertAccountLink(infoData.creator, network.id)}
                >
                  <Avatar publicAddress={infoData.creator} size="sm" />
                  {infoData.creator}
                  <Icon.LinkExternal01 />
                </SdsLink>
              ) : null
            }
          />
        );
      case "storage_entries":
        return (
          <InfoFieldItem
            key={field.id}
            isValueLoaded={isDataLoaded}
            label={field.label}
            value={
              infoData?.storage_entries ? (
                <Link
                  onClick={() => {
                    setActiveTab("contract-contract-storage");
                  }}
                >
                  {formatEntriesText(infoData.storage_entries)}
                </Link>
              ) : null
            }
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  const renderContractStorage = () => {
    if (!isBackendHealthLoaded) {
      return (
        <Box gap="sm" direction="row" justify="center">
          <Loader />
        </Box>
      );
    }

    if (
      !infoData &&
      (!backendHealthStatus || backendHealthStatus !== "healthy")
    ) {
      return (
        <NoDataMessage title="Contract storage is not available">
          Contract storage is not available for selected network.
        </NoDataMessage>
      );
    }

    return (
      <ContractStorage
        isActive={activeTab === "contract-contract-storage"}
        contractId={contractId || ""}
        networkId={network.id}
        totalEntriesCount={infoData?.storage_entries}
        isSourceStellarExpert={backendHealthStatus !== "healthy"}
      />
    );
  };

  const renderContractSpecMeta = (sectionsToShow: ContractSectionName[]) => (
    <ContractSpecMeta
      sectionsToShow={sectionsToShow}
      wasmHash={wasmHash || ""}
      rpcUrl={network.rpcUrl}
      isActive={activeTab === "contract-contract-spec"}
      isSourceStellarExpert={false}
      isSacType={isSacType}
    />
  );

  const NoDataMessage = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    return (
      <Alert variant="primary" placement="inline" title={title}>
        {children}
      </Alert>
    );
  };

  return (
    <Box gap="lg">
      <Card>
        <div className="ContractInfoWrapper" data-no-data={!isDataLoaded}>
          <Box
            gap="sm"
            addlClassName="ContractInfo"
            data-testid="contract-info-container"
            data-no-data={!isDataLoaded}
          >
            <>{INFO_FIELDS.map((f) => renderInfoField(f))}</>
          </Box>
          {!isDataLoaded ? <NoContractLoadedView /> : null}
        </div>
      </Card>

      <Card>
        <Box gap="lg" addlClassName="ContractInfo__tabs">
          <Box gap="sm" direction="row" align="center">
            <Text as="h2" size="md" weight="semi-bold">
              Contract
            </Text>

            {infoData ? (
              <BuildVerifiedBadge
                status={
                  isSacType ? "built_in" : wasmData ? "verified" : "unverified"
                }
              />
            ) : null}
          </Box>

          <TabView
            tab1={{
              id: "contract-contract-spec",
              label: "Contract spec",
              content: isDataLoaded ? (
                renderContractSpecMeta(["contractspecv0", "sac"])
              ) : (
                <NoContractLoadedView />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab2={{
              id: "contract-contract-meta",
              label: "Contract & Env meta",
              content: isDataLoaded ? (
                renderContractSpecMeta(["contractmetav0", "contractenvmetav0"])
              ) : (
                <NoContractLoadedView />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab3={{
              id: "contract-source-code",
              label: "Source code",
              content: (
                <SourceCode
                  isActive={activeTab === "contract-source-code"}
                  repo={sourceRepo}
                  commit={sourceCommit}
                  isSourceStellarExpert={
                    // isSacType can also be undefined, so we need to make sure
                    // the value was set here
                    isSacType === false && !wasmData?.sourceRepo
                  }
                />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab4={{
              id: "contract-contract-storage",
              label: "Contract storage",
              content: renderContractStorage(),
              isDisabled: !isDataLoaded,
            }}
            tab5={{
              id: "contract-build-info",
              label: "Build info",
              content: (
                <BuildInfo
                  wasmData={wasmData}
                  isActive={activeTab === "contract-build-info"}
                />
              ),
              isDisabled: !isDataLoaded || isSacType,
            }}
            tab6={{
              id: "contract-bindings",
              label: "Bindings",
              content: <Bindings />,
              isDisabled: !isDataLoaded,
            }}
            tab7={{
              id: "contract-version-history",
              label: "Version history",
              content: infoData ? (
                <VersionHistory
                  isActive={activeTab === "contract-version-history"}
                  contractId={infoData.contract}
                  networkId={network.id}
                  isSourceStellarExpert={true}
                />
              ) : (
                <NoDataMessage title="Version history is not available">
                  Version history cannot be displayed because data from
                  Stellar.Expert is currently unavailable.
                </NoDataMessage>
              ),
              isDisabled: !isDataLoaded || isSacType,
            }}
            activeTabId={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId as ContractTabId);

              trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_TAB, {
                tab: tabId,
              });
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

const NoContractLoadedView = () => {
  return (
    <NoInfoLoadedView
      message={
        <>
          Load a contract or{" "}
          <SdsLink href={Routes.SMART_CONTRACTS_CONTRACT_LIST}>
            explore contracts
          </SdsLink>
        </>
      }
    />
  );
};
