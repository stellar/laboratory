import { useState } from "react";
import { Card, Icon, Loader, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { useSEContracVersionHistory } from "@/query/external/useSEContracVersionHistory";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";

import { NetworkType } from "@/types/types";

export const VersionHistory = ({
  contractId,
  networkId,
}: {
  contractId: string;
  networkId: NetworkType;
}) => {
  type SortDirection = "default" | "asc" | "desc";

  const [sortById, setSortById] = useState("");
  const [sortByDir, setSortByDir] = useState<SortDirection>("default");

  const {
    data: versionHistoryData,
    error: versionHistoryError,
    isLoading: isVersionHistoryLoading,
    isFetching: isVersionHistoryFetching,
  } = useSEContracVersionHistory({
    networkId,
    contractId,
  });

  if (isVersionHistoryLoading || isVersionHistoryFetching) {
    return (
      <Box gap="sm" direction="row" justify="center">
        <Loader />
      </Box>
    );
  }

  if (versionHistoryError) {
    return (
      <ErrorText errorMessage={versionHistoryError.toString()} size="sm" />
    );
  }

  if (!versionHistoryData) {
    return (
      <Text as="div" size="sm">
        No version history
      </Text>
    );
  }

  type TableHeader = {
    id: string;
    value: string;
    isSortable?: boolean;
  };

  const tableId = "contract-version-history";
  const cssGridTemplateColumns = "minmax(210px, 2fr) minmax(210px, 1fr)";
  const tableHeaders: TableHeader[] = [
    { id: "wasm", value: "Contract WASM Hash", isSortable: true },
    { id: "ts", value: "Updated", isSortable: true },
  ];

  type TableCell = {
    value: string;
    isBold?: boolean;
  };

  const tableRowsData = (): TableCell[][] => {
    let sortedData = [...versionHistoryData];

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

    return sortedData.map((vh) => [
      { value: vh.wasm, isBold: true },
      { value: formatEpochToDate(vh.ts, "short") || "-" },
    ]);
  };

  const customStyle = {
    "--LabTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  const getSortByProps = (th: TableHeader) => {
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

  return (
    <Box gap="md">
      <Card noPadding={true}>
        <div className="LabTable__container">
          <div className="LabTable__scroll">
            <table className="LabTable__table" style={customStyle}>
              <thead>
                <tr data-style="row" role="row">
                  {tableHeaders.map((th) => (
                    <th key={th.id} role="cell" {...getSortByProps(th)}>
                      {th.value}
                      {th.isSortable ? (
                        <span className="LabTable__sortBy">
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
                          title={cell.value}
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
