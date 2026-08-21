import { useMemo } from "react";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import {
  getTxSignatureCompleteness,
  TxSignatureCompleteness,
} from "@/helpers/checkRequiredSignatures";
import { parseTxXdr } from "@/helpers/parseTxXdr";

/**
 * Offline assessment of whether the imported transaction already carries every
 * signature it needs, derived from the envelope + the active network
 * passphrase (no RPC/Horizon).
 *
 * @returns the completeness result, or `null` when there's no parseable
 *   imported tx with signatures to evaluate.
 */
export const useImportSignatureCompleteness =
  (): TxSignatureCompleteness | null => {
    const { import: importState } = useImportFlowStore();
    const { network } = useStore();

    return useMemo(() => {
      if (!importState?.hasSignatures) {
        return null;
      }

      const tx = parseTxXdr(importState.importXdr, network.passphrase);

      return tx ? getTxSignatureCompleteness(tx) : null;
    }, [
      importState?.hasSignatures,
      importState?.importXdr,
      network.passphrase,
    ]);
  };
