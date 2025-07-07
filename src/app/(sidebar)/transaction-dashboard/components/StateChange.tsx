import { Text } from "@stellar/design-system";
import { RpcTxJsonResponse } from "@/types/types";

export const StateChange = ({
  txDetails,
  isActive,
}: {
  txDetails: RpcTxJsonResponse | null;
  isActive: boolean;
}) => {
  // TODO: temp for testing
  console.log("txDetails: ", txDetails);
  console.log("isActive: ", isActive);

  return (
    <Text as="div" size="sm" weight="regular">
      Coming soon
    </Text>
  );
};
