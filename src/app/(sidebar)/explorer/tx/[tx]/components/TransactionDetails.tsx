import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { formatTimestamp } from "@/helpers/formatTimestamp";
import { Badge, Text } from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

export function TransactionDetails({
  tx,
}: {
  tx: StellarRpc.Api.GetTransactionResponse;
}) {
  const envelope = tx.envelopeXdr.value().tx();
  envelope.operations().forEach((op) => {
    console.log({ op }, op.body().value().startingBalance());
  });

  return (
    <Box gap="md" data-testid="explorer">
      <PageCard heading={`Summary`}>
        <Box gap="lg" align="start">
          <Badge variant={tx.status === "SUCCESS" ? "success" : "error"}>
            {tx.status}
          </Badge>

          <Box gap="md" direction="row">
            <strong>Transaction:</strong>
            {tx.txHash}
          </Box>

          <Box gap="md" direction="row">
            <strong>Ledger:</strong>
            {tx.latestLedger}
          </Box>

          <Box gap="md" direction="row">
            <strong>Closed at:</strong>
            {formatTimestamp(tx.latestLedgerCloseTime * 1000)}
          </Box>
        </Box>
      </PageCard>

      <PageCard heading="Operations">
        {envelope.operations().map((op, index) => (
          <p key={`op-${index}`}>{op.body().arm()}</p>
        ))}
      </PageCard>
      <PageCard heading="Signatures"></PageCard>
    </Box>
  );
}
