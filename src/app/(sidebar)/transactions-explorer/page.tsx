"use client";

import { useEffect, useState } from "react";
import { Alert } from "@stellar/design-system";
import {
  parse as jsonParse,
  stringify as jsonStringify,
  parseNumberAndBigInt,
} from "lossless-json";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";

import { useStore } from "@/store/useStore";
import { useGetRpcTxs } from "@/query/useGetRpcTxs";
import {
  LOCAL_STORAGE_SAVED_EXPLORER_TRANSACTIONS,
  LOCALSTORAGE_EXPLORER_TRANSACTIONS_RPC_REF,
} from "@/constants/settings";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import {
  type NormalizedTransaction,
  normalizeTransaction,
} from "@/helpers/explorer/normalizeTransaction";

import { TransactionsTable } from "./components/TransactionsTable";

export default function Explorer() {
  const { network } = useStore();
  const localStorageKey = LOCAL_STORAGE_SAVED_EXPLORER_TRANSACTIONS;
  const [iter, setIter] = useState(0);
  const [nextFetchAt, setNextFetchAt] = useState<number>(0);
  const [startLedger, setStartLedger] = useState<number>(0);
  const [transactions] = useState<Map<string, NormalizedTransaction>>(() => {
    const map: Map<string, NormalizedTransaction> = new Map();
    const txs = localStorage.getItem(localStorageKey);

    if (txs) {
      const parsedTxs = jsonParse(
        txs,
        null,
        parseNumberAndBigInt,
      ) as NormalizedTransaction[];
      for (const tx of parsedTxs) {
        map.set(tx.txHash, tx);
      }
    }

    return map;
  });

  const txsQuery = useGetRpcTxs({
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
    startLedger,
  });

  useEffect(() => {
    // If rpc url is the same, we don't need to reset state.
    if (
      localStorage.getItem(LOCALSTORAGE_EXPLORER_TRANSACTIONS_RPC_REF) ===
      network.rpcUrl
    ) {
      return;
    }

    localStorage.removeItem(localStorageKey);
    localStorage.setItem(
      LOCALSTORAGE_EXPLORER_TRANSACTIONS_RPC_REF,
      network.rpcUrl,
    );
    setStartLedger(0);
    setNextFetchAt(Date.now());
    transactions.clear();
  }, [network.rpcUrl]);

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
          for (const txinfo of txsQuery.data.transactions) {
            const normalizedTx = await normalizeTransaction(txinfo);

            if (normalizedTx) {
              transactions.set(normalizedTx.txHash, normalizedTx);
            }
          }

          const txs = Array.from(transactions.values())
            .toSorted((tx) => tx.createdAt)
            .splice(-500);
          localStorage.setItem(localStorageKey, jsonStringify(txs)!);
          setStartLedger(txsQuery.data.latestLedger);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // do nothing
      }
    };

    if (network.rpcUrl) {
      fetchTxs();
    }
  }, [
    network?.rpcUrl,
    txsQuery,
    iter,
    nextFetchAt,
    transactions,
    localStorageKey,
  ]);

  const errorElement = txsQuery.isError && (
    <Alert variant="error" placement="inline">
      {txsQuery.error.message}
    </Alert>
  );

  return (
    <Box gap="md" data-testid="explorer">
      <PageCard heading="Transactions Explorer">
        {errorElement}

        <TransactionsTable transactions={Array.from(transactions.values())} />
      </PageCard>
    </Box>
  );
}
