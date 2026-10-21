"use client";

import { useState } from "react";
import { Button, Icon, Link, Loader, Text } from "@stellar/design-system";
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
import { getContractIdError } from "@/validate/methods/getContractIdError";

import { ContractListRecord, SortDirection } from "@/types/types";

type RecentListProps = {
  /** Free-text search, matched against contract ID (current page only) */
  searchValue?: string;
};

export const RecentList = ({ searchValue = "" }: RecentListProps) => {
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

    const trimmedQuery = searchValue.trim();
    const query = trimmedQuery.toLowerCase();

    // The list API has no search, so a full contract ID is a direct jump to
    // the explorer (e.g. a contract the user just deployed) — the list only
    // shows one page at a time
    const isContractId =
      Boolean(trimmedQuery) && !getContractIdError(trimmedQuery.toUpperCase());

    if (isContractId) {
      const contractId = trimmedQuery.toUpperCase();

      return (
        <Box
          gap="md"
          direction="row"
          align="center"
          justify="space-between"
          addlClassName="RecentList__jumpTo"
        >
          <Link
            addlClassName="ContractLink--withIcon"
            onClick={() => handleNavigateToContractExplorer(contractId)}
          >
            {contractId}
          </Link>

          <Button
            size="sm"
            variant="tertiary"
            icon={<Icon.ArrowRight />}
            iconPosition="right"
            onClick={() => handleNavigateToContractExplorer(contractId)}
          >
            Open in Contract explorer
          </Button>
        </Box>
      );
    }

    const records = query
      ? listData.records.filter((r: ContractListRecord) =>
          r.contract.toLowerCase().includes(query),
        )
      : listData.records;

    // No matches: just the message, no table chrome
    if (query && records.length === 0) {
      return (
        <Text size="sm" as="p" addlClassName="ContractList__emptyMessage">
          No matches on this page.
        </Text>
      );
    }

    return (
      <DataTable
        tableId="recent-contracts-list"
        tableData={records}
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
        isOutlined={true}
        emptyMessage="No matches on this page."
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
        customFooterEl={<PoweredByStellarExpert />}
      />
    );
  };

  return <Box gap="lg">{renderContent()}</Box>;
};
