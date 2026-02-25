import { useEffect, useState } from "react";
import { Link, Loader, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";

import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";
import { ScValPrettyJson } from "@/components/StellarDataRenderer";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { useBackendContractStorage } from "@/query/external/useBackendContractStorage";
import { useSEContractStorage } from "@/query/external/useSEContractStorage";

import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { capitalizeString } from "@/helpers/capitalizeString";
import { decodeScVal } from "@/helpers/decodeScVal";
import { getContractDataXDR } from "@/helpers/sorobanUtils";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { CONTRACT_STORAGE_MAX_ENTRIES } from "@/constants/settings";
import { INITIAL_OPERATION } from "@/constants/transactionOperations";
import { Routes } from "@/constants/routes";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import {
  ContractStorageProcessedItem,
  ContractStorageResponseItem,
  NetworkType,
  SortDirection,
} from "@/types/types";

// Map DataTable column IDs to API sort_by param values
const SORT_BY_MAP: Record<string, string> = {
  durability: "durability",
  ttl: "ttl",
  updated: "updated_at",
};

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
  totalEntriesCount?: number;
  isSourceStellarExpert: boolean;
}) => {
  const isXdrInit = useIsXdrInit();
  const { transaction } = useStore();
  const router = useRouter();

  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

  // Backend data source (used when backend is healthy)
  const backendResult = useBackendContractStorage({
    isActive: isActive && !isSourceStellarExpert,
    networkId,
    contractId,
    cursor: currentCursor,
    sortBy,
    order: sortOrder,
  });

  // Stellar Expert data source (fallback)
  const seResult = useSEContractStorage({
    isActive: isActive && isSourceStellarExpert,
    networkId,
    contractId,
    totalEntriesCount,
  });

  useEffect(() => {
    // Reset when contractId or networkId changes
    setCurrentCursor(undefined);
    setCurrentPage(1);
    setSortBy(undefined);
    setSortOrder(undefined);
  }, [contractId, networkId]);

  const activeResult = isSourceStellarExpert ? seResult : backendResult;

  useEffect(() => {
    if (isActive && activeResult.isSuccess && activeResult.data) {
      trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_STORAGE_LOADED, {
        source: isSourceStellarExpert ? "stellar_expert" : "backend",
      });
    }
  }, [isActive, activeResult.isSuccess]);

  useEffect(() => {
    if (isActive && backendResult.isError) {
      trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_STORAGE_ERROR, {
        source: "backend",
        error: backendResult.error?.message,
      });
    }
  }, [isActive, backendResult.isError]);

  const {
    error: storageError,
    isLoading: isStorageLoading,
    isFetching: isStorageFetching,
  } = activeResult;

  // Normalize data from both sources
  const storageData = (() => {
    if (isSourceStellarExpert) {
      const data = seResult.data;
      // SE API doesn't support sort_by, so sort by updated descending client-side
      return data
        ? [...data].sort((a, b) => (b.updated || 0) - (a.updated || 0))
        : data;
    }
    return backendResult.data?.results;
  })();

  // Pagination cursors (only available from backend)
  const nextCursor = !isSourceStellarExpert
    ? backendResult.data?._links?.next?.href
    : undefined;
  const prevCursor = !isSourceStellarExpert
    ? backendResult.data?._links?.prev?.href
    : undefined;

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

    const contractDataXdr = getContractDataXDR({
      contractAddress: contractId,
      dataKey: key,
      durability: durability,
    })?.toXDR("base64");

    trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_STORAGE_RESTORE, {
      contractId,
    });

    router.push(Routes.BUILD_TRANSACTION);

    if (contractDataXdr) {
      transaction.updateSorobanBuildOperation({
        operation_type: "restore_footprint",
        params: {
          contractDataLedgerKey: contractDataXdr,
        },
      });
    }
  };

  return (
    <Box gap="lg">
      <Box gap="sm">
        <DataTable
          key={`contract-storage-${isSourceStellarExpert ? "se" : "be"}`}
          tableId="contract-storage"
          tableData={parsedData}
          hideFirstLastPageNav={!isSourceStellarExpert}
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
          {...(!isSourceStellarExpert
            ? {
                onSortChange: (headerId: string, dir: SortDirection) => {
                  const apiSortBy = SORT_BY_MAP[headerId];
                  if (dir === "default") {
                    setSortBy(undefined);
                    setSortOrder(undefined);
                  } else {
                    setSortBy(apiSortBy);
                    setSortOrder(dir);
                  }
                  // Reset pagination on sort change
                  setCurrentCursor(undefined);
                  setCurrentPage(1);
                },
              }
            : {})}
          {...(!isSourceStellarExpert
            ? {
                hidePageCount: true,
                pageNavConfig: {
                  prev: {
                    onClick: () => {
                      if (prevCursor) {
                        const queryString = prevCursor.split("?")[1] || "";
                        const params = new URLSearchParams(queryString);
                        setCurrentCursor(params.get("cursor") || undefined);
                        setCurrentPage(Math.max(currentPage - 1, 1));
                      }
                    },
                    disabled:
                      !prevCursor ||
                      currentPage === 1 ||
                      isStorageLoading ||
                      isStorageFetching,
                  },
                  next: {
                    onClick: () => {
                      if (nextCursor) {
                        const queryString = nextCursor.split("?")[1] || "";
                        const params = new URLSearchParams(queryString);
                        setCurrentCursor(params.get("cursor") || undefined);
                        setCurrentPage(currentPage + 1);
                      }
                    },
                    disabled:
                      !nextCursor || isStorageLoading || isStorageFetching,
                  },
                },
              }
            : {})}
        />

        {/* Max entries message (SE only) */}
        {isSourceStellarExpert &&
        totalEntriesCount &&
        totalEntriesCount > parsedData.length ? (
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
