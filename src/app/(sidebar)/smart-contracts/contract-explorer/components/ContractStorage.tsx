import { Link, Loader, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";

import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { ScValPrettyJson } from "@/components/ScValPrettyJson";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { useSEContractStorage } from "@/query/external/useSEContracStorage";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { capitalizeString } from "@/helpers/capitalizeString";
import { decodeScVal } from "@/helpers/decodeScVal";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { CONTRACT_STORAGE_MAX_ENTRIES } from "@/constants/settings";
import { INITIAL_OPERATION } from "@/constants/transactionOperations";
import { Routes } from "@/constants/routes";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

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
  isSourceStellarExpert,
}: {
  isActive: boolean;
  contractId: string;
  networkId: NetworkType;
  totalEntriesCount: number | undefined;
  isSourceStellarExpert: boolean;
}) => {
  const isXdrInit = useIsXdrInit();
  const { transaction } = useStore();
  const router = useRouter();

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

  const handleResetTransactions = () => {
    // reset transaction related stores
    transaction.updateBuildOperations([INITIAL_OPERATION]);
    transaction.updateBuildXdr("");
    transaction.updateSorobanBuildOperation(INITIAL_OPERATION);
    transaction.updateSorobanBuildXdr("");
  };

  const handleRestore = (key: string, durability: string) => {
    // reset transaction related stores
    handleResetTransactions();

    trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_STORAGE_RESTORE, {
      contractId,
    });

    router.push(Routes.BUILD_TRANSACTION);

    transaction.updateSorobanBuildOperation({
      operation_type: "restore_footprint",
      params: {
        contract: contractId,
        key_xdr: key,
        durability: durability,
      },
    });
  };

  return (
    <Box gap="lg">
      <Box gap="sm">
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
            {
              value: (
                <div className="TtlBox">
                  <span
                    className="TtlBox__value"
                    {...(vh.expired ? { "data-style": "expired" } : {})}
                  >
                    {formatNumber(vh.ttl)}
                  </span>
                  {vh.expired && vh.durability !== "temporary" ? (
                    <span>
                      <Link
                        onClick={() => handleRestore(vh.key, vh.durability)}
                      >
                        Restore
                      </Link>
                    </span>
                  ) : null}
                </div>
              ),
            },
            {
              value: formatEpochToDate(vh.updated, "short") || "-",
              isWrap: true,
            },
          ]}
          cssGridTemplateColumns="minmax(210px, 2fr) minmax(210px, 2fr) minmax(100px, 0.8fr) minmax(110px, 0.8fr) minmax(114px, 0.7fr)"
          csvFileName={contractId}
        />

        {/* Max entries message */}
        {totalEntriesCount && totalEntriesCount > parsedData.length ? (
          <Box
            gap="md"
            addlClassName="FieldNote FieldNote--note FieldNote--md"
            direction="row"
            justify="end"
          >
            {`Showing the last ${CONTRACT_STORAGE_MAX_ENTRIES} entries`}
          </Box>
        ) : null}
      </Box>

      {isSourceStellarExpert ? <PoweredByStellarExpert /> : null}
    </Box>
  );
};
