import { NewValidationResponseCard } from "@/components/NewValidationResponseCard";
import { Box } from "@/components/layout/Box";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

interface TransactionXdrDisplayProps {
  xdr: string;
  networkPassphrase: string;
  txnHash: string;
  dataTestId: string;
  txType: "classic" | "smart contract";
}

/**
 * Displays built transaction XDR with network passphrase, hash, and a
 * "View in XDR viewer" button. Signing is handled by the flow footer's
 * "Next" button, so no sign action is needed here.
 *
 * @param xdr - The built transaction envelope XDR (base64)
 * @param networkPassphrase - The network passphrase used to build the tx
 * @param txnHash - The transaction hash (hex)
 * @param dataTestId - Test ID for the response container
 * @param txType - Transaction type for tracking events
 *
 * @example
 * <TransactionXdrDisplay
 *   xdr={builtXdr}
 *   networkPassphrase={network.passphrase}
 *   txnHash={hash}
 *   dataTestId="build-transaction-envelope-xdr"
 *   txType="classic"
 * />
 */
export const TransactionXdrDisplay = ({
  xdr,
  networkPassphrase,
  txnHash,
  dataTestId,
  txType,
}: TransactionXdrDisplayProps) => (
  <NewValidationResponseCard
    variant="success"
    response={
      <Box gap="xs" data-testid={dataTestId}>
        <div>
          <div>Network passphrase:</div>
          <div>{networkPassphrase}</div>
        </div>
        <div>
          <div>Hash:</div>
          <div>{txnHash}</div>
        </div>
        <div>
          <div>XDR:</div>
          <div>{xdr}</div>
        </div>
      </Box>
    }
    footerRightEl={
      <ViewInXdrButton
        xdrBlob={xdr}
        callback={() => {
          trackEvent(TrackingEvent.TRANSACTION_BUILD_VIEW_IN_XDR, { txType });
        }}
      />
    }
  />
);
