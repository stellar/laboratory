import { Alert } from "@stellar/design-system";

export const ErrorMsg = ({
  onClose,
  isVisible,
  errorMsg,
}: {
  onClose: () => void | undefined;
  isVisible: boolean;
  errorMsg: string | undefined;
}) => {
  return isVisible ? (
    <Alert
      placement="inline"
      variant="error"
      onClose={onClose}
      title={errorMsg}
    >
      {""}
    </Alert>
  ) : null;
};
