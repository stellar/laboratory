import { Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

import "./styles.scss";

export const NoInfoLoadedView = ({
  message,
  type = "info",
  action,
}: {
  message: React.ReactNode;
  type?: "info" | "error";
  action?: React.ReactNode;
}) => {
  return (
    <Box
      gap="sm"
      align="center"
      justify="center"
      addlClassName="NoInfoLoadedView"
      data-type={type}
    >
      <Box gap="xs" direction="row" align="center" justify="center" wrap="wrap">
        {type === "error" ? <Icon.XSquare /> : null}
        {message}
        {action}
      </Box>
    </Box>
  );
};
