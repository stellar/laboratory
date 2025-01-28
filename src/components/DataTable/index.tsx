import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Icon,
  Label,
  Loader,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { Dropdown } from "@/components/Dropdown";
import { processContractStorageData } from "@/helpers/processContractStorageData";

import {
  AnyObject,
  ContractStorageProcessedItem,
  DataTableCell,
  DataTableHeader,
  SortDirection,
} from "@/types/types";

import "./styles.scss";

export const DataTable = <T extends AnyObject>({
  tableId,
  cssGridTemplateColumns,
  tableHeaders,
  tableData,
  formatDataRow,
  customFooterEl,
}: {
  tableId: string;
  cssGridTemplateColumns: string;
  tableHeaders: DataTableHeader[];
  tableData: T[];
  formatDataRow: (item: T) => DataTableCell[];
  customFooterEl?: React.ReactNode;
}) => {
  const PAGE_SIZE = 20;

  // Data
  const [processedData, setProcessedData] = useState<
    ContractStorageProcessedItem<T>[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sort by
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

  useEffect(() => {
    const data = processContractStorageData({
      data: tableData,
      sortById,
      sortByDir,
      filters: appliedFilters,
    });

    setProcessedData(data);
  }, [tableData, sortByDir, sortById, appliedFilters]);

  // Hide loader when processed data is done
  useEffect(() => {
    setIsUpdating(false);
    setTotalPageCount(Math.ceil(processedData.length / PAGE_SIZE));
  }, [processedData]);

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
    setIsUpdating(true);
  };

  const toggleFilterDropdown = (headerId: FilterCols) => {
    setVisibleFilters(visibleFilters === headerId ? undefined : headerId);
  };

  const paginateData = (data: DataTableCell[][]): DataTableCell[][] => {
    if (!data || data.length === 0) {
      return [];
    }

    const startIndex = Math.max(currentPage - 1, 0) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

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

  const renderFilterDropdown = (
    headerId: string,
    filters: string[] | undefined,
  ) => {
    if (filters && filters.length > 0) {
      return (
        <Dropdown
          addlClassName="DataTable__filterDropdown"
          isDropdownVisible={visibleFilters === headerId}
          onClose={() => {
            setVisibleFilters(undefined);
          }}
          triggerDataAttribute="filter"
        >
          <div className="DataTable__filterDropdown__container">
            <div className="DataTable__filterDropdown__title">Filter by</div>
            <div>
              {filters.map((f) => {
                const id = `filter-${headerId}-${f}`;
                let currentFilters = selectedFilters[headerId] || [];

                return (
                  <div key={id} className="DataTable__filterDropdown__filter">
                    <Label size="sm" htmlFor={id}>
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
            <div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setAppliedFilters(selectedFilters);
                  setVisibleFilters(undefined);
                }}
                disabled={isFilterApplyDisabled(headerId)}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="error"
                onClick={() => {
                  setSelectedFilters({ ...selectedFilters, [headerId]: [] });
                  setAppliedFilters({ ...appliedFilters, [headerId]: [] });
                  setVisibleFilters(undefined);
                }}
                disabled={appliedFilters[headerId].length === 0}
              >
                Clear filter
              </Button>
            </div>
          </div>
        </Dropdown>
      );
    }

    return null;
  };

  const renderFilterBadges = () => {
    return Object.entries(appliedFilters).map((af) => {
      const [id, filters] = af;

      return (
        <>
          {filters.map((f) => (
            <div
              key={`badge-${id}-${f}`}
              className="DataTable__badge Badge Badge--secondary Badge--sm"
            >
              {f}

              <div
                role="button"
                className="DataTable__badge__button"
                onClick={() => {
                  const idFilters = appliedFilters[id].filter((c) => c !== f);
                  const updatedFilters = { ...appliedFilters, [id]: idFilters };

                  // Update both selected and applied filters
                  setSelectedFilters(updatedFilters);
                  setAppliedFilters(updatedFilters);
                }}
              >
                <Icon.XClose />
              </div>
            </div>
          ))}
        </>
      );
    });
  };

  const customStyle = {
    "--DataTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  const displayData = paginateData(processedData.map(formatDataRow));

  return (
    <Box gap="md">
      <Box gap="sm" direction="row" align="center" justify="space-between">
        <Box gap="sm" direction="row" align="center">
          {/* Applied filter badges */}
          {renderFilterBadges()}
        </Box>
      </Box>

      {/* Table */}
      <Card noPadding={true}>
        <div className="DataTable__container">
          {isUpdating ? <Loader /> : null}
          <div className="DataTable__scroll">
            <table
              className="DataTable__table"
              style={customStyle}
              data-testid={`${tableId}-table`}
              data-disabled={isUpdating}
            >
              <thead>
                <tr data-style="row" role="row">
                  {tableHeaders.map((th) => (
                    <th key={`col-${th.id}`} role="cell">
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
                        {th.filter ? (
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
              <tbody>
                {displayData.map((row, rowIdx) => {
                  const rowKey = `${tableId}-row-${rowIdx}`;

                  return (
                    <tr data-style="row" role="row" key={rowKey}>
                      {row.map((cell, cellIdx) => (
                        <td
                          key={`${rowKey}-cell-${cellIdx}`}
                          title={
                            typeof cell.value === "string"
                              ? cell.value
                              : undefined
                          }
                          role="cell"
                          {...(cell.isBold ? { "data-style": "bold" } : {})}
                        >
                          {cell.value}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Box gap="lg" direction="row" align="center" justify="space-between">
        <div>{customFooterEl || null}</div>

        {/* Pagination */}
        <Box gap="xs" direction="row" align="center">
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

          <Button
            variant="tertiary"
            size="sm"
            icon={<Icon.ArrowLeft />}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 1}
          ></Button>

          <div className="DataTable__pagination">{`Page ${currentPage} of ${totalPageCount}`}</div>

          <Button
            variant="tertiary"
            size="sm"
            icon={<Icon.ArrowRight />}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPageCount}
          ></Button>

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
        </Box>
      </Box>
    </Box>
  );
};
