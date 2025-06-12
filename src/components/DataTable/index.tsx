import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Icon,
  Label,
  Loader,
} from "@stellar/design-system";
import { stringify } from "lossless-json";

import { Box } from "@/components/layout/Box";
import { Dropdown } from "@/components/Dropdown";

import { processContractStorageData } from "@/helpers/processContractStorageData";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { exportJsonToCsvFile } from "@/helpers/exportJsonToCsvFile";
import { capitalizeString } from "@/helpers/capitalizeString";
import { formatNumber } from "@/helpers/formatNumber";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";

import { getPublicKeyError } from "@/validate/methods/getPublicKeyError";
import { getContractIdError } from "@/validate/methods/getContractIdError";

import {
  AnyObject,
  ContractStorageProcessedItem,
  DataTableCell,
  DataTableHeader,
  SortDirection,
} from "@/types/types";

import "./styles.scss";

type DataTableProps<T> = {
  tableId: string;
  cssGridTemplateColumns: string;
  tableHeaders: DataTableHeader[];
  tableData: T[];
  emptyMessage?: string;
  formatDataRow: (item: T) => DataTableCell[];
  customHeaderEl?: React.ReactNode;
  customFooterEl?: React.ReactNode;
  csvFileName?: string;
  hideFirstLastPageNav?: boolean;
  hidePageCount?: boolean;
  pageSize?: number;
  pageNavConfig?: Record<
    "prev" | "next",
    {
      onClick: () => void;
      disabled?: boolean;
    }
  >;
  isExternalUpdating?: boolean;
  externalSort?: (sortDirection: SortDirection) => void;
};

