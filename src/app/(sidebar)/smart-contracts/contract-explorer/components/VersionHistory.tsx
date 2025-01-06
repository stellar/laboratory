import { Card, Loader, Text } from "@stellar/design-system";
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
  };

  const tableId = "contract-version-history";
  const cssGridTemplateColumns = "minmax(210px, 2fr) minmax(210px, 1fr)";
  const tableHeaders: TableHeader[] = [
    { id: "contract-wasm-hash", value: "Contract WASM Hash" },
    { id: "contract-updated", value: "Updated" },
  ];

  type TableRow = {
    value: string;
    isBold?: boolean;
  };

  const tableRows: TableRow[][] = versionHistoryData.map((vh) => [
    { value: vh.wasm, isBold: true },
    { value: formatEpochToDate(vh.ts, "short") || "-" },
  ]);

  const customStyle = {
    "--LabTable-grid-template-columns": cssGridTemplateColumns,
  } as React.CSSProperties;

  return (
    <Box gap="md">
      <Card noPadding={true}>
        <div className="LabTable__container">
          <div className="LabTable__scroll">
            <table className="LabTable__table" style={customStyle}>
              <thead>
                <tr data-style="row" role="row">
                  {tableHeaders.map((th) => (
                    <th key={th.id} role="cell">
                      {th.value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIdx) => {
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
