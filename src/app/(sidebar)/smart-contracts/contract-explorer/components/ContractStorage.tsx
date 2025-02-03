import { Loader, Text } from "@stellar/design-system";

import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { ScValPrettyJson } from "@/components/ScValPrettyJson";

import { useSEContractStorage } from "@/query/external/useSEContracStorage";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { capitalizeString } from "@/helpers/capitalizeString";
import { decodeScVal } from "@/helpers/decodeScVal";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import {
  ContractStorageProcessedItem,
  ContractStorageResponseItem,
  NetworkType,
} from "@/types/types";

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

  const parsedKeyValueData = () => {
    return storageData.map((i) => ({
      ...i,
      keyJson: i.key ? decodeScVal(i.key) : undefined,
      valueJson: i.value ? decodeScVal(i.value) : undefined,
    }));
  };

  const parsedData = parsedKeyValueData();

  const getKeyValueFilters = () => {
    return parsedData.reduce(
      (
        res: {
          key: string[];
          value: string[];
        },
        cur,
      ) => {
        // Key
        if (cur.keyJson && Array.isArray(cur.keyJson)) {
          const keyFilter = cur.keyJson[0];

          if (!res.key.includes(keyFilter)) {
            res.key = [...res.key, keyFilter];
          }
        }

        // Value
        if (cur.valueJson && typeof cur.valueJson === "object") {
          // Excluding keys that start with _ because on the UI structure is
          // different. For example, for Instance type.
          const valueFilters = Object.keys(cur.valueJson).filter(
            (f) => !f.startsWith("_"),
          );

          valueFilters.forEach((v) => {
            if (!res.value.includes(v)) {
              res.value = [...res.value, v];
            }
          });
        }

        return res;
      },
      { key: [], value: [] },
    );
  };

  const keyValueFilters = getKeyValueFilters();

  return (
    <DataTable
      tableId="contract-storage"
      tableData={parsedData}
      tableHeaders={[
        {
          id: "key",
          value: "Key",
          isSortable: false,
          filter: keyValueFilters.key,
        },
        {
          id: "value",
          value: "Value",
          isSortable: false,
          filter: keyValueFilters.value,
        },
        { id: "durability", value: "Durability", isSortable: true },
        { id: "ttl", value: "TTL", isSortable: true },
        { id: "updated", value: "Updated", isSortable: true },
      ]}
      formatDataRow={(
        vh: ContractStorageProcessedItem<ContractStorageResponseItem>,
      ) => [
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
      customFooterEl={
        <Box gap="sm" direction="row" align="center">
          {["sym", "i128", "u32", "bool"].map((t) => (
            <div
              className="DataTypeLegend"
              data-type={t}
              key={`legend-type-${t}`}
            ></div>
          ))}
        </Box>
      }
    />
  );
};
