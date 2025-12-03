import { Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

export const TransactionTabEmptyMessage = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Box
    gap="sm"
    align="center"
    justify="center"
    addlClassName="TransactionTab__emptyMessage"
  >
    <Text as="div" size="sm" weight="medium">
      {children}
    </Text>
  </Box>
);
