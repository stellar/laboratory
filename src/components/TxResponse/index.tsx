import "./styles.scss";

import { Box } from "@/components/layout/Box";

export const TxResponse = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Box gap="xs">
    <div>{label}</div>
    <div className="TxResponse__value">{value}</div>
  </Box>
);
