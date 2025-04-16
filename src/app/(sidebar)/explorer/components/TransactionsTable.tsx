import {
  Badge,
  Button,
  CopyText,
  Icon,
  Link,
  Text,
} from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { DataTable } from "@/components/DataTable";
import { formatEpochToDate } from "@/helpers/formatEpochToDate";
import { DataTableHeader } from "@/types/types";
import { Box } from "@/components/layout/Box";

function shortenHash(hash: string): string {
  const segmentSize = 6;
  return (
    hash.substring(0, segmentSize) +
    "…" +
    hash.substring(hash.length - segmentSize)
  );
}

function getOperationType(tx: StellarRpc.Api.TransactionInfo): string {
  const value = tx.envelopeXdr.value();

  const operations = tx.feeBump
    ? // @ts-expect-error Fee bump operation is covered first by the `tx.feeBump`
      value.tx().innerTx().value().tx().operations()
    : // @ts-expect-error Fee bump operation is covered first by the `tx.feeBump`
      value.tx().operations();

  if (operations.length > 1) {
    return `${operations.length} OPERATIONS`;
  }

  return underscore(operations[0].body().switch().name);
}

function underscore(input: string) {
  return input
    .split(/(?=[A-Z])/)
    .join("_")
    .toUpperCase();
}

export function TransactionsTable({
  transactions,
}: {
  transactions: StellarRpc.Api.TransactionInfo[];
}) {
  const headers: DataTableHeader[] = [
    { id: "type", value: "Type" },
    { id: "txhash", value: "Transaction hash" },
    { id: "created", value: "Created at" },
    { id: "status", value: "Status" },
    { id: "actions", value: "", isSortable: false },
  ];

  transactions.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <DataTable
      emptyMessage="No transactions found."
      pageSize={100}
      tableId="transactions"
      tableHeaders={headers}
      tableData={transactions}
      cssGridTemplateColumns="minmax(300px, 2fr) minmax(130px, 2fr) minmax(200px, 1fr) minmax(50px, 100px) minmax(100px, 1fr)"
      formatDataRow={(tx: StellarRpc.Api.TransactionInfo) => [
        {
          value: (
            <Text size="xs" as="span">
              {getOperationType(tx)}
            </Text>
          ),
        },
        {
          value: (
            <Box gap="sm" direction="row" align="center">
              <Link href="#">{shortenHash(tx.txHash)}</Link>

              <CopyText textToCopy={tx.txHash}>
                <Button
                  size="sm"
                  variant="tertiary"
                  icon={<Icon.Copy01 />}
                  iconPosition="left"
                  onClick={(e) => e.preventDefault()}
                />
              </CopyText>
            </Box>
          ),
        },
        { value: formatEpochToDate(tx.createdAt, "short") },
        {
          value: (
            <Badge variant={tx.status === "SUCCESS" ? "success" : "error"}>
              {tx.status}
            </Badge>
          ),
        },
        {
          value: (
            <Button size="sm" variant="tertiary">
              View details
            </Button>
          ),
        },
      ]}
    />
  );
}
