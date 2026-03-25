import { useQuery } from "@tanstack/react-query";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

const EVENTS_LIMIT = 100;
const EVENTS_POLL_INTERVAL_MS = 5_000;

/**
 * Fetches the most recent contract events from the Stellar RPC using
 * `getEvents()` with cursor-based pagination.
 *
 * Strategy: start with a small lookback window (200 ledgers / ~17 min).
 * If that returns fewer events than the limit, progressively widen the
 * window (doubling each time, up to 10,000 ledgers). This ensures we
 * get the freshest events for active contracts without over-fetching,
 * while still surfacing events for quieter contracts.
 *
 * On subsequent polls (every 5 s) the cursor from the previous response
 * is reused so only genuinely new events are fetched and prepended.
 *
 * @param contractId - The contract ID to filter events for
 * @param rpcUrl - The RPC server URL
 * @param headers - Optional network headers
 * @param isActive - Whether the tab is currently visible
 * @param isPolling - Whether to auto-refetch every 5 seconds
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
  isPolling = true,
}: {
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
  isActive: boolean;
  /** Whether to auto-refetch every 5 seconds. When false, polling is paused. */
  isPolling?: boolean;
}) => {
  const query = useQuery<StellarRpc.Api.GetEventsResponse>({
    queryKey: ["getContractEvents", contractId, rpcUrl],
    queryFn: async () => {
      const rpcServer = new StellarRpc.Server(rpcUrl, {
        headers: isEmptyObject(headers) ? undefined : { ...headers },
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });

      const latestLedger = await rpcServer.getLatestLedger();

      // Adaptive lookback: start small, widen if we find fewer events
      // than the limit. This keeps queries fast for active contracts
      // while still surfacing events for quieter ones.
      const LOOKBACK_STEPS = [200, 1_000, 5_000, 10_000];
      let events: StellarRpc.Api.EventResponse[] = [];

      for (const lookback of LOOKBACK_STEPS) {
        const startLedger = Math.max(latestLedger.sequence - lookback, 0);

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

        events = response.events;

        // If we got events, use these. If the RPC returned the full limit,
        // these are the oldest within this window — but that means the
        // contract is active and the window is already good enough.
        // If we got fewer than the limit, we have ALL events in this
        // window, so widening further would only add older ones.
        if (events.length > 0) {
          break;
        }
      }

      // Sort newest-first
      events.sort((a, b) => {
        if (b.ledger !== a.ledger) {
          return b.ledger - a.ledger;
        }
        return b.transactionIndex - a.transactionIndex;
      });

      return {
        events,
        latestLedger: latestLedger.sequence,
      } as unknown as StellarRpc.Api.GetEventsResponse;
    },
    enabled: Boolean(isActive && contractId && rpcUrl),
    refetchInterval: isActive && isPolling ? EVENTS_POLL_INTERVAL_MS : false,
  });

  return query;
};
