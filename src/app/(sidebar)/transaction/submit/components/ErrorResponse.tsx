import {
  AccountRequiresMemoError,
  BadResponseError,
} from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { PrettyJson } from "@/components/PrettyJson";

import {
  SubmitHorizonError,
  SubmitRpcError,
  SubmitRpcErrorStatus,
} from "@/types/types";

export const HorizonErrorResponse = ({
  error,
}: {
  error: SubmitHorizonError;
}) => {
  let message = "",
    extras = null;
  if (error instanceof AccountRequiresMemoError) {
    message = "This destination requires a memo.";
    extras = (
      <Box gap="xs" data-testid="submit-tx-horizon-error-memo">
        <TxResponse label="Destination account:" value={error.accountId} />
        <TxResponse label="Operation index:" value={error.operationIndex} />
      </Box>
    );
  } else if (
    error?.response &&
    error.response.data?.extras?.result_codes &&
    error.response.data?.extras.result_xdr
  ) {
    const { result_codes, result_xdr } = error.response.data.extras;
    message = error.message;
    extras = (
      <Box gap="xs" data-testid="submit-tx-horizon-error-extras">
        <TxResponse
          label="extras.result_codes:"
          value={JSON.stringify(result_codes)}
        />

        <TxResponse label="Result XDR:" value={result_xdr} />
      </Box>
    );
  } else {
    message =
      error instanceof BadResponseError
        ? "Received a bad response when submitting."
        : "An unknown error occurred.";
    extras = (
      <Box gap="xs" data-testid="submit-tx-horizon-error">
        <TxResponse
          label="original error:"
          value={JSON.stringify(error, null, 2)}
        />
      </Box>
    );
  }

  return (
    <ValidationResponseCard
      variant="error"
      title="Transaction failed!"
      subtitle={message}
      response={extras}
    />
  );
};

export const RpcErrorResponse = ({ error }: { error: SubmitRpcError }) => {
  const getTitle = (status: SubmitRpcErrorStatus) => {
    switch (status) {
      case "DUPLICATE":
        return "Duplicate transaction";
      case "TIMEOUT":
        return "Transaction timed out";
      case "TRY_AGAIN_LATER":
      case "ERROR":
      case "FAILED":
      default:
        return "Transaction failed";
    }
  };

  const errorFields = () => {
    const { hash, errorResult, diagnosticEvents } = error.result;

    return (
      <>
        {hash ? (
          <Box gap="xs">
            <TxResponse label="Transaction hash:" value={hash} />
          </Box>
        ) : null}
        {errorResult ? (
          <Box gap="xs" data-testid="submit-tx-rpc-error">
            <TxResponse
              label="Error result:"
              item={<PrettyJson json={errorResult} />}
            />
          </Box>
        ) : null}
        {diagnosticEvents ? (
          <Box gap="xs">
            <TxResponse
              label="Diagnostic events:"
              item={<PrettyJson json={diagnosticEvents} />}
            />
          </Box>
        ) : null}
      </>
    );
  };

  return (
    <ValidationResponseCard
      variant="error"
      title={getTitle(error.status)}
      response={errorFields()}
    />
  );
};
