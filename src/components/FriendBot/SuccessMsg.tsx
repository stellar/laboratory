import { Alert } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

export const SuccessMsg = ({
  onClose,
  isVisible,
}: {
  onClose: () => void | undefined;
  isVisible: boolean;
}) => {
  const { account, network } = useStore();
  const IS_STELLAR_EXPERT_ENABLED =
    network.id === "testnet" || network.id === "mainnet";

  return isVisible ? (
    <Alert
      placement="inline"
      variant="success"
      actionLabel={
        IS_STELLAR_EXPERT_ENABLED ? "View on stellar.expert" : undefined
      }
      actionLink={
        IS_STELLAR_EXPERT_ENABLED
          ? `https://stellar.expert/explorer/${network.id}/account/${account.publicKey}`
          : undefined
      }
      onClose={onClose}
      title={`Successfully funded ${shortenStellarAddress(account.publicKey!)} on 
    ${network.id}`}
    >
      {""}
    </Alert>
  ) : null;
};
