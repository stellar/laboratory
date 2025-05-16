"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, CopyText, Icon, Text } from "@stellar/design-system";

import { DataTable } from "@/components/DataTable";
import { Box } from "@/components/layout/Box";
import { NextLink } from "@/components/NextLink";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { NormalizedTransaction } from "@/helpers/explorer/normalizeTransaction";

import { DataTableHeader } from "@/types/types";
import { Time } from "./Time";

function getOperationType(tx: NormalizedTransaction): string {
  const payload = tx.payload;

  const getOpTypeList = (ops: unknown) =>
    // @ts-expect-error we don't care about op type here
    ops.map((op) => underscore(Object.keys(op.body)[0]));

  let prefix = "";
  let ops: unknown[] = [];

  if ("txFeeBump" in payload) {
    prefix = "FEE_BUMP + ";
    // @ts-expect-error this was deserialized from json xdr, so no types
    ops = payload.txFeeBump.tx.innerTx.tx.tx.operations;
  } else {
    // @ts-expect-error this was deserialized from json xdr, so no types
    ops = payload.tx.tx.operations;
  }

  const types = getOpTypeList(ops);

  if (types.length === 1) {
    return types[0];
  } else {
    return `${prefix}${types.length} OPERATIONS`;
  }
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
  transactions: NormalizedTransaction[];
}) {
  const router = useRouter();
  const headers: DataTableHeader[] = [
    { id: "type", value: "Type" },
    { id: "txhash", value: "Transaction hash" },
    { id: "created", value: "Created at" },
    { id: "status", value: "Status" },
    { id: "actions", value: "", isSortable: false },
  ];

  const sortedTransactions = transactions
    .map<[number, NormalizedTransaction]>((tx) => [
      parseInt(tx.createdAt.toString(), 10),
      tx,
    ])
    .toSorted(([a], [b]) => b - a)
    .map<NormalizedTransaction>(([, tx]) => tx);

  return (
    <DataTable
      emptyMessage="No transactions found."
      pageSize={100}
      tableId="transactions"
      tableHeaders={headers}
      tableData={sortedTransactions}
      cssGridTemplateColumns="minmax(300px, 2fr) minmax(130px, 2fr) minmax(200px, 1fr) minmax(50px, 100px) minmax(100px, 1fr)"
      formatDataRow={(tx: NormalizedTransaction) => [
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
              <NextLink href={`/transactions-explorer/tx/${tx.txHash}`}>
                {shortenStellarAddress(tx.txHash)}
              </NextLink>

              <CopyText textToCopy={tx.txHash}>
                <Button
                  size="sm"
                  variant="tertiary"
                  icon={<Icon.Copy01 />}
                  iconPosition="left"
                  showActionTooltip={false}
                  onClick={(e) => e.preventDefault()}
                />
              </CopyText>
            </Box>
          ),
        },
        { value: <Time timestamp={parseInt(tx.createdAt.toString(), 10)} /> },
        {
          value: (
            <Badge variant={tx.status === "SUCCESS" ? "success" : "error"}>
              {tx.status}
            </Badge>
          ),
        },
        {
          value: (
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => {
                router.push(`/transactions-explorer/tx/${tx.txHash}`);
              }}
            >
              View details
            </Button>
          ),
        },
      ]}
    />
  );
}
