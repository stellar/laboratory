import { Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

import "./styles.scss";

export const NoInfoLoadedView = ({
  message,
  type = "info",
}: {
  message: React.ReactNode;
  type?: "info" | "error";
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
        {type === "error" ? <Icon.XSquare /> : <Icon.FileCode02 />}
        {message}
      </Box>
    </Box>
  );
};
