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
  LOCAL_STORAGE_EXPLORER_TRANSACTIONS_RPC_REF,
} from "@/constants/settings";

import "./styles.scss";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const isLocalNetwork =
    network.id === "custom" &&
    network.rpcUrl.includes("localhost:8000/rpc") &&
    network.passphrase === "Standalone Network ; February 2017";

  useEffect(() => {
    // If rpc url is the same, we don't need to reset state.
    if (
      localStorage.getItem(LOCAL_STORAGE_EXPLORER_TRANSACTIONS_RPC_REF) ===
      network.rpcUrl
    ) {
      return;
    }

    // RPC URL changed, reset everything
    localStorage.removeItem(localStorageKey);
    localStorage.setItem(
      LOCAL_STORAGE_EXPLORER_TRANSACTIONS_RPC_REF,
      network.rpcUrl,
    );
    setStartLedger(0);
    setNextFetchAt(Date.now());
    transactions.clear();
    // Not including transactions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network.rpcUrl, localStorageKey]);

  useEffect(() => {
    const tid = setInterval(() => setIter((prev) => prev + 1), 1000);
    return () => clearInterval(tid);
  }, []);

  useEffect(() => {
    const fetchTxs = async () => {
      if (Date.now() < nextFetchAt) {
        return;
      }

      if (isLocalNetwork) {
        setNextFetchAt(Date.now() + 1000);
      } else {
        setNextFetchAt(Date.now() + 5000);
      }

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
            .toSorted((a, b) =>
              a.createdAt > b.createdAt
                ? 1
                : a.createdAt < b.createdAt
                  ? -1
                  : 0,
            )
            .splice(-500);
          localStorage.setItem(localStorageKey, jsonStringify(txs)!);

          if (txsQuery.data.latestLedger) {
            setStartLedger(txsQuery.data.latestLedger);
          }
        }
      } catch (e) {
        console.error("error in fetchTxs:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (network.rpcUrl) {
      fetchTxs();
      setIsLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    network?.rpcUrl,
    txsQuery,
    iter,
    nextFetchAt,
    transactions,
    localStorageKey,
  ]);

  const errorElement = txsQuery.isError ? (
    <Alert variant="error" placement="inline">
      {txsQuery.error.message}
    </Alert>
  ) : null;

  return (
    <Box gap="md" data-testid="explorer" addlClassName="TransactionsExplorer">
      <PageCard heading="Transactions Explorer">
        {errorElement}

        <TransactionsTable
          transactions={Array.from(transactions.values())}
          isLoading={isLoading}
        />
      </PageCard>
    </Box>
  );
}
