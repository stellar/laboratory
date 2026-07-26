import { useQuery } from "@tanstack/react-query";
import {
  Account,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

import { NetworkHeaders, TokenInfo } from "@/types/types";

// Placeholder public key used to build a throwaway transaction for a read-only
// simulation. It doesn't need to exist or be funded — simulation never touches
// the source account for a view call.
const SIMULATION_PLACEHOLDER_SOURCE =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

/**
 * Simulate a no-argument, read-only contract call and return its decoded native
 * result. Returns `null` on any failure (network error, malformed response,
 * contract without the function) so callers can treat missing metadata as
 * "feature off".
 */
const simulateNoArgCall = async ({
  contractId,
  functionName,
  networkPassphrase,
  rpcUrl,
  headers,
}: {
  contractId: string;
  functionName: string;
  networkPassphrase: string;
  rpcUrl: string;
  headers: NetworkHeaders;
}): Promise<unknown | null> => {
  try {
    const account = new Account(SIMULATION_PLACEHOLDER_SOURCE, "0");
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(new Contract(contractId).call(functionName))
      .setTimeout(30)
      .build();

    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "simulateTransaction",
        params: {
          xdrFormat: "base64",
          transaction: tx.toXDR(),
        },
      }),
    });

    const json = await res.json();
    const resultXdr: string | undefined = json?.result?.results?.[0]?.xdr;

    if (json?.result?.error || !resultXdr) {
      return null;
    }

    return scValToNative(xdr.ScVal.fromXDR(resultXdr, "base64"));
  } catch {
    return null;
  }
};

/**
 * Fetch a token contract's `decimals` (and best-effort `symbol`) via read-only
 * simulation. Works for both wasm tokens and Stellar Asset Contracts (SACs) —
 * simulation doesn't require the wasm, so a SAC still resolves `decimals = 7`.
 *
 * Returns `null` when `decimals` can't be resolved or is out of the sane
 * 0–38 range (the value is self-reported by the contract and can lie), which
 * keeps the decimals-aware UI purely additive: everything falls back to plain
 * integer inputs.
 */
export const useGetTokenInfoFromRpc = ({
  contractId,
  networkPassphrase,
  rpcUrl,
  headers = {},
  enabled = false,
}: {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
  enabled?: boolean;
}) => {
  return useQuery<TokenInfo | null>({
    queryKey: ["tokenInfo", contractId, rpcUrl, networkPassphrase, headers],
    queryFn: async () => {
      if (!contractId || !rpcUrl) {
        return null;
      }

      const [decimalsRaw, symbolRaw] = await Promise.all([
        simulateNoArgCall({
          contractId,
          functionName: "decimals",
          networkPassphrase,
          rpcUrl,
          headers,
        }),
        simulateNoArgCall({
          contractId,
          functionName: "symbol",
          networkPassphrase,
          rpcUrl,
          headers,
        }),
      ]);

      const decimals = Number(decimalsRaw);

      // Guardrail: reject non-integer / out-of-range self-reported decimals.
      if (
        decimalsRaw === null ||
        !Number.isInteger(decimals) ||
        decimals < 0 ||
        decimals > 38
      ) {
        return null;
      }

      const symbol =
        typeof symbolRaw === "string" && symbolRaw.length > 0
          ? symbolRaw
          : undefined;

      return { decimals, symbol };
    },
    enabled: enabled && Boolean(contractId) && Boolean(rpcUrl),
    // Decimals are immutable in practice; a page reload refetches.
    staleTime: Infinity,
  });
};
