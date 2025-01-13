import { useState } from "react";
import { Card, Icon } from "@stellar/design-system";
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
  const [sortById, setSortById] = useState("");
  const [sortByDir, setSortByDir] = useState<SortDirection>("default");

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
  };

  const tableRowsData = (): DataTableCell[][] => {
    let sortedData = [...tableData];

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

  const customStyle = {
    "--DataTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  return (
    <Box gap="md">
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
                {tableRowsData().map((row, rowIdx) => {
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
    </Box>
  );
};
