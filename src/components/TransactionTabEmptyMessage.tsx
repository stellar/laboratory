import { Notification } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

export const TransactionTabEmptyMessage = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box gap="sm" align="center" justify="center">
    <Notification variant="primary" title={title}>
      {children}
    </Notification>
  </Box>
);
