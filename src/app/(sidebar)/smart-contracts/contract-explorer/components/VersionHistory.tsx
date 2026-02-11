import { Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { DataTable } from "@/components/DataTable";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { useSEContractVersionHistory } from "@/query/external/useSEContractVersionHistory";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";

import { ContractVersionHistoryResponseItem, NetworkType } from "@/types/types";
import { StellarExpertNotAvailable } from "./StellarExpertNotAvailable";

export const VersionHistory = ({
  isActive,
  contractId,
  networkId,
  isSourceStellarExpert,
}: {
  isActive: boolean;
  contractId: string;
  networkId: NetworkType;
  isSourceStellarExpert: boolean;
}) => {
  // Check if network is supported by Stellar Expert
  const isStellarExpertSupported = getStellarExpertNetwork(networkId) !== null;

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

  // Show network not supported message
  if (!isStellarExpertSupported) {
    return (
      <StellarExpertNotAvailable
        title="Version history not available"
        message="Version history cannot be displayed because this network is not accessible by Stellar.expert."
      />
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
    <Box gap="lg">
      <DataTable
        tableId="contract-version-history"
        tableData={versionHistoryData}
        tableHeaders={[
          { id: "wasm", value: "Contract Wasm hash", isSortable: true },
          { id: "ts", value: "Updated", isSortable: true },
        ]}
        formatDataRow={(vh: ContractVersionHistoryResponseItem) => [
          { value: vh.wasm, isBold: true },
          { value: formatEpochToDate(vh.ts, "short") || "-" },
        ]}
        cssGridTemplateColumns="minmax(210px, 2fr) minmax(210px, 1fr)"
      />

      {isSourceStellarExpert ? <PoweredByStellarExpert /> : null}
    </Box>
  );
};
