import { Table } from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { RowContent } from "./RowContent";

export function TransactionsTable({
  transactions,
  isLoading,
}: {
  transactions: StellarRpc.Api.TransactionInfo[];
  isLoading: boolean;
}) {
  const columns = [
    { id: "type", label: "Type" },
    { id: "txhash", label: "Transaction hash" },
    { id: "created", label: "Created at" },
    { id: "status", label: "Status" },
    { id: "actions", label: "" },
  ];

  transactions.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Table
      hideNumberColumn
      breakpoint={400}
      isLoading={isLoading}
      columnLabels={columns}
      data={transactions}
      emptyMessage="No transactions found."
      renderItemRow={(tx) => <RowContent key={tx.txHash} tx={tx} />}
    />
  );
}
