import { Loader, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { useSEContracVersionHistory } from "@/query/external/useSEContracVersionHistory";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { NetworkType } from "@/types/types";

export const VersionHistory = ({
  contractId,
  networkId,
}: {
  contractId: string;
  networkId: NetworkType;
}) => {
  const {
    data: versionHistoryData,
    error: versionHistoryError,
    isLoading: isVersionHistoryLoading,
    isFetching: isVersionHistoryFetching,
  } = useSEContracVersionHistory({
    networkId,
    contractId,
  });

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

  if (!versionHistoryData) {
    return (
      <Text as="div" size="sm">
        No version history
      </Text>
    );
  }

  return (
    <Box gap="md">
      {/* TODO: create table */}
      {versionHistoryData.map((h) => (
        <Box key={h.ts} gap="sm">
          <div>{h.wasm}</div>
          <div>{formatEpochToDate(h.ts, "short")}</div>
        </Box>
      ))}
    </Box>
  );
};
