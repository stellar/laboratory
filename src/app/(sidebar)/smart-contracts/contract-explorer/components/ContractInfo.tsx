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
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";

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
}: {
  infoData: ContractInfoApiResponse | undefined;
  wasmData: WasmData | null | undefined;
  network: Network | EmptyObj;
  isLoading: boolean;
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
  const sourceRepo =
    wasmData?.sourceRepo ||
    infoData?.validation?.repository?.replace("https://github.com/", "") ||
    "";
  const sourceCommit =
    wasmData?.build.commit || infoData?.validation?.commit || "";

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
      id: "repository",
      label: "Source Code",
    },
    {
      id: "created",
      label: "Created",
    },
    {
      id: "wasm",
      label: "Wasm Hash",
    },
    {
      id: "versions",
      label: "Versions",
    },
    {
      id: "creator",
      label: "Creator",
    },
    {
      id: "storage_entries",
      label: "Data Storage",
    },
  ];

  const InfoFieldItem = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => {
    return (
      <Box
        gap="xs"
        direction="row"
        align="center"
        addlClassName="InfoFieldItem"
      >
        <div className="InfoFieldItem__label">{label}</div>
        {isDataLoaded ? (
          <div className="InfoFieldItem__value">{value ?? "-"}</div>
        ) : null}
      </Box>
    );
  };

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
              ) : null
            }
          />
        );
      case "created":
        return (
          <InfoFieldItem
            key={field.id}
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
            label={field.label}
            value={infoData?.wasm}
          />
        );
      case "versions":
        return (
          <InfoFieldItem
            key={field.id}
            label={field.label}
            value={infoData?.versions}
          />
        );
      case "creator":
        return (
          <InfoFieldItem
            key={field.id}
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
    };

    const badge = hasWasmData ? item.verified : item.unverified;

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
            gap="xs"
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
        <Box
          gap="lg"
          data-testid="contract-info-contract-container"
          addlClassName="ContractInfo__tabs"
        >
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
                  isSourceStellarExpert={!wasmData?.sourceRepo}
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
              isDisabled: !isDataLoaded,
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
              isDisabled: !isDataLoaded,
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
    <Box
      gap="sm"
      align="center"
      justify="center"
      addlClassName="NoContractLoaded"
    >
      <Box gap="xs" direction="row" align="center" justify="center" wrap="wrap">
        <Icon.FileCode02 />
        Load a contract or{" "}
        <SdsLink href={Routes.SMART_CONTRACTS_CONTRACT_LIST}>
          explore contracts
        </SdsLink>
      </Box>
    </Box>
  );
};
