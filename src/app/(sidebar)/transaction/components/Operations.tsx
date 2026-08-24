"use client";

import { useState } from "react";
import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk";
import { Button, Text } from "@stellar/design-system";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import * as StellarXdr from "@/helpers/StellarXdr";

import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";

import {
  ClassicOperationJson,
  ClassicOperationsList,
  getClassicOperationType,
} from "@/components/ClassicOperationsList";
import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import "../styles.scss";

const ALL_FILTER_ID = "all";

/** Human-readable operation name, e.g. `create_account` → "Create account". */
const getOperationLabel = (opType: string): string => {
  const label = TRANSACTION_OPERATIONS[opType]?.label;

  if (label) {
    return label;
  }

  return opType
    .split("_")
    .map((part, index) =>
      index === 0 ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part,
    )
    .join(" ");
};

/**
 * Operations of a transaction envelope in XDR JSON form, which is what the
 * transaction dashboard renders as well. Requires the XDR JSON wasm module to
 * be initialized.
 *
 * @param tx - Parsed transaction envelope
 */
const getOperationsJson = (tx: Transaction): ClassicOperationJson[] => {
  try {
    const envelopeJson = JSON.parse(
      StellarXdr.decode(XDR_TYPE_TRANSACTION_ENVELOPE, tx.toXdr()),
    );

    // v1 (`tx`) and the legacy v0 (`tx_v0`) envelopes hold operations in the
    // same place, under a different key.
    return (
      envelopeJson?.tx?.tx?.operations ||
      envelopeJson?.tx_v0?.tx?.operations ||
      []
    );
  } catch {
    return [];
  }
};

/**
 * Read-only list of a transaction's operations, derived entirely from the
 * envelope (no RPC/Horizon), with a filter for the operation types present.
 *
 * A fee-bump envelope carries no operations of its own — they belong to the
 * inner transaction, which is what gets rendered here.
 *
 * @param tx - Parsed transaction envelope, or null before one is available
 */
export const Operations = ({
  tx,
}: {
  tx: Transaction | FeeBumpTransaction | null;
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER_ID);
  const isXdrInit = useIsXdrInit();

  if (!tx || !isXdrInit) {
    return null;
  }

  const isFeeBump = tx instanceof FeeBumpTransaction;
  const operations = getOperationsJson(isFeeBump ? tx.innerTransaction : tx);

  if (operations.length === 0) {
    return (
      <TransactionTabEmptyMessage title="No operations">
        This transaction has no operations.
      </TransactionTabEmptyMessage>
    );
  }

  const opTypes = Array.from(
    new Set(operations.map((op) => getClassicOperationType(op))),
  ).sort((a, b) => getOperationLabel(a).localeCompare(getOperationLabel(b)));

  // A filter for a type no longer present (or "all") shows everything.
  const visibleOperations =
    activeFilter === ALL_FILTER_ID
      ? operations
      : operations.filter((op) => getClassicOperationType(op) === activeFilter);

  return (
    <Box gap="lg" addlClassName="Operations">
      {isFeeBump ? (
        <Text as="h3" size="sm" weight="medium">
          Inner transaction operations
        </Text>
      ) : null}

      <Box
        gap="sm"
        direction="row"
        wrap="wrap"
        addlClassName="Operations__filters"
      >
        <FilterChip
          label="All"
          isActive={activeFilter === ALL_FILTER_ID}
          onClick={() => setActiveFilter(ALL_FILTER_ID)}
        />
        {opTypes.map((opType) => (
          <FilterChip
            key={opType}
            label={getOperationLabel(opType)}
            isActive={activeFilter === opType}
            onClick={() => setActiveFilter(opType)}
          />
        ))}
      </Box>

      <ClassicOperationsList operations={visibleOperations} />
    </Box>
  );
};

const FilterChip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    size="sm"
    variant={isActive ? "secondary" : "tertiary"}
    onClick={onClick}
    data-is-active={isActive}
    aria-pressed={isActive}
  >
    {label}
  </Button>
);
