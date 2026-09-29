import { useQuery } from "@tanstack/react-query";

import { BACKEND_ENDPOINT } from "@/constants/backend";

import {
  BENetworkLimitsResponse,
  NetworkLimits,
  NetworkType,
} from "@/types/types";

/**
 * Checks if the backend supplies network limits for the network.
 *
 * @param networkId - Selected network ID
 * @returns `true` for Mainnet and Testnet
 */
export const isNetworkLimitsSupported = (networkId: NetworkType) =>
  networkId === "mainnet" || networkId === "testnet";

/**
 * Fetches Soroban network limits and resource fees from the Lab backend.
 * The backend reads the config settings from `rpcUrl`.
 * The backend supports only Mainnet and Testnet. Each network has its own
 * backend deployment under the `/pubnet` or `/testnet` path prefix.
 *
 * @param networkId - Selected network ID
 * @param rpcUrl - RPC URL of the selected network
 * @returns React Query result with the converted `limits` and the raw `json`
 */
export const useBackendNetworkLimits = ({
  networkId,
  rpcUrl,
}: {
  networkId: NetworkType;
  rpcUrl: string;
}) => {
  return useQuery({
    queryKey: ["useBackendNetworkLimits", networkId, rpcUrl],
    queryFn: async () => {
      const backendNetwork = networkId === "mainnet" ? "pubnet" : networkId;
      const params = new URLSearchParams({
        network: networkId,
        rpc_url: rpcUrl,
      });

      const response = await fetch(
        `${BACKEND_ENDPOINT}/${backendNetwork}/api/network_limits?${params}`,
      );

      if (!response.ok) {
        throw new Error(await getBackendErrorMessage(response));
      }

      const json = (await response.json()) as BENetworkLimitsResponse;

      return { limits: normalizeNetworkLimits(json), json };
    },
    enabled: Boolean(isNetworkLimitsSupported(networkId) && rpcUrl),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Converts the numeric string fields in the backend response to numbers.
 *
 * @param json - Raw backend response
 * @returns Network limits with numeric fields as numbers
 */
export const normalizeNetworkLimits = (
  json: BENetworkLimitsResponse,
): NetworkLimits => ({
  ...json,
  tx_max_instructions: Number(json.tx_max_instructions),
  ledger_max_instructions: Number(json.ledger_max_instructions),
  fee_rate_per_instructions_increment: Number(
    json.fee_rate_per_instructions_increment,
  ),
});

/**
 * Reads the error message from a failed backend response.
 * The backend returns `{ error }` when it rejects an RPC URL.
 * It returns `{ message, issues }` when the query params are not valid.
 *
 * @param response - Failed fetch response
 * @returns The backend error message. If the response body has no message,
 * a generic message with the status code.
 */
export const getBackendErrorMessage = async (
  response: Response,
): Promise<string> => {
  const fallback = `Fetching network limits failed: ${response.status}`;

  try {
    const json = await response.json();

    if (typeof json?.error === "string") {
      return json.error;
    }

    if (Array.isArray(json?.issues) && json.issues.length > 0) {
      return json.issues
        .map((issue: { message?: string }) => issue.message)
        .filter(Boolean)
        .join(". ");
    }

    return typeof json?.message === "string" ? json.message : fallback;
  } catch {
    return fallback;
  }
};
