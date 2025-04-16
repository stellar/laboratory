"use client";

import { useEffect, useState } from "react";
import { Alert } from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";

import { useStore } from "@/store/useStore";
import { useGetRpcTxs } from "@/query/useGetRpcTxs";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { TransactionsTable } from "./components/TransactionsTable";

export default function Explorer() {
  const { network } = useStore();
  const [iter, setIter] = useState(0);
  const [nextFetchAt, setNextFetchAt] = useState<number>(0);
  const [startLedger, setStartLedger] = useState<number>(0);
  const [transactions] = useState<Map<string, StellarRpc.Api.TransactionInfo>>(
    new Map(),
  );

  const txsQuery = useGetRpcTxs({
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
    startLedger,
  });

  useEffect(() => {
    const tid = setInterval(() => setIter((prev) => prev + 1), 1000);
    return () => clearInterval(tid);
  }, []);

  useEffect(() => {
    const fetchTxs = async () => {
      if (Date.now() < nextFetchAt) {
        return;
      }

      setNextFetchAt(Date.now() + 5000);

      try {
        await txsQuery.refetch();

        if (txsQuery.data?.transactions && !txsQuery.error) {
          txsQuery.data.transactions.forEach((tx) => {
            transactions.set(tx.txHash, tx);
          });
          setStartLedger(txsQuery.data.latestLedger);
        }
      } catch (e) {
        // do nothing
      }
    };

    if (network.rpcUrl) {
      fetchTxs();
    }
  }, [network?.rpcUrl, txsQuery, iter, nextFetchAt, transactions]);

  const errorElement = txsQuery.error && (
    <Alert variant="error" placement="inline">
      {txsQuery.error.message}
    </Alert>
  );

  return (
    <Box gap="md" data-testid="explorer">
      <PageCard heading="Blockchain Explorer">
        {errorElement}

        <TransactionsTable transactions={Array.from(transactions.values())} />
      </PageCard>
    </Box>
  );
}
