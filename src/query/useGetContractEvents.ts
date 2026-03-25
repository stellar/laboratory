import { useQuery } from "@tanstack/react-query";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

const EVENTS_LOOKBACK_LEDGERS = 10_000;
const EVENTS_LIMIT = 100;
const EVENTS_POLL_INTERVAL_MS = 5_000;

/**
 * Fetches recent contract events from the Stellar RPC using `getEvents()`.
 * Polls every 5 seconds while the tab is active.
 *
 * @param contractId - The contract ID to filter events for
 * @param rpcUrl - The RPC server URL
 * @param headers - Optional network headers
 * @param isActive - Whether the tab is currently visible
 * @returns React Query result with parsed event data
 *
 * @example
 * const { data, isLoading, error } = useGetContractEvents({
 *   contractId: "CABC...",
 *   rpcUrl: "https://soroban-testnet.stellar.org",
 *   isActive: true,
 * });
 */
export const useGetContractEvents = ({
  contractId,
  rpcUrl,
  headers = {},
  isActive,
}: {
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
  isActive: boolean;
}) => {
  const query = useQuery<StellarRpc.Api.GetEventsResponse>({
    queryKey: ["getContractEvents", contractId, rpcUrl],
    queryFn: async () => {
      const rpcServer = new StellarRpc.Server(rpcUrl, {
        headers: isEmptyObject(headers) ? undefined : { ...headers },
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });

      const latestLedger = await rpcServer.getLatestLedger();
      const startLedger = Math.max(
        latestLedger.sequence - EVENTS_LOOKBACK_LEDGERS,
        0,
      );

      const response = await rpcServer.getEvents({
        startLedger,
        endLedger: latestLedger.sequence,
        filters: [
          {
            type: "contract",
            contractIds: [contractId],
          },
        ],
        limit: EVENTS_LIMIT,
      });

      // Sort newest-first by ledger, then by event position within ledger
      response.events.sort((a, b) => {
        if (b.ledger !== a.ledger) {
          return b.ledger - a.ledger;
        }
        return b.transactionIndex - a.transactionIndex;
      });

      return response;
    },
    enabled: Boolean(isActive && contractId && rpcUrl),
    refetchInterval: isActive ? EVENTS_POLL_INTERVAL_MS : false,
  });

  return query;
};
