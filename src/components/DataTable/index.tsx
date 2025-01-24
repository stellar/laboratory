import { useEffect, useState } from "react";
import { Button, Card, Icon, Loader } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
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
  const tableDataSize = tableData.length;

  // Data
  const [processedData, setProcessedData] = useState<
    ContractStorageProcessedItem<T>[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sort by
  const [sortById, setSortById] = useState("");
  const [sortByDir, setSortByDir] = useState<SortDirection>("default");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);

  useEffect(() => {
    const data = processContractStorageData({
      data: tableData,
      sortById,
      sortByDir,
    });

    setProcessedData(data);
  }, [tableData, sortByDir, sortById]);

  useEffect(() => {
    setTotalPageCount(Math.ceil(tableDataSize / PAGE_SIZE));
  }, [tableDataSize]);

  // Hide loader when processed data is done
  useEffect(() => {
    setIsUpdating(false);
  }, [processedData]);

  const getSortByProps = (th: DataTableHeader) => {
    if (th.isSortable) {
      return {
        "data-sortby-dir": sortById === th.id ? sortByDir : "default",
        onClick: () => handleSort(th.id),
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

  const paginateData = (data: DataTableCell[][]): DataTableCell[][] => {
    if (!data || data.length === 0) {
      return [];
    }

    const startIndex = Math.max(currentPage - 1, 0) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return data.slice(startIndex, endIndex);
  };

  const customStyle = {
    "--DataTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  const displayData = paginateData(processedData.map(formatDataRow));

  return (
    <Box gap="md">
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
                    <th key={th.id} role="cell" {...getSortByProps(th)}>
                      {th.value}
                      {th.isSortable ? (
                        <span className="DataTable__sortBy">
                          <Icon.ChevronUp />
                          <Icon.ChevronDown />
                        </span>
                      ) : null}
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
