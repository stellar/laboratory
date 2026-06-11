import { useMemo } from "react";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import {
  getTxSignatureCompleteness,
  TxSignatureCompleteness,
} from "@/helpers/checkRequiredSignatures";

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
      if (!importState?.hasSignatures || !importState.importXdr) {
        return null;
      }
      try {
        const tx = TransactionBuilder.fromXDR(
          importState.importXdr,
          network.passphrase,
        );
        return getTxSignatureCompleteness(tx);
      } catch {
        return null;
      }
    }, [
      importState?.hasSignatures,
      importState?.importXdr,
      network.passphrase,
    ]);
  };
