import { Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { DataTable } from "@/components/DataTable";

import { useSEContractVersionHistory } from "@/query/external/useSEContractVersionHistory";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";

import { ContractVersionHistoryResponseItem, NetworkType } from "@/types/types";

export const VersionHistory = ({
  isActive,
  contractId,
  networkId,
}: {
  isActive: boolean;
  contractId: string;
  networkId: NetworkType;
}) => {
  const {
    data: versionHistoryData,
    error: versionHistoryError,
    isLoading: isVersionHistoryLoading,
    isFetching: isVersionHistoryFetching,
  } = useSEContractVersionHistory({
    isActive,
    networkId,
    contractId,
  });

  // Loading, error, and no data states
  if (isVersionHistoryLoading || isVersionHistoryFetching) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (versionHistoryError) {
    return (
      <ErrorText errorMessage={versionHistoryError.toString()} size="sm" />
    );
  }

  if (!versionHistoryData || versionHistoryData.length === 0) {
    return (
      <Text as="div" size="sm">
        No version history
      </Text>
    );
  }

  return (
    <DataTable
      tableId="contract-version-history"
      tableData={versionHistoryData}
      tableHeaders={[
        { id: "wasm", value: "Contract WASM Hash", isSortable: true },
        { id: "ts", value: "Updated", isSortable: true },
      ]}
      formatDataRow={(vh: ContractVersionHistoryResponseItem) => [
        { value: vh.wasm, isBold: true },
        { value: formatEpochToDate(vh.ts, "short") || "-" },
      ]}
      cssGridTemplateColumns="minmax(210px, 2fr) minmax(210px, 1fr)"
    />
  );
};
