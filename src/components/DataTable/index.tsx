import { useEffect, useState } from "react";
import { Button, Card, Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { DataTableCell, DataTableHeader, SortDirection } from "@/types/types";

import "./styles.scss";

export const DataTable = <T,>({
  tableId,
  cssGridTemplateColumns,
  tableHeaders,
  tableData,
  formatDataRow,
}: {
  tableId: string;
  cssGridTemplateColumns: string;
  tableHeaders: DataTableHeader[];
  tableData: T[];
  formatDataRow: (item: T) => DataTableCell[];
}) => {
  const PAGE_SIZE = 10;
  const tableDataSize = tableData.length;

  // Sort by
  const [sortById, setSortById] = useState("");
  const [sortByDir, setSortByDir] = useState<SortDirection>("default");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);

  useEffect(() => {
    setTotalPageCount(Math.ceil(tableDataSize / PAGE_SIZE));
  }, [tableDataSize]);

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
  };

  const tableRowsData = (): DataTableCell[][] => {
    let sortedData = [...tableData];

    // Sort
    if (sortById) {
      if (["asc", "desc"].includes(sortByDir)) {
        // Asc
        sortedData = sortedData.sort((a: any, b: any) =>
          a[sortById] > b[sortById] ? 1 : -1,
        );

        // Desc
        if (sortByDir === "desc") {
          sortedData = sortedData.reverse();
        }
      }
    }

    return sortedData.map(formatDataRow);
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

  const displayData = paginateData(tableRowsData());

  return (
    <Box gap="md">
      {/* Table */}
      <Card noPadding={true}>
        <div className="DataTable__container">
          <div className="DataTable__scroll">
            <table
              className="DataTable__table"
              style={customStyle}
              data-testid={`${tableId}-table`}
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

      <Box gap="lg" direction="row" align="center" justify="end">
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
