import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
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

import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";

import { STELLAR_ASSET_CONTRACT } from "@/constants/stellarAssetContractData";
import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  ContractInfoApiResponse,
  EmptyObj,
  Network,
  WasmData,
} from "@/types/types";

import { ContractSpec } from "./ContractSpec";
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
    | "contract-source-code"
    | "contract-contract-storage"
    | "contract-version-history"
    | "contract-build-info";

  const [activeTab, setActiveTab] = useState<ContractTabId>(
    "contract-contract-spec",
  );
  const [isBadgeTooltipVisible, setIsBadgeTooltipVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (buttonRef?.current?.contains(event.target as Node)) {
      return;
    }

    setIsBadgeTooltipVisible(false);
  }, []);

  // Close tooltip when clicked outside
  useLayoutEffect(() => {
    if (isBadgeTooltipVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [handleClickOutside, isBadgeTooltipVisible]);

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
                    <Link href="https://stellar.expert/explorer/public/contract/validation">
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

  const renderBuildVerifiedBadge = (hasWasmData: boolean) => {
    const item = {
      verified: {
        badge: (
          <Badge variant="success" icon={<Icon.CheckCircle />}>
            Build Verified
          </Badge>
        ),
        message: (
          <>
            <code>Build Verified</code> means that a GitHub Action run has
            attested to have built the Wasm, but does not verify the source
            code.
          </>
        ),
      },
      unverified: {
        badge: (
          <Badge variant="error" icon={<Icon.XCircle />}>
            Build Unverified
          </Badge>
        ),
        message: (
          <>
            This contract has no build verification configured. Please see{" "}
            <Link href="https://stellar.expert/explorer/public/contract/validation">
              verification setup instructions
            </Link>{" "}
            for more info.
          </>
        ),
      },
      builtIn: {
        badge: (
          <Badge variant="success" icon={<Icon.CheckCircle />}>
            Built-in Contract
          </Badge>
        ),
        message: (
          <>
            The Stellar Asset Contract (SAC) is a built-in smart contract that
            provides a standardized, programmatic interface to Stellar assets on
            the network. It implements the{" "}
            <Link href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md">
              SEP‑41 Token Interface
            </Link>{" "}
            via{" "}
            <Link href="https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046-06.md">
              CAP-46-06
            </Link>
            .
          </>
        ),
      },
    };

    const badge = isSacType
      ? item.builtIn
      : hasWasmData
        ? item.verified
        : item.unverified;

    return (
      <Tooltip
        triggerEl={
          <button
            ref={buttonRef}
            className="ContractInfo__badgeButton"
            onClick={() => {
              setIsBadgeTooltipVisible(!isBadgeTooltipVisible);
            }}
            type="button"
          >
            {badge.badge}
          </button>
        }
        isVisible={isBadgeTooltipVisible}
      >
        {badge.message}
      </Tooltip>
    );
  };

  if (isLoading) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

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

            {infoData ? renderBuildVerifiedBadge(Boolean(wasmData)) : null}
          </Box>

          <TabView
            tab1={{
              id: "contract-contract-spec",
              label: "Contract Spec",
              content: isDataLoaded ? (
                <ContractSpec
                  wasmHash={infoData?.wasm || ""}
                  rpcUrl={network.rpcUrl}
                  isActive={activeTab === "contract-contract-spec"}
                  isSourceStellarExpert={false}
                  isSacType={isSacType}
                />
              ) : (
                <NoContractLoadedView />
              ),
              isDisabled: !isDataLoaded,
            }}
            tab2={{
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
            tab3={{
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
            tab4={{
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
            tab5={{
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
            tab6={{
              id: "contract-bindings",
              label: "Bindings",
              content: <Bindings />,
              isDisabled: !isDataLoaded,
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
