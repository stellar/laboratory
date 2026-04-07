import { useEffect } from "react";

import { useStore } from "@/store/useStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

/**
 * One-time migration hook that bridges legacy querystring-persisted transaction
 * params into the sessionStorage-based flow store.
 *
 * Old bookmarked URLs encode build params in the querystring via
 * zustand-querystring. The build page now reads from the flow store
 * (sessionStorage). This hook detects legacy params and seeds the flow store
 * so old URLs continue to work.
 *
 * Should be called once in the build page component.
 */
export const useLegacyUrlMigration = () => {
  const { transaction } = useStore();

  // Use primitive values as dependencies so the effect re-fires when the
  // main store hydrates from the URL querystring.
  const legacySourceAccount = transaction.build.params.source_account;
  const legacySorobanOpType =
    transaction.build.soroban.operation.operation_type;
  const legacyClassicOpCount = transaction.build.classic.operations.length;
  const legacyFirstClassicOpType =
    transaction.build.classic.operations[0]?.operation_type || "";

  useEffect(() => {
    const legacyParams = transaction.build.params;
    const legacyClassicOps = transaction.build.classic.operations;
    const legacySorobanOp = transaction.build.soroban.operation;

    // Check if the legacy store has non-default params from a URL
    const hasLegacyParams = Boolean(legacyParams.source_account);
    const hasLegacyClassicOps =
      legacyClassicOps.length > 0 &&
      legacyClassicOps.some((op) => Boolean(op.operation_type));
    const hasLegacySorobanOp = Boolean(legacySorobanOp.operation_type);

    if (!hasLegacyParams && !hasLegacyClassicOps && !hasLegacySorobanOp) {
      return;
    }

    const flowStore = useBuildFlowStore.getState();

    // Seed params if the flow store doesn't have them yet
    if (hasLegacyParams && !flowStore.build.params.source_account) {
      flowStore.setBuildParams(legacyParams);
    }

    // Seed operations if the flow store doesn't have them yet
    const flowHasOps = flowStore.build.classic.operations.some((op) =>
      Boolean(op.operation_type),
    );
    const flowHasSorobanOp = Boolean(
      flowStore.build.soroban.operation.operation_type,
    );

    if (hasLegacySorobanOp && !flowHasSorobanOp) {
      flowStore.setBuildSorobanOperation(legacySorobanOp);

      if (transaction.build.soroban.xdr) {
        flowStore.setBuildSorobanXdr(transaction.build.soroban.xdr);
      }
    } else if (hasLegacyClassicOps && !flowHasOps) {
      flowStore.setBuildClassicOperations(legacyClassicOps);

      if (transaction.build.classic.xdr) {
        flowStore.setBuildClassicXdr(transaction.build.classic.xdr);
      }
    }
  }, [
    legacySourceAccount,
    legacySorobanOpType,
    legacyClassicOpCount,
    legacyFirstClassicOpType,
    transaction,
  ]);
};
