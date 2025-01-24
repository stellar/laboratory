import { useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  Icon,
  Link,
  Logo,
  Text,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { TabView } from "@/components/TabView";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";

import { ContractInfoApiResponse, NetworkType } from "@/types/types";

import { ContractStorage } from "./ContractStorage";
import { VersionHistory } from "./VersionHistory";

export const ContractInfo = ({
  infoData,
  networkId,
}: {
  infoData: ContractInfoApiResponse;
  networkId: NetworkType;
}) => {
  type ContractTabId =
    | "contract-bindings"
    | "contract-contract-info"
    | "contract-source-code"
    | "contract-contract-storage"
    | "contract-version-history";

  const [activeTab, setActiveTab] = useState<ContractTabId>(
    "contract-version-history",
  );

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
                  href={stellarExpertAccountLink(infoData.creator, networkId)}
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

            {infoData.validation?.status === "verified" ? (
              <Badge variant="success" icon={<Icon.CheckCircle />}>
                Verified
              </Badge>
            ) : (
              <Badge variant="error" icon={<Icon.XCircle />}>
                Unverified
              </Badge>
            )}
          </Box>

          <TabView
            tab1={{
              id: "contract-bindings",
              label: "Bindings",
              content: <ComingSoonText />,
            }}
            tab2={{
              id: "contract-contract-info",
              label: "Contract Info",
              content: <ComingSoonText />,
            }}
            tab3={{
              id: "contract-source-code",
              label: "Source Code",
              content: <ComingSoonText />,
            }}
            tab4={{
              id: "contract-contract-storage",
              label: "Contract Storage",
              content: (
                <ContractStorage
                  isActive={activeTab === "contract-contract-storage"}
                  contractId={infoData.contract}
                  networkId={networkId}
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
                  networkId={networkId}
                />
              ),
            }}
            activeTabId={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId as ContractTabId);
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};
