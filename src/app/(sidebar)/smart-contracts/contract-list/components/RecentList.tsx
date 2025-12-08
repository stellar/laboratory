"use client";

import { useState } from "react";
import { Link, Loader } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { DataTable } from "@/components/DataTable";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { Routes } from "@/constants/routes";
import { useSEContractsList } from "@/query/external/useSEContractsList";
import { useStore } from "@/store/useStore";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { delayedAction } from "@/helpers/delayedAction";

import { ContractListRecord, SortDirection } from "@/types/types";

export const RecentList = () => {
  const { network, smartContracts } = useStore();
  const router = useRouter();

  const [currentCursor, setCurrentCursor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortDir, setSortDir] = useState<SortDirection>("default");

  const {
    data: listData,
    error: listError,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: fetchListData,
  } = useSEContractsList({
    networkId: network.id,
    cursor: currentCursor,
    order: sortDir === "default" ? undefined : sortDir,
  });

  const handleNavigateToContractExplorer = (contractId: string) => {
    smartContracts.updateExplorerContractId(contractId);

    delayedAction({
      action: () => {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });
  };

  const renderContent = () => {
    if (!listData) {
      return (
        <Box gap="sm" align="center" justify="center">
          <Loader />
        </Box>
      );
    }

    if (listError) {
      <MessageField message={listError.toString()} isError={true} />;
    }

    return (
      <DataTable
        tableId="recent-contracts-list"
        tableData={listData.records}
        tableHeaders={[
          { id: "contract", value: "Contract ID", isSortable: false },
          {
            id: "create-timestamp",
            value: "Created Timestamp",
            isSortable: true,
          },
        ]}
        formatDataRow={(r: ContractListRecord) => [
          {
            value: (
              <Link
                addlClassName="ContractLink--withIcon"
                onClick={() => handleNavigateToContractExplorer(r.contract)}
              >
                {r.contract}
              </Link>
            ),
          },
          { value: formatEpochToDate(r.created, "short") || "-" },
        ]}
        cssGridTemplateColumns="minmax(210px, 3fr) minmax(210px, 1fr)"
        hideFirstLastPageNav={true}
        hidePageCount={true}
        isExternalUpdating={isListLoading || isListFetching}
        pageNavConfig={{
          prev: {
            onClick: () => {
              if (listData?.prevCursor) {
                setCurrentCursor(listData.prevCursor);
                setCurrentPage(Math.max(currentPage - 1, 1));
                fetchListData();
              }
            },
            disabled: currentPage === 1 || isListLoading || isListFetching,
          },
          next: {
            onClick: () => {
              if (listData?.nextCursor) {
                setCurrentCursor(listData.nextCursor);
                setCurrentPage(currentPage + 1);
                fetchListData();
              }
            },
            disabled: !listData?.nextCursor || isListLoading || isListFetching,
          },
        }}
        externalSort={(sortDir) => {
          setCurrentPage(1);
          setCurrentCursor("");
          setSortDir(sortDir);
        }}
      />
    );
  };

  return (
    <Box gap="lg">
      {renderContent()}

      <PoweredByStellarExpert />
    </Box>
  );
};
