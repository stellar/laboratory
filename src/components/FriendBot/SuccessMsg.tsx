import { Alert } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

export const SuccessMsg = ({
  onClose,
  publicKey,
  isVisible,
}: {
  onClose: () => void | undefined;
  publicKey: string;
  isVisible: boolean;
}) => {
  const { network } = useStore();
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
          ? `https://stellar.expert/explorer/${network.id}/account/${publicKey}`
          : undefined
      }
      onClose={onClose}
      title={`Successfully funded ${shortenStellarAddress(publicKey)} on 
    ${network.id}`}
    >
      {""}
    </Alert>
  ) : null;
};
