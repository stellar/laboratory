import "./styles.scss";

import { Box } from "@/components/layout/Box";

export const TxResponse = ({
  label,
  value,
  item,
}: {
  label: string;
  value?: string | number;
  item?: React.ReactNode;
}) => (
  <Box gap="xs">
    <div>{label}</div>
    <div className="TxResponse__value">{value || item}</div>
  </Box>
);
