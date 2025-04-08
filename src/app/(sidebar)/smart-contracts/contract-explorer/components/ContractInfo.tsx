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

export const ContractInfo = ({
  infoData,
  wasmData,
  network,
  isLoading,
}: {
  infoData: ContractInfoApiResponse;
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
    "contract-version-history",
  );
  const [isBadgeTooltipVisible, setIsBadgeTooltipVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
      label: "WASM Hash",
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
        <div className="InfoFieldItem__value">{value ?? "-"}</div>
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
              infoData.validation?.repository && infoData.validation?.commit ? (
                <SdsLink
                  href={`${infoData.validation.repository}/tree/${infoData.validation.commit}`}
                  addlClassName="Link--external"
                >
                  <Logo.Github />
                  {infoData.validation.repository.replace(
                    "https://github.com/",
                    "",
                  )}
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
              infoData.created ? formatEpochToDate(infoData.created) : null
            }
          />
        );
      case "wasm":
        return (
          <InfoFieldItem
            key={field.id}
            label={field.label}
            value={infoData.wasm}
          />
        );
      case "versions":
        return (
          <InfoFieldItem
            key={field.id}
            label={field.label}
            value={infoData.versions}
          />
        );
      case "creator":
        return (
          <InfoFieldItem
            key={field.id}
            label={field.label}
            value={
              infoData.creator ? (
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
              infoData.storage_entries ? (
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

  const ComingSoonText = () => (
    <Text as="div" size="sm">
      Coming soon
    </Text>
  );

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
            attested to have built the WASM, but does not verify the source
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
        <Box
          gap="xs"
          addlClassName="ContractInfo"
          data-testid="contract-info-container"
        >
          <>{INFO_FIELDS.map((f) => renderInfoField(f))}</>
        </Box>
      </Card>

      <Card>
        <Box gap="lg" data-testid="contract-info-contract-container">
          <Box gap="sm" direction="row" align="center">
            <Text as="h2" size="md" weight="semi-bold">
              Contract
            </Text>

            {renderBuildVerifiedBadge(Boolean(wasmData))}
          </Box>

          <TabView
            tab1={{
              id: "contract-bindings",
              label: "Bindings",
              content: <ComingSoonText />,
            }}
            tab2={{
              id: "contract-contract-spec",
              label: "Contract Spec",
              content: (
                <ContractSpec
                  wasmHash={infoData.wasm || ""}
                  contractId={infoData.account || ""}
                  networkId={network.id}
                  networkPassphrase={network.passphrase}
                  rpcUrl={network.rpcUrl}
                  isActive={activeTab === "contract-contract-spec"}
                />
              ),
            }}
            tab3={{
              id: "contract-source-code",
              label: "Source Code",
              content: (
                <SourceCode
                  isActive={activeTab === "contract-source-code"}
                  repo={
                    infoData.validation?.repository?.replace(
                      "https://github.com/",
                      "",
                    ) || ""
                  }
                  commit={infoData.validation?.commit || ""}
                />
              ),
            }}
            tab4={{
              id: "contract-contract-storage",
              label: "Contract Storage",
              content: (
                <ContractStorage
                  isActive={activeTab === "contract-contract-storage"}
                  contractId={infoData.contract}
                  networkId={network.id}
                  totalEntriesCount={infoData.storage_entries}
                />
              ),
            }}
            tab5={{
              id: "contract-version-history",
              label: "Version History",
              content: (
                <VersionHistory
                  isActive={activeTab === "contract-version-history"}
                  contractId={infoData.contract}
                  networkId={network.id}
                />
              ),
            }}
            tab6={{
              id: "contract-build-info",
              label: "Build Info",
              content: (
                <BuildInfo
                  wasmData={wasmData}
                  isActive={activeTab === "contract-build-info"}
                />
              ),
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
