import { useEffect, useState } from "react";
import { Badge, Button, Card, Heading, Icon } from "@stellar/design-system";

import { ClassicOpPrettyJson } from "@/components/StellarDataRenderer";

import { Box } from "@/components/layout/Box";

const PAGE_SIZE = 5;

type ClassicOperation = {
  body: any;
};

export const ClassicOperations = ({
  operations,
}: {
  operations: ClassicOperation[];
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);

  useEffect(() => {
    setTotalPageCount(Math.ceil(operations.length / PAGE_SIZE));
  }, [operations.length]);

  // @TODO to be replaced with an empty state component
  if (!operations.length) {
    return (
      <div className="TransactionClassicOperations">
        <Card>
          <Box gap="lg">
            <Heading size="sm" as="h4">
              No operations found
            </Heading>
          </Box>
        </Card>
      </div>
    );
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedOperations = operations.slice(startIndex, endIndex);

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
    <div className="TransactionClassicOperations">
      <Card>
        <Box gap="lg">
          <Heading as="h2" size="xs" weight="medium">
            Operations
          </Heading>

          {paginatedOperations.map((operation, index) => {
            const actualIndex = startIndex + index;

            // Check if operation.body is a string (e.g., "end_sponsoring_future_reserves")
            const isBodyString = typeof operation.body === "string";

            const operationType: string = isBodyString
              ? operation.body
              : Object.keys(operation.body)[0];

            const operationData = isBodyString
              ? null
              : operation.body[operationType];

            const isPrimitive = typeof operationData !== "object";

            return (
              <div
                key={actualIndex}
                className="TransactionClassicOperations__operation"
              >
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
                        <div className="TransactionClassicOperations__operationDetails">
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
            <Box
              gap="md"
              direction="row"
              align="center"
              wrap="wrap"
              justify="end"
            >
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
      </Card>
    </div>
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
