import "./styles.scss";

import { Box } from "@/components/layout/Box";

export const TxResponse = ({
  label,
  value,
  item,
}: {
  label?: string;
  value?: string | number;
  item?: React.ReactNode;
}) => (
  <Box gap="xs">
    {label ? <div>{label}</div> : null}
    <div className="TxResponse__value">{value || item}</div>
  </Box>
);
