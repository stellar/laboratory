import { Box } from "@/components/layout/Box";
import "./styles.scss";

export const InfoFieldItem = ({
  label,
  value,
  isValueLoaded,
}: {
  label: string;
  value: React.ReactNode;
  isValueLoaded: boolean;
}) => {
  return (
    <Box gap="xs" direction="row" align="center" addlClassName="InfoFieldItem">
      <div className="InfoFieldItem__label">{label}</div>
      {isValueLoaded ? (
        <div className="InfoFieldItem__value">{value ?? "-"}</div>
      ) : null}
    </Box>
  );
};
