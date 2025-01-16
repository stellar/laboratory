import { Loader, Text } from "@stellar/design-system";

import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { ScValPrettyJson } from "@/components/ScValPrettyJson";

import { useSEContractStorage } from "@/query/external/useSEContracStorage";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { capitalizeString } from "@/helpers/capitalizeString";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { ContractStorageResponseItem, NetworkType } from "@/types/types";

export const ContractStorage = ({
  isActive,
  contractId,
  networkId,
  totalEntriesCount,
}: {
  isActive: boolean;
  contractId: string;
  networkId: NetworkType;
  totalEntriesCount: number | undefined;
}) => {
  const isXdrInit = useIsXdrInit();

  const {
    data: storageData,
    error: storageError,
    isLoading: isStorageLoading,
    isFetching: isStorageFetching,
  } = useSEContractStorage({
    isActive,
    networkId,
    contractId,
    totalEntriesCount,
  });

  // Loading, error, and no data states
  if (isStorageLoading || isStorageFetching) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (storageError) {
    return <ErrorText errorMessage={storageError.toString()} size="sm" />;
  }

  if (!storageData || storageData.length === 0) {
    return (
      <Text as="div" size="sm">
        No contract storage
      </Text>
    );
  }

  return (
    <DataTable
      tableId="contract-storage"
      tableData={storageData}
      tableHeaders={[
        { id: "key", value: "Key", isSortable: false },
        { id: "value", value: "Value", isSortable: false },
        { id: "durability", value: "Durability", isSortable: true },
        { id: "ttl", value: "TTL", isSortable: true },
        { id: "updated", value: "Updated", isSortable: true },
      ]}
      formatDataRow={(vh: ContractStorageResponseItem) => [
        {
          value: (
            <div className="CodeBox">
              <ScValPrettyJson xdrString={vh.key} isReady={isXdrInit} />
            </div>
          ),
        },
        {
          value: (
            <div className="CodeBox">
              <ScValPrettyJson xdrString={vh.value} isReady={isXdrInit} />
            </div>
          ),
        },
        { value: capitalizeString(vh.durability) },
        { value: formatNumber(vh.ttl) },
        { value: formatEpochToDate(vh.updated, "short") || "-" },
      ]}
      cssGridTemplateColumns="minmax(210px, 2fr) minmax(210px, 2fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(210px, 1fr)"
    />
  );
};
