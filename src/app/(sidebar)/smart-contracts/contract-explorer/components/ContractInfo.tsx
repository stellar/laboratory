import { useState } from "react";
import {
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
  wasmData,
  network,
  isLoading,
  isSacType,
}: {
  infoData: ContractInfoApiResponse | undefined;
  wasmData: WasmData | null | undefined;
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

  const isDataLoaded = Boolean(infoData);

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
            label: "Wasm Hash",
          },
        ]),
    {
      id: "repository",
      label: "Source Code",
    },
    {
      id: "storage_entries",
      label: "Contract Storage",
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
            value={infoData?.wasm}
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

  const renderContractSpecMeta = (sectionsToShow: ContractSectionName[]) => (
    <ContractSpecMeta
      sectionsToShow={sectionsToShow}
      wasmHash={infoData?.wasm || ""}
      rpcUrl={network.rpcUrl}
      isActive={activeTab === "contract-contract-spec"}
      isSourceStellarExpert={false}
      isSacType={isSacType}
    />
  );

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
                  isSacType ? "builtIn" : wasmData ? "verified" : "unverified"
                }
              />
            ) : null}
          </Box>

          <TabView
            tab1={{
              id: "contract-contract-spec",
              label: "Contract Spec",
              content: isDataLoaded ? (
                renderContractSpecMeta(["contractspecv0", "sac"])
              ) : (
                <NoContractLoadedView />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab2={{
              id: "contract-contract-meta",
              label: "Contract & Env Meta",
              content: isDataLoaded ? (
                renderContractSpecMeta(["contractmetav0", "contractenvmetav0"])
              ) : (
                <NoContractLoadedView />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab3={{
              id: "contract-source-code",
              label: "Source Code",
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
              label: "Contract Storage",
              content: infoData ? (
                <ContractStorage
                  isActive={activeTab === "contract-contract-storage"}
                  contractId={infoData.contract}
                  networkId={network.id}
                  totalEntriesCount={infoData.storage_entries}
                  isSourceStellarExpert={true}
                />
              ) : null,
              isDisabled: !isDataLoaded,
            }}
            tab5={{
              id: "contract-build-info",
              label: "Build Info",
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
              label: "Version History",
              content: infoData ? (
                <VersionHistory
                  isActive={activeTab === "contract-version-history"}
                  contractId={infoData.contract}
                  networkId={network.id}
                  isSourceStellarExpert={true}
                />
              ) : null,
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
