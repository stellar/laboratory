import "./styles.scss";

import { Box } from "@/components/layout/Box";
import { NoTranslate } from "@/components/NoTranslate";

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
    <div className="TxResponse__value">
      <NoTranslate>{value || item}</NoTranslate>
    </div>
  </Box>
);
