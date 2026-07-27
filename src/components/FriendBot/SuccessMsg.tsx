import { Notification } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getBlockExplorerLink } from "@/helpers/getBlockExplorerLink";
import { openUrl } from "@/helpers/openUrl";

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
  const BLOCK_EXPLORER_LINK =
    IS_STELLAR_EXPERT_ENABLED &&
    getBlockExplorerLink("stellar.expert")[network.id];

  return isVisible ? (
    <Notification
      variant="success"
      actionLabel={BLOCK_EXPLORER_LINK ? "View on stellar.expert" : undefined}
      onAction={() =>
        BLOCK_EXPLORER_LINK &&
        openUrl(`${BLOCK_EXPLORER_LINK}/account/${publicKey}`)
      }
      onClose={onClose}
      title={`Successfully funded ${shortenStellarAddress(publicKey)} on 
    ${network.id}`}
    >
      {""}
    </Notification>
  ) : null;
};
