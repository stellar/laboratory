"use client";

import { use } from "react";
import { Alert, Badge, Text } from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";

import { useStore } from "@/store/useStore";
import { useGetRpcTxDetails } from "@/query/useGetRpcTxDetails";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { TransactionDetails } from "./components/TransactionDetails";

export default function Tx({ params }: { params: Promise<{ tx: string }> }) {
  const { network } = useStore();
  const resolvedParams = use(params);
  const tx = useGetRpcTxDetails({
    tx: resolvedParams.tx,
    headers: getNetworkHeaders(network, "rpc"),
    rpcUrl: network.rpcUrl,
  });

  const errorElement = tx.error && (
    <Alert variant="error" placement="inline">
      {tx.error}
    </Alert>
  );

  if (tx.data && !tx.error) {
    return <TransactionDetails tx={tx.data} />;
  }

  return (
    <Box gap="md" data-testid="explorer">
      <PageCard heading={`Transaction Explorer - ${resolvedParams.tx}`}>
        {errorElement}
      </PageCard>
    </Box>
  );
}
