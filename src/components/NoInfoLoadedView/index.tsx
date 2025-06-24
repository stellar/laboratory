import { Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

import "./styles.scss";

export const NoInfoLoadedView = ({ message }: { message: React.ReactNode }) => {
  return (
    <Box
      gap="sm"
      align="center"
      justify="center"
      addlClassName="NoInfoLoadedView"
    >
      <Box gap="xs" direction="row" align="center" justify="center" wrap="wrap">
        <Icon.FileCode02 />
        {message}
      </Box>
    </Box>
  );
};
