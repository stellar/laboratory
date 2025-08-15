"use client";

import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  CopyText,
  Icon,
  IconButton,
  Text,
} from "@stellar/design-system";

import { DataTable } from "@/components/DataTable";
import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { NormalizedTransaction } from "@/helpers/explorer/normalizeTransaction";
import { capitalizeString } from "@/helpers/capitalizeString";

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
    { id: "txhash", value: "Transaction Hash" },
    { id: "type", value: "Type" },
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
      cssGridTemplateColumns="minmax(160px, 1fr) minmax(180px, 1.5fr) minmax(260px, 1fr) minmax(80px, 100px) minmax(100px, 1fr)"
      formatDataRow={(tx: NormalizedTransaction) => [
        {
          value: (
            <Box
              gap="sm"
              direction="row"
              align="center"
              addlClassName="TransactionsExplorer__table__cell"
            >
              <SdsLink href={`/transactions-explorer/tx/${tx.txHash}`}>
                {shortenStellarAddress(tx.txHash)}
              </SdsLink>

              <CopyText textToCopy={tx.txHash}>
                <IconButton
                  customSize="12px"
                  icon={<Icon.Copy01 />}
                  altText="Copy Transaction Hash"
                  onClick={(e) => e.preventDefault()}
                />
              </CopyText>
            </Box>
          ),
          isOverflow: true,
        },
        {
          value: (
            <Text
              size="sm"
              as="div"
              addlClassName="TransactionsExplorer__table__cell"
            >
              <div className="TransactionsExplorer__ellipsis">
                {getOperationType(tx)}
              </div>
            </Text>
          ),
        },
        { value: <Time timestamp={parseInt(tx.createdAt.toString(), 10)} /> },
        {
          value: (
            <Badge variant={tx.status === "SUCCESS" ? "success" : "error"}>
              {capitalizeString(tx.status.toLowerCase())}
            </Badge>
          ),
        },
        {
          value: (
            <div className="TransactionsExplorer__table__lastCell">
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => {
                  router.push(`/transactions-explorer/tx/${tx.txHash}`);
                }}
              >
                View details
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
