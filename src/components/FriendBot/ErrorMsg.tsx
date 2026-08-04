import { Notification } from "@stellar/design-system";

export const ErrorMsg = ({
  onClose,
  isVisible,
  errorMsg,
}: {
  onClose: () => void | undefined;
  isVisible: boolean;
  errorMsg: string | undefined;
}) =>
  isVisible ? (
    <Notification variant="error" onClose={onClose} title={errorMsg || ""} />
  ) : null;