export const DataTable = <T extends AnyObject>({
  tableId,
  cssGridTemplateColumns,
  tableHeaders,
  tableData,
  formatDataRow,
  customHeaderEl,
  customFooterEl,
  csvFileName,
  hideFirstLastPageNav = false,
  hidePageCount = false,
  pageNavConfig,
  isExternalUpdating = false,
  externalSort,
  pageSize = 20,
  emptyMessage,
}: DataTableProps<T>) => {
  // Data
  const [processedData, setProcessedData] = useState<
    ContractStorageProcessedItem<T>[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sort by
  const hasExternalSort = Boolean(externalSort);
  const [sortById, setSortById] = useState("");
  const [sortByDir, setSortByDir] = useState<SortDirection>("default");

  // Filters
  type FilterCols = "key" | "value";
  type DataFilters = { [key: string]: string[] };

  const INIT_FILTERS = { key: [], value: [] };

  const [visibleFilters, setVisibleFilters] = useState<FilterCols | undefined>(
    undefined,
  );
  const [selectedFilters, setSelectedFilters] =
    useState<DataFilters>(INIT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<DataFilters>(INIT_FILTERS);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);

  const hasAppliedFilters =
    appliedFilters.key.length > 0 || appliedFilters.value.length > 0;

  useEffect(() => {
    const data = processContractStorageData({
      data: tableData,
      sortById: hasExternalSort ? undefined : sortById,
      sortByDir: hasExternalSort ? "default" : sortByDir,
      filters: appliedFilters,
    });

    setProcessedData(data);
  }, [hasExternalSort, tableData, sortByDir, sortById, appliedFilters]);

  // Hide loader when processed data is done
  useEffect(() => {
    setIsUpdating(false);
    setTotalPageCount(Math.ceil(processedData.length / pageSize));
  }, [processedData, pageSize]);

  const getCustomProps = (th: DataTableHeader) => {
    if (th.isSortable) {
      return {
        "data-sortby-dir": sortById === th.id ? sortByDir : "default",
        onClick: () => handleSort(th.id),
      };
    }

    if (th.filter && th.filter.length > 0) {
      return {
        "data-filter": "true",
        onClick: () => toggleFilterDropdown(th.id as FilterCols),
      };
    }

    return {};
  };

  const handleSort = (headerId: string) => {
    let sortDir: SortDirection;

    // Sorting by new id
    if (sortById && headerId !== sortById) {
      sortDir = "asc";
    } else {
      // Sorting the same id
      if (sortByDir === "default") {
        sortDir = "asc";
      } else if (sortByDir === "asc") {
        sortDir = "desc";
      } else {
        // from descending
        sortDir = "default";
      }
    }

    setSortById(headerId);
    setSortByDir(sortDir);
    setCurrentPage(1);

    if (externalSort) {
      externalSort(sortDir);
    } else {
      setIsUpdating(true);
    }
  };

  const closeFilterDropdown = () => {
    setVisibleFilters(undefined);
    // Clear selections that weren't applied
    setSelectedFilters({ ...appliedFilters });
  };

  const toggleFilterDropdown = (headerId: FilterCols) => {
    if (visibleFilters === headerId) {
      closeFilterDropdown();
    } else {
      setVisibleFilters(headerId);
    }
  };

  const paginateData = (data: DataTableCell[][]): DataTableCell[][] => {
    if (!data || data.length === 0) {
      return [];
    }

    const startIndex = Math.max(currentPage - 1, 0) * pageSize;
    const endIndex = startIndex + pageSize;

    return data.slice(startIndex, endIndex);
  };

  const isFilterApplyDisabled = (headerId: string) => {
    const selected = selectedFilters[headerId];
    const applied = appliedFilters[headerId];

    // Both filters are empty
    if (selected.length === 0 && applied.length === 0) {
      return true;
    }

    // Different array sizes
    if (selected.length !== applied.length) {
      return false;
    }

    // The array sizes are equal, need to check if items are the same
    return (
      selected.reduce((res: string[], cur) => {
        if (!applied.includes(cur)) {
          return [...res, cur];
        }

        return res;
      }, []).length === 0
    );
  };

  const handleExportToCsv = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    format: "xdr" | "json",
  ) => {
    event.preventDefault();

    if (csvFileName) {
      let fileData;

      if (format === "xdr") {
        fileData = processedData.map((item) => {
          // Removing decoded key and value attributes
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { keyJson, valueJson, ...rest } = item;

          return rest;
        });
      }

      if (format === "json") {
        fileData = processedData.map((p) => ({
          key: stringify(p.keyJson),
          value: stringify(p.valueJson),
          durability: capitalizeString(p.durability),
          ttl: formatNumber(p.ttl),
          updated: formatEpochToDate(p.updated, "short") || "-",
        }));
      }

      if (!fileData) {
        return;
      }

      exportJsonToCsvFile(fileData, `${csvFileName}-${Date.now()}`);
    }
  };

  const renderFilterDropdown = (
    headerId: string,
    filters: string[] | undefined,
  ) => {
    if (filters && filters.length > 0) {
      return (
        <Dropdown
          addlClassName="DataTable__filterDropdown"
          isDropdownVisible={visibleFilters === headerId}
          onClose={closeFilterDropdown}
          triggerDataAttribute="filter"
          testId={`data-table-filters-${headerId}`}
        >
          <div className="DataTable__filterDropdown__container">
            <div className="DataTable__filterDropdown__title">Filter by</div>
            <div className="DataTable__filterDropdown__filterContainer">
              {filters.map((f, idx) => {
                const id = `filter-${headerId}-${f}-${idx}`;
                let currentFilters = selectedFilters[headerId] || [];

                return (
                  <div key={id} className="DataTable__filterDropdown__filter">
                    <Label size="lg" htmlFor={id} title={f}>
                      {f}
                    </Label>
                    <Checkbox
                      id={id}
                      fieldSize="sm"
                      onChange={() => {
                        if (currentFilters.includes(f)) {
                          currentFilters = currentFilters.filter(
                            (c) => c !== f,
                          );
                        } else {
                          currentFilters = [...currentFilters, f];
                        }

                        setSelectedFilters({
                          ...selectedFilters,
                          [headerId]: currentFilters,
                        });
                      }}
                      checked={currentFilters.includes(f)}
                    />
                  </div>
                );
              })}
            </div>
            <Box
              gap="sm"
              direction="row"
              align="center"
              justify="space-between"
              addlClassName="DataTable__filterDropdown__buttons"
            >
              <Button
                size="sm"
                variant="error"
                onClick={() => {
                  setSelectedFilters({ ...selectedFilters, [headerId]: [] });
                  setAppliedFilters({ ...appliedFilters, [headerId]: [] });

                  setVisibleFilters(undefined);
                  setCurrentPage(1);
                }}
                disabled={appliedFilters[headerId].length === 0}
              >
                Clear filter
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setAppliedFilters(selectedFilters);

                  setVisibleFilters(undefined);
                  setCurrentPage(1);
                }}
                disabled={isFilterApplyDisabled(headerId)}
              >
                Apply
              </Button>
            </Box>
          </div>
        </Dropdown>
      );
    }

    return null;
  };

  const renderFilterBadgeLabel = (label: string) => {
    const isValidPubKey = !getPublicKeyError(label);
    const isValidContractId = !getContractIdError(label);

    // Stellar public key or contract ID
    if (isValidPubKey || isValidContractId) {
      return shortenStellarAddress(label);
    }

    return label;
  };

  const renderFilterBadges = () => {
    return Object.entries(appliedFilters).map((af, afIdx) => {
      const [id, filters] = af;

      return (
        <Fragment key={`badge-${id}-${afIdx}`}>
          {filters.map((f, fIdx) => (
            <div
              key={`badge-${id}-${afIdx}-${f}-${fIdx}`}
              className="DataTable__badge Badge Badge--secondary Badge--sm"
              data-testid="data-table-filter-badge"
            >
              {renderFilterBadgeLabel(f)}

              <div
                role="button"
                className="DataTable__badge__button"
                onClick={() => {
                  const idFilters = appliedFilters[id].filter((c) => c !== f);
                  const updatedFilters = { ...appliedFilters, [id]: idFilters };

                  // Update both selected and applied filters
                  setSelectedFilters(updatedFilters);
                  setAppliedFilters(updatedFilters);

                  setCurrentPage(1);
                }}
              >
                <Icon.XClose />
              </div>
            </div>
          ))}
        </Fragment>
      );
    });
  };

  const renderFilteredResultCount = () => {
    // No filters applied
    if (appliedFilters.key.length === 0 && appliedFilters.value.length === 0) {
      return null;
    }

    const resultCount = processedData.length;

    if (resultCount === 0) {
      return null;
    }

    return (
      <div
        className="DataTable__filteredResultCount"
        data-testid="data-table-filter-results-text"
      >{`${resultCount} filtered ${resultCount === 1 ? "result" : "results"}`}</div>
    );
  };

  const customStyle = {
    "--DataTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  const displayData = paginateData(processedData.map(formatDataRow));

  const renderTableBody = () => {
    if (!displayData.length) {
      const message = hasAppliedFilters
        ? "There are no items matching selected filters"
        : emptyMessage || "There are no contract storage items";

      return (
        <tr data-style="emptyMessage">
          <td colSpan={tableHeaders.length}>{message}</td>
        </tr>
      );
    }

    return displayData.map((row, rowIdx) => {
      const rowKey = `${tableId}-row-${rowIdx}`;

      return (
        <tr data-style="row" role="row" key={rowKey}>
          {row.map((cell, cellIdx) => (
            <td
              key={`${rowKey}-cell-${cellIdx}`}
              title={typeof cell.value === "string" ? cell.value : undefined}
              role="cell"
              {...(cell.isBold ? { "data-style": "bold" } : {})}
              {...(cell.isWrap ? { "data-wrap": "true" } : {})}
              {...(cell.isOverflow ? { "data-overflow": "true" } : {})}
            >
              {cell.value}
            </td>
          ))}
        </tr>
      );
    });
  };

  return (
    <Box gap="md">
      {/* Header */}
      <Box
        gap="sm"
        direction="row"
        align="end"
        justify="space-between"
        wrap="wrap"
      >
        {customHeaderEl ?? <div></div>}

        <Box
          gap="sm"
          direction="row"
          wrap="wrap"
          addlClassName="DataTable__actionButtons"
        >
          <>
            {csvFileName ? (
              <>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Icon.Download01 />}
                  iconPosition="left"
                  onClick={(e) => handleExportToCsv(e, "xdr")}
                >
                  Export in XDR
                </Button>

                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Icon.Download01 />}
                  iconPosition="left"
                  onClick={(e) => handleExportToCsv(e, "json")}
                >
                  Export in JSON
                </Button>
              </>
            ) : null}
          </>
        </Box>
      </Box>

      {/* Filters */}
      {hasAppliedFilters ? (
        <Box
          gap="md"
          direction="row"
          align="start"
          justify="space-between"
          addlClassName="DataTable__filters"
        >
          <Box gap="sm" direction="row" align="center" wrap="wrap">
            {/* Applied filter badges */}
            {renderFilterBadges()}
          </Box>

          <Button
            variant="error"
            size="sm"
            onClick={() => {
              setSelectedFilters(INIT_FILTERS);
              setAppliedFilters(INIT_FILTERS);

              setVisibleFilters(undefined);
              setCurrentPage(1);
            }}
          >
            Clear filters
          </Button>
        </Box>
      ) : null}

      {/* Table */}
      <Card noPadding={true}>
        <div className="DataTable__container">
          {isUpdating || isExternalUpdating ? <Loader /> : null}
          <div className="DataTable__scroll">
            <table
              className="DataTable__table"
              style={customStyle}
              data-testid={`${tableId}-table`}
              data-disabled={isUpdating || isExternalUpdating}
            >
              <thead>
                <tr data-style="row" role="row">
                  {tableHeaders.map((th, idx) => (
                    <th key={`col-${idx}-${th.id}`} role="cell">
                      <div {...getCustomProps(th)}>
                        {th.value}

                        {/* Sort icon */}
                        {th.isSortable ? (
                          <span className="DataTable__sortBy">
                            <Icon.ChevronUp />
                            <Icon.ChevronDown />
                          </span>
                        ) : null}

                        {/* Filter icon */}
                        {th.filter?.length ? (
                          <span className="DataTable__filter">
                            <Icon.FilterFunnel01 />
                          </span>
                        ) : null}
                      </div>

                      {renderFilterDropdown(th.id, th.filter)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        </div>
      </Card>

      <Box
        gap="lg"
        direction="row"
        align="center"
        justify="space-between"
        wrap="wrap"
      >
        <div>{customFooterEl || null}</div>

        {/* Pagination */}
        <Box gap="md" direction="row" align="center" wrap="wrap">
          <Box gap="xs" direction="row" align="center">
            <>{renderFilteredResultCount()}</>
          </Box>

          <Box gap="xs" direction="row" align="center">
            {/* First page */}
            {hideFirstLastPageNav ? (
              <></>
            ) : (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setCurrentPage(1);
                }}
                disabled={currentPage === 1}
              >
                First
              </Button>
            )}

            {/* Previous page */}
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowLeft />}
              onClick={() => {
                if (pageNavConfig?.prev.onClick) {
                  pageNavConfig.prev.onClick();
                } else {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={
                pageNavConfig?.prev.disabled !== undefined
                  ? pageNavConfig.prev.disabled
                  : currentPage === 1
              }
            ></Button>

            {/* Page count */}
            {hidePageCount ? (
              <></>
            ) : (
              <div className="DataTable__pagination">{`Page ${currentPage} of ${totalPageCount}`}</div>
            )}

            {/* Next page */}
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowRight />}
              onClick={() => {
                if (pageNavConfig?.next.onClick) {
                  pageNavConfig.next.onClick();
                } else {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={
                pageNavConfig?.next.disabled !== undefined
                  ? pageNavConfig.next.disabled
                  : currentPage === totalPageCount
              }
            ></Button>

            {/* Last page */}
            {hideFirstLastPageNav ? (
              <></>
            ) : (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  setCurrentPage(totalPageCount);
                }}
                disabled={currentPage === totalPageCount}
              >
                Last
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
