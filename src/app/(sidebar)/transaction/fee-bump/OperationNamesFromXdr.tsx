import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { Badge, Text } from "@stellar/design-system";

import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { Routes } from "@/constants/routes";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";

const MAX_VISIBLE_OPERATIONS = 5;

const formatOperationName = (operationType: string) => {
  const label = TRANSACTION_OPERATIONS[operationType]?.label;

  if (label) {
    return label;
  }

  return operationType
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
};

const getOperations = (transaction: Transaction | FeeBumpTransaction) => {
  if (transaction instanceof FeeBumpTransaction) {
    return transaction.innerTransaction.operations;
  }

  return transaction.operations;
};

interface OperationNamesFromXdrProps {
  xdr: string;
  networkPassphrase: string;
}

/**
 * Decodes a transaction envelope XDR and lists the operation names it contains.
 *
 * @example
 * <OperationNamesFromXdr xdr={xdr} networkPassphrase={network.passphrase} />
 */
export const OperationNamesFromXdr = ({
  xdr,
  networkPassphrase,
}: OperationNamesFromXdrProps) => {
  if (!xdr) {
    return null;
  }

  try {
    const transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase) as
      | Transaction
      | FeeBumpTransaction;
    const operationNames = getOperations(transaction).map(({ type }) =>
      formatOperationName(type),
    );
    const visibleOperationNames = operationNames.slice(
      0,
      MAX_VISIBLE_OPERATIONS,
    );
    const hasMoreOperations = operationNames.length > MAX_VISIBLE_OPERATIONS;

    if (!operationNames.length) {
      return null;
    }

    return (
      <Box gap="xs">
        <Text size="xs" as="div">
          Operation type
        </Text>
        <Box gap="xs" direction="row">
          {visibleOperationNames.map((operationName, index) => (
            <Badge variant="secondary" key={`${operationName}-${index + 1}`}>
              {operationName}
            </Badge>
          ))}
        </Box>
        {hasMoreOperations && (
          <Text size="xs" as="div">
            Showing first 5 operations. See the transaction in{" "}
            <SdsLink
              href={buildEndpointHref(Routes.VIEW_XDR, {
                blob: xdr,
                type: "TransactionEnvelope",
              })}
              target="_blank"
              isUnderline
              variant="secondary"
            >
              XDR viewer
            </SdsLink>{" "}
            for the complete list.
          </Text>
        )}
      </Box>
    );
  } catch {
    return null;
  }
};
