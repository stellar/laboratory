import { Icon } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

export const MessageField = ({
  message,
  isError,
}: {
  message: string;
  isError?: boolean;
}) => {
  return (
    <Box
      gap="xs"
      addlClassName={`SignTx__note FieldNote FieldNote--${isError ? "error" : "success"}`}
      direction="row"
      align="center"
    >
      <span>{message}</span>
      {isError ? <Icon.XCircle /> : <Icon.CheckCircle />}
    </Box>
  );
};
