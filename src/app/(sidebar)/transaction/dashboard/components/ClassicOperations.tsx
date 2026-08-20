"use client";

import { Card, Heading } from "@stellar/design-system";

import {
  ClassicOperationJson,
  ClassicOperationsList,
} from "@/components/ClassicOperationsList";
import { Box } from "@/components/layout/Box";

const PAGE_SIZE = 5;

export const ClassicOperations = ({
  operations,
}: {
  operations: ClassicOperationJson[];
}) => {
  // @TODO to be replaced with an empty state component
  if (!operations.length) {
    return (
      <div className="TransactionClassicOperations">
        <Card>
          <Box gap="sm">
            <Heading size="sm" as="h4">
              No operations found
            </Heading>
          </Box>
        </Card>
      </div>
    );
  }

  return (
    <div className="TransactionClassicOperations">
      <Card>
        <Box gap="sm">
          <Heading as="h2" size="xs" weight="medium">
            Operations
          </Heading>

          <ClassicOperationsList operations={operations} pageSize={PAGE_SIZE} />
        </Box>
      </Card>
    </div>
  );
};
