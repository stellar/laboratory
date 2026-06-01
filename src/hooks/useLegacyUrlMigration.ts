import { useEffect, useState } from "react";

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
 * @returns `isLegacyUrl` — true when data was migrated from a legacy URL.
 */
export const useLegacyUrlMigration = () => {
  const [isLegacyUrl, setIsLegacyUrl] = useState(false);
  const { transaction } = useStore();

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

    let didMigrate = false;

    // Seed params if the flow store doesn't have them yet
    if (hasLegacyParams && !flowStore.build.params.source_account) {
      flowStore.setBuildParams(legacyParams);
      didMigrate = true;
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
      didMigrate = true;
    } else if (hasLegacyClassicOps && !flowHasOps) {
      flowStore.setBuildClassicOperations(legacyClassicOps);

      if (transaction.build.classic.xdr) {
        flowStore.setBuildClassicXdr(transaction.build.classic.xdr);
      }
      didMigrate = true;
    }

    if (didMigrate) {
      setIsLegacyUrl(true);
    }
  }, [transaction]);

  const dismissLegacyAlert = () => setIsLegacyUrl(false);

  return { isLegacyUrl, dismissLegacyAlert };
};
