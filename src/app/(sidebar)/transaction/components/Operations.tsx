"use client";

import { useState } from "react";
import {
  Asset,
  FeeBumpTransaction,
  StrKey,
  Transaction,
} from "@stellar/stellar-sdk";
import { Button, Card, Text } from "@stellar/design-system";

import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { Box } from "@/components/layout/Box";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import "../styles.scss";

const ALL_FILTER_ID = "all";

/**
 * The discriminated union of parsed operations, which carries `type` and the
 * per-operation fields. The exported `Operation` class does not.
 */
type TxOperation = Transaction["operations"][number];

/**
 * The SDK exposes operation types and fields in camelCase (`createAccount`,
 * `startingBalance`), while `TRANSACTION_OPERATIONS` and the operation badges
 * use the XDR snake_case naming (`create_account`).
 */
const toSnakeCase = (value: string): string =>
  value.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

/** Human-readable operation name, e.g. `createAccount` → "Create account". */
const getOperationLabel = (opType: string): string => {
  const snakeCase = toSnakeCase(opType);
  const label = TRANSACTION_OPERATIONS[snakeCase]?.label;

  if (label) {
    return label;
  }

  return snakeCase
    .split("_")
    .map((part, index) =>
      index === 0 ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part,
    )
    .join(" ");
};

/** Field label from an operation key, e.g. `startingBalance` → "Starting balance". */
const getFieldLabel = (key: string): string => {
  const words = toSnakeCase(key).split("_");

  return words
    .map((word, index) =>
      index === 0 ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word,
    )
    .join(" ");
};

const isAsset = (value: any): value is Asset =>
  value instanceof Asset ||
  (typeof value?.getCode === "function" &&
    typeof value?.isNative === "function");

type RenderedValue = {
  display: string;
  // Short type hint rendered next to the value, mirroring the XDR JSON view.
  annotation?: string;
  // Multi-line values (nested structures) render in a preformatted block.
  isBlock?: boolean;
};

/**
 * Format a single operation field for display, along with a short annotation
 * describing what kind of value it is.
 *
 * Deliberately generic rather than a per-operation-type field map: every
 * classic operation is covered without a hand-maintained schema, at the cost
 * of rendering unusual structures (claimants, signers, ledger keys) as JSON.
 */
const renderValue = (value: any): RenderedValue | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (isAsset(value)) {
    const code = value.getCode();

    const issuer = value.getIssuer();

    if (value.isNative() || !issuer) {
      return { display: `"${code}"`, annotation: "asset" };
    }

    return {
      display: `"${code}" ${shortenStellarAddress(issuer)}`,
      annotation: "asset",
    };
  }

  if (typeof value === "boolean") {
    return { display: String(value), annotation: "boolean" };
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return { display: value.toString(), annotation: "number" };
  }

  if (typeof value === "string") {
    if (
      StrKey.isValidEd25519PublicKey(value) ||
      StrKey.isValidMed25519PublicKey(value)
    ) {
      return {
        display: shortenStellarAddress(value),
        annotation: "account id",
      };
    }

    if (StrKey.isValidContract(value)) {
      return { display: shortenStellarAddress(value), annotation: "address" };
    }

    // Amounts and sequence numbers arrive as decimal strings.
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return { display: value, annotation: "number" };
    }

    return { display: value, annotation: "string" };
  }

  return { display: JSON.stringify(value, null, 2), isBlock: true };
};

type OperationField = {
  key: string;
  label: string;
  value: RenderedValue;
};

const getOperationFields = (op: TxOperation): OperationField[] =>
  Object.entries(op)
    // `type` is shown as the operation's badge, not as a field.
    .filter(([key]) => key !== "type")
    .reduce((fields: OperationField[], [key, value]) => {
      const rendered = renderValue(value);

      if (rendered) {
        fields.push({ key, label: getFieldLabel(key), value: rendered });
      }

      return fields;
    }, []);

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

  if (!tx) {
    return null;
  }

  const isFeeBump = tx instanceof FeeBumpTransaction;
  const innerTx = isFeeBump ? tx.innerTransaction : tx;
  const operations = innerTx.operations;

  if (operations.length === 0) {
    return (
      <TransactionTabEmptyMessage title="No operations">
        This transaction has no operations.
      </TransactionTabEmptyMessage>
    );
  }

  const opTypes = Array.from(new Set(operations.map((op) => op.type))).sort(
    (a, b) => getOperationLabel(a).localeCompare(getOperationLabel(b)),
  );

  // A filter for a type no longer present (or "all") shows everything.
  const visibleOperations =
    activeFilter === ALL_FILTER_ID
      ? operations
      : operations.filter((op) => op.type === activeFilter);

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

      {visibleOperations.map((op, index) => (
        <OperationCard key={`${op.type}-${index}`} operation={op} />
      ))}
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
    variant={isActive ? "primary" : "tertiary"}
    onClick={onClick}
    data-is-active={isActive}
  >
    {label}
  </Button>
);

const OperationCard = ({ operation }: { operation: TxOperation }) => {
  const fields = getOperationFields(operation);

  return (
    <Card>
      <Box gap="md">
        <div className="Operations__type">
          <Text as="div" size="xs" weight="medium">
            {toSnakeCase(operation.type)}
          </Text>
        </div>

        {fields.length === 0 ? (
          <Text as="div" size="sm" addlClassName="Operations__note">
            This operation has no parameters.
          </Text>
        ) : (
          <div className="Operations__gridTableContainer">
            <table>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.key}>
                    <td>
                      <Text
                        as="div"
                        size="sm"
                        weight="medium"
                        addlClassName="Operations__cell"
                        data-is-label={true}
                      >
                        {field.label}
                      </Text>
                    </td>
                    <td>
                      <Text
                        as="div"
                        size="sm"
                        weight="medium"
                        addlClassName="Operations__cell"
                      >
                        {field.value.isBlock ? (
                          <pre className="Operations__block">
                            {field.value.display}
                          </pre>
                        ) : (
                          <>
                            <code>{field.value.display}</code>
                            {field.value.annotation ? (
                              <span className="Operations__annotation">
                                {field.value.annotation}
                              </span>
                            ) : null}
                          </>
                        )}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </Card>
  );
};
