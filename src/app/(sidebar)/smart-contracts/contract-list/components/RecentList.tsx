"use client";

import { useState } from "react";
import { Button, Icon, Link, Loader, Text } from "@stellar/design-system";
import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { MessageField } from "@/components/MessageField";
import { DataTable } from "@/components/DataTable";
import { PoweredByStellarExpert } from "@/components/PoweredByStellarExpert";

import { Routes } from "@/constants/routes";
import {
  getSEContractsPrefixCursor,
  SE_CONTRACTS_LIST_PAGE_SIZE,
  useSEContractsList,
} from "@/query/external/useSEContractsList";
import { useStore } from "@/store/useStore";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { delayedAction } from "@/helpers/delayedAction";
import { getContractIdError } from "@/validate/methods/getContractIdError";

import { ContractListRecord, SortDirection } from "@/types/types";

type RecentListProps = {
  /** Contract ID prefix to search for across the whole list */
  searchValue?: string;
};

/** Contract IDs are base32: A–Z and 2–7 */
const CONTRACT_ID_CHARS = /^[A-Z2-7]+$/;

export const RecentList = ({ searchValue = "" }: RecentListProps) => {
  const { network, smartContracts } = useStore();
  const router = useRouter();

  const [sortDir, setSortDir] = useState<SortDirection>("default");
  // Cursors of the pages visited so far, so Previous goes back to exactly
  // the page that was shown (the API's prev link flips the order, which
  // doesn't fit a list read in one direction). Paging belongs to the query
  // it was done for: a new query starts over.
  const [paging, setPaging] = useState<{
    query: string;
    cursors: string[];
  }>({ query: "", cursors: [] });

  const trimmedQuery = searchValue.trim();
  const prefix = trimmedQuery.toUpperCase();
  const isSearching = Boolean(prefix);
  const isValidPrefix = CONTRACT_ID_CHARS.test(prefix);
  const order = sortDir === "default" ? "desc" : sortDir;

  const visitedCursors = paging.query === prefix ? paging.cursors : [];
  const currentCursor = visitedCursors[visitedCursors.length - 1] || "";
  const currentPage = visitedCursors.length + 1;

  // The list is ordered by contract ID, so a search jumps the cursor to the
  // first ID with that prefix and pages on from there
  const cursor =
    currentCursor ||
    (isSearching ? getSEContractsPrefixCursor(prefix, order) : "");

  const {
    data: listData,
    error: listError,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useSEContractsList({
    networkId: network.id,
    cursor,
    order,
    enabled: !isSearching || isValidPrefix,
  });

  const goToNextPage = (nextCursor: string) => {
    setPaging({ query: prefix, cursors: [...visitedCursors, nextCursor] });
  };

  const goToPrevPage = () => {
    setPaging({ query: prefix, cursors: visitedCursors.slice(0, -1) });
  };

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
    // Can't be the start of a contract ID: nothing to look up
    if (isSearching && !isValidPrefix) {
      return (
        <Text size="sm" as="p" addlClassName="ContractList__emptyMessage">
          No contracts match your search
        </Text>
      );
    }

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

    // The page starts at the prefix; once an ID without it shows up, the
    // rest of the list is past the matches
    const records = isSearching
      ? listData.records.filter((r: ContractListRecord) =>
          r.contract.startsWith(prefix),
        )
      : listData.records;

    // The API keeps returning a next link on the last page; a short page
    // (or one that ran past the prefix) means there is nothing after it
    const isLastPage =
      !listData.nextCursor ||
      listData.records.length < SE_CONTRACTS_LIST_PAGE_SIZE ||
      records.length < listData.records.length;

    // No matches: just the message, no table chrome
    if (isSearching && records.length === 0) {
      return (
        <Text size="sm" as="p" addlClassName="ContractList__emptyMessage">
          No contracts match your search
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
        emptyMessage="No contracts match your search"
        isExternalUpdating={isListLoading || isListFetching}
        // Nothing to page through when everything fits on the first page
        hidePagination={currentPage === 1 && isLastPage}
        pageNavConfig={{
          prev: {
            onClick: goToPrevPage,
            disabled: currentPage === 1 || isListLoading || isListFetching,
          },
          next: {
            onClick: () => {
              if (listData?.nextCursor) {
                goToNextPage(listData.nextCursor);
              }
            },
            disabled: isLastPage || isListLoading || isListFetching,
          },
        }}
        externalSort={(sortDir) => {
          setPaging({ query: prefix, cursors: [] });
          setSortDir(sortDir);
        }}
        customFooterEl={<PoweredByStellarExpert />}
      />
    );
  };

  return <Box gap="lg">{renderContent()}</Box>;
};
