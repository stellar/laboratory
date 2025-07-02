"use client";

import { use } from "react";
import { Alert, Loader } from "@stellar/design-system";
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
      {String(tx.error)}
    </Alert>
  );

  if (tx.data && !tx.error && "envelopeXdr" in tx.data) {
    return (
      <TransactionDetails
        tx={
          tx.data as unknown as
            | StellarRpc.Api.GetSuccessfulTransactionResponse
            | StellarRpc.Api.GetFailedTransactionResponse
        }
      />
    );
  }

  return (
    <Box gap="md" data-testid="explorer">
      <PageCard heading="Transaction Envelope">
        {errorElement}

        {tx.isLoading && (
          <Box gap="lg" direction="row" justify="center">
            <Loader />
          </Box>
        )}
      </PageCard>
    </Box>
  );
}
