import { Box } from "@/components/layout/Box";
import { WithInfoText } from "@/components/WithInfoText";
import "./styles.scss";

export const InfoFieldItem = ({
  label,
  value,
  isValueLoaded,
  infoText,
}: {
  label: string;
  value: React.ReactNode;
  isValueLoaded: boolean;
  infoText?: React.ReactNode;
}) => {
  return (
    <Box gap="xs" direction="row" align="center" addlClassName="InfoFieldItem">
      <div className="InfoFieldItem__label">
        {infoText ? (
          <WithInfoText infoText={infoText}>{label}</WithInfoText>
        ) : (
          label
        )}
      </div>
      {isValueLoaded ? (
        <div className="InfoFieldItem__value">{value ?? "-"}</div>
      ) : null}
    </Box>
  );
};
