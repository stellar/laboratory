"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Icon } from "@stellar/design-system";

import { ClassicOpPrettyJson } from "@/components/StellarDataRenderer";
import { Box } from "@/components/layout/Box";

import "./styles.scss";

/**
 * A classic operation in its XDR JSON form, e.g.
 * `{ body: { payment: { destination, asset, amount } } }`. Operations without
 * a body payload are plain strings, e.g. `"end_sponsoring_future_reserves"`.
 */
export type ClassicOperationJson = {
  body: any;
};

/** Operation type as it appears in XDR JSON, e.g. `create_account`. */
export const getClassicOperationType = (op: ClassicOperationJson): string =>
  typeof op.body === "string" ? op.body : Object.keys(op.body)[0];

/**
 * List of classic operations rendered from XDR JSON: a card per operation with
 * its type badge and a label/value row per field.
 *
 * Renders the list only — the surrounding card, heading, filters and empty
 * state belong to the caller, since they differ between the transaction
 * dashboard and the transaction flow.
 *
 * @param operations - Operations to render, in XDR JSON form
 * @param pageSize - Operations shown per page; omit to render all of them
 *   without pagination controls
 */
export const ClassicOperationsList = ({
  operations,
  pageSize,
}: {
  operations: ClassicOperationJson[];
  pageSize?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPageCount = pageSize
    ? Math.max(1, Math.ceil(operations.length / pageSize))
    : 1;

  // The list can shrink (filtering, or a different transaction), leaving the
  // current page out of range.
  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPageCount));
  }, [totalPageCount]);

  const startIndex = pageSize ? (currentPage - 1) * pageSize : 0;
  const visibleOperations = pageSize
    ? operations.slice(startIndex, startIndex + pageSize)
    : operations;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPageCount, prev + 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPageCount);
  };

  return (
    <Box gap="md" addlClassName="ClassicOperationsList">
      {visibleOperations.map((operation, index) => {
        const actualIndex = startIndex + index;

        // Operations with no fields are a plain string, e.g.
        // "end_sponsoring_future_reserves".
        const isBodyString = typeof operation.body === "string";

        const operationType = getClassicOperationType(operation);

        const operationData = isBodyString
          ? null
          : operation.body[operationType];

        const isPrimitive = typeof operationData !== "object";

        return (
          <div key={actualIndex} className="ClassicOperationsList__operation">
            <Card>
              <Box gap="md">
                <Box
                  gap="md"
                  direction="row"
                  align="center"
                  justify="space-between"
                >
                  <Badge variant="secondary">{operationType}</Badge>
                </Box>
                {operationData !== null && (
                  <Card variant="secondary">
                    <div className="ClassicOperationsList__operationDetails">
                      {isPrimitive ? (
                        <InfoField label="value" value={operationData} />
                      ) : (
                        Object.keys(operationData).map((val, idx) => (
                          <InfoField
                            label={val}
                            value={operationData[val]}
                            key={idx}
                          />
                        ))
                      )}
                    </div>
                  </Card>
                )}
              </Box>
            </Card>
          </div>
        );
      })}

      {/* Pagination Controls */}
      {totalPageCount > 1 && (
        <Box gap="md" direction="row" align="center" wrap="wrap" justify="end">
          <Box gap="xs" direction="row" align="center">
            {/* First page */}
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            >
              First
            </Button>

            {/* Previous page */}
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowLeft />}
              aria-label="Previous page"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            />

            {/* Page count */}
            <div className="DataTable__pagination">{`Page ${currentPage} of ${totalPageCount}`}</div>

            {/* Next page */}
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.ArrowRight />}
              onClick={handleNextPage}
              disabled={currentPage === totalPageCount}
            />

            {/* Last page */}
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleLastPage}
              disabled={currentPage === totalPageCount}
            >
              Last
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const InfoField = ({ label, value }: { label: string; value: any }) => {
  return (
    <Box gap="xs" direction="row" addlClassName="InfoFieldItem">
      <div className="InfoFieldItem__label">{getLabel(label)}</div>
      <div className="InfoFieldItem__value">
        <ClassicOpPrettyJson value={value} />
      </div>
    </Box>
  );
};

// =============================================================================
// Helpers
// =============================================================================

// Capitalizes and adds spaces to labels
const getLabel = (label: string) => {
  const withSpaces = label.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};
