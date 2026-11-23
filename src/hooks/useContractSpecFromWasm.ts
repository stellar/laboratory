import { useMemo } from "react";
import { contract } from "@stellar/stellar-sdk";

/**
 * Parses the contract spec (`contractspecv0` section) out of a Wasm binary.
 *
 * This is what `contract.Client.from()` does internally after downloading the
 * contract instance and the Wasm from RPC. Parsing the Wasm we already have
 * avoids those two extra RPC round trips.
 *
 * @param wasmBinary - The contract Wasm, or `null`/`undefined` if not loaded
 * @returns The parsed spec, or the parsing error
 */
export const useContractSpecFromWasm = (
  wasmBinary: Uint8Array | null | undefined,
): { spec: contract.Spec | null; error: Error | null } => {
  return useMemo(() => {
    if (!wasmBinary) {
      return { spec: null, error: null };
    }

    try {
      return { spec: contract.Spec.fromWasm(wasmBinary), error: null };
    } catch (e: any) {
      return {
        spec: null,
        error: new Error(
          `error while reading the contract spec: ${e?.message || e}`,
        ),
      };
    }
  }, [wasmBinary]);
};
