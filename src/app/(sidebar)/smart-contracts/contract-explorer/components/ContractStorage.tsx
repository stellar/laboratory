import { Loader, Text } from "@stellar/design-system";
import { scValToNative, xdr } from "@stellar/stellar-sdk";
import { stringify } from "lossless-json";

import { ErrorText } from "@/components/ErrorText";
import { Box } from "@/components/layout/Box";
import { DataTable } from "@/components/DataTable";

import { useSEContractStorage } from "@/query/external/useSEContracStorage";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { formatNumber } from "@/helpers/formatNumber";
import { capitalizeString } from "@/helpers/capitalizeString";

import { ContractStorageResponseItem, NetworkType } from "@/types/types";

export const ContractStorage = ({
  contractId,
  networkId,
  totalEntriesCount,
}: {
  contractId: string;
  networkId: NetworkType;
  totalEntriesCount: number | undefined;
}) => {
  const {
    data: storageData,
    error: storageError,
    isLoading: isStorageLoading,
    isFetching: isStorageFetching,
  } = useSEContractStorage({
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
        No version history
      </Text>
    );
  }

  const formatScv = (xdrString: string) => {
    // TODO: handle formatting
    try {
      const scv = xdr.ScVal.fromXDR(xdrString, "base64");

      // TODO: handle instance
      const res = scValToNative(scv);

      if (typeof res === "object") {
        return stringify(res);
      }

      return res;
    } catch (e: any) {
      return xdrString;
    }
  };

  return (
    <DataTable
      tableId="contract-version-history"
      tableData={storageData}
      tableHeaders={[
        { id: "key", value: "Key", isSortable: false },
        { id: "value", value: "Value", isSortable: false },
        { id: "durability", value: "Durability", isSortable: true },
        { id: "ttl", value: "TTL", isSortable: true },
        { id: "updated", value: "Updated", isSortable: true },
      ]}
      formatDataRow={(vh: ContractStorageResponseItem) => [
        { value: <div>{formatScv(vh.key)}</div> },
        { value: <div>{formatScv(vh.value)}</div> },
        { value: capitalizeString(vh.durability) },
        { value: formatNumber(vh.ttl) },
        { value: formatEpochToDate(vh.updated, "short") || "-" },
      ]}
      cssGridTemplateColumns="minmax(210px, 2fr) minmax(210px, 2fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(210px, 1fr)"
    />
  );
};
