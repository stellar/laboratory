import { Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import "./StellarExpertNotAvailable.scss";

export const StellarExpertNotAvailable = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  return (
    <Box gap="sm" direction="row" align="start" addlClassName="SENotAvailable">
      <Icon.InfoCircle />
      <Box gap="xs">
        <div className="SENotAvailable__title">{title}</div>
        <div className="SENotAvailable__message">{message}</div>
      </Box>
    </Box>
  );
};
