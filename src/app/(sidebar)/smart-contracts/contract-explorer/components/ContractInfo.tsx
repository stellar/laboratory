import { Avatar, Card, Icon, Logo } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";
import { NetworkType } from "@/types/types";

export const ContractInfo = ({
  infoData,
  networkId,
}: {
  infoData: any;
  networkId: NetworkType;
}) => {
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
        gap="lg"
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
              infoData.validation.repository ? (
                <SdsLink
                  href={infoData.validation.repository}
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
            // TODO: link to Contract Storage tab when ready
            value={
              infoData.storage_entries
                ? formatEntriesText(infoData.storage_entries)
                : null
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Box gap="xs">
        <>{INFO_FIELDS.map((f) => renderInfoField(f))}</>
      </Box>
    </Card>
  );
};
