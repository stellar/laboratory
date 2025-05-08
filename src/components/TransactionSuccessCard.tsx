import { Button } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrLink } from "@/components/XdrLink";
import { getBlockExplorerLink } from "@/helpers/getBlockExplorerLink";
import { openUrl } from "@/helpers/openUrl";
import { NetworkType, SubmitRpcResponse } from "@/types/types";

interface TransactionSuccessCardProps {
  response: SubmitRpcResponse;
  network: NetworkType;
  isBlockExplorerEnabled?: boolean;
}

export const TransactionSuccessCard = ({
  response,
  network,
  isBlockExplorerEnabled = false,
}: TransactionSuccessCardProps) => {
  return (
    <ValidationResponseCard
      variant="success"
      title="Transaction submitted!"
      subtitle={`Transaction succeeded with ${response.operationCount} operation(s)`}
      note={<></>}
      footerLeftEl={
        isBlockExplorerEnabled ? (
          <>
            <Button
              size="md"
              variant="tertiary"
              onClick={() => {
                const BLOCK_EXPLORER_LINK =
                  getBlockExplorerLink("stellar.expert")[network];

                openUrl(`${BLOCK_EXPLORER_LINK}/tx/${response.hash}`);
              }}
            >
              View on stellar.expert
            </Button>

            <Button
              size="md"
              variant="tertiary"
              onClick={() => {
                const BLOCK_EXPLORER_LINK =
                  getBlockExplorerLink("stellarchain.io")[network];

                openUrl(`${BLOCK_EXPLORER_LINK}/transactions/${response.hash}`);
              }}
            >
              View on stellarchain.io
            </Button>
          </>
        ) : null
      }
      response={
        <Box gap="xs">
          <TxResponse
            data-testid="submit-tx-rpc-success-hash"
            label="Hash:"
            value={response.hash}
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-ledger"
            label="Ledger number:"
            value={response.result.ledger.toString()}
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-envelope-xdr"
            label="Envelope XDR:"
            item={
              <XdrLink
                xdr={response.result.envelopeXdr.toXDR("base64").toString()}
                type="TransactionEnvelope"
              />
            }
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-xdr"
            label="Result XDR:"
            item={
              <XdrLink
                xdr={response.result.resultXdr.toXDR("base64").toString()}
                type="TransactionResult"
              />
            }
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-meta-xdr"
            label="Result Meta XDR:"
            item={
              <XdrLink
                xdr={response.result.resultMetaXdr.toXDR("base64").toString()}
                type="TransactionMeta"
              />
            }
          />
          <TxResponse label="Fee:" value={response.fee} />
        </Box>
      }
    />
  );
};
