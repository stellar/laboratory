import { Card, Text } from "@stellar/design-system";
import { xdr } from "@stellar/stellar-sdk";

import { GridTable, GridTableRow, GridTableCell } from "@/components/GridTable";
import { Box } from "@/components/layout/Box";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimulationResponse = Record<string, any>;

export type SimulationResourceInfo = {
  cpuInsns?: string;
  memBytes?: string;
  minResourceFee?: string;
  instructions?: number;
  readBytes?: number;
  writeBytes?: number;
  footprintKeysReadOnly?: number;
  footprintKeysReadWrite?: number;
  footprintKeysTotal?: number;
};

/**
 * Parse resource usage from a simulation response.
 * Extracts CPU, memory, footprint keys, ledger I/O, and min resource fee
 * from the RPC simulateTransaction result.
 *
 * @param simulateTxData - The raw simulation response from RPC
 * @returns Resource breakdown or null if no simulation data
 *
 * @example
 * const info = getSimulationResourceInfo(simulateTxData);
 * // { cpuInsns: "12345", memBytes: "678", footprintKeysReadOnly: 2, ... }
 */
export const getSimulationResourceInfo = (
  simulateTxData: SimulationResponse | undefined,
): SimulationResourceInfo | null => {
  try {
    if (!simulateTxData?.result) return null;

    const result = simulateTxData.result;
    const info: SimulationResourceInfo = {
      cpuInsns: result.cost?.cpuInsns,
      memBytes: result.cost?.memBytes,
      minResourceFee: result.minResourceFee,
    };

    // Extract footprint and ledger I/O from transactionData XDR
    const transactionData = result.transactionData as string | undefined;
    if (transactionData) {
      try {
        const sorobanData = xdr.SorobanTransactionData.fromXDR(
          transactionData,
          "base64",
        );
        const resources = sorobanData.resources();
        const footprint = resources.footprint();

        info.instructions = resources.instructions();
        info.readBytes = resources.diskReadBytes();
        info.writeBytes = resources.writeBytes();
        info.footprintKeysReadOnly = footprint.readOnly().length;
        info.footprintKeysReadWrite = footprint.readWrite().length;
        info.footprintKeysTotal =
          footprint.readOnly().length + footprint.readWrite().length;
      } catch {
        // transactionData parsing may fail for some responses
      }
    }

    return info;
  } catch {
    return null;
  }
};

/**
 * Displays simulation resource usage in a grid table.
 *
 * @param resourceInfo - Parsed resource data from getSimulationResourceInfo
 *
 * @example
 * <SimulationResourceTable resourceInfo={resourceInfo} />
 */
export const SimulationResourceTable = ({
  resourceInfo,
}: {
  resourceInfo: SimulationResourceInfo;
}) => (
  <Box gap="sm">
    <Text
      as="div"
      size="sm"
      weight="semi-bold"
      addlClassName="ResourceTable__header"
    >
      Resource usage
    </Text>
    <Card>
      <GridTable>
        <GridTableRow>
          <GridTableCell isHeader>
            <Text as="div" size="xs" weight="semi-bold">
              Resource
            </Text>
          </GridTableCell>
          <GridTableCell isHeader>
            <Text as="div" size="xs" weight="semi-bold">
              Value
            </Text>
          </GridTableCell>
        </GridTableRow>

        {resourceInfo.minResourceFee && (
          <GridTableRow>
            <GridTableCell isRowHeader>Min resource fee</GridTableCell>
            <GridTableCell>{resourceInfo.minResourceFee} stroops</GridTableCell>
          </GridTableRow>
        )}

        {(resourceInfo.cpuInsns || resourceInfo.memBytes) && (
          <GridTableRow isSectionHeader>CPU and memory</GridTableRow>
        )}

        {resourceInfo.cpuInsns && (
          <GridTableRow>
            <GridTableCell isRowHeader>CPU instructions</GridTableCell>
            <GridTableCell>{resourceInfo.cpuInsns}</GridTableCell>
          </GridTableRow>
        )}

        {resourceInfo.memBytes && (
          <GridTableRow>
            <GridTableCell isRowHeader>Memory bytes</GridTableCell>
            <GridTableCell>{resourceInfo.memBytes}</GridTableCell>
          </GridTableRow>
        )}

        {resourceInfo.footprintKeysReadOnly !== undefined && (
          <GridTableRow isSectionHeader>Footprint</GridTableRow>
        )}

        {resourceInfo.footprintKeysReadOnly !== undefined && (
          <GridTableRow>
            <GridTableCell isRowHeader>Footprint keys read only</GridTableCell>
            <GridTableCell>{resourceInfo.footprintKeysReadOnly}</GridTableCell>
          </GridTableRow>
        )}

        {resourceInfo.footprintKeysReadWrite !== undefined && (
          <GridTableRow>
            <GridTableCell isRowHeader>Footprint keys read write</GridTableCell>
            <GridTableCell>{resourceInfo.footprintKeysReadWrite}</GridTableCell>
          </GridTableRow>
        )}

        {resourceInfo.footprintKeysTotal !== undefined && (
          <GridTableRow>
            <GridTableCell isRowHeader>Footprint keys total</GridTableCell>
            <GridTableCell>{resourceInfo.footprintKeysTotal}</GridTableCell>
          </GridTableRow>
        )}

        {(resourceInfo.readBytes !== undefined ||
          resourceInfo.writeBytes !== undefined) && (
          <GridTableRow isSectionHeader>Ledger I/O</GridTableRow>
        )}

        {resourceInfo.readBytes !== undefined && (
          <GridTableRow>
            <GridTableCell isRowHeader>Ledger read</GridTableCell>
            <GridTableCell>{resourceInfo.readBytes} B</GridTableCell>
          </GridTableRow>
        )}

        {resourceInfo.writeBytes !== undefined && (
          <GridTableRow>
            <GridTableCell isRowHeader>Ledger write</GridTableCell>
            <GridTableCell>{resourceInfo.writeBytes} B</GridTableCell>
          </GridTableRow>
        )}
      </GridTable>
    </Card>
  </Box>
);
