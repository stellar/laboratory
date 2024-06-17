import {
  AccountRequiresMemoError,
  BadResponseError,
  NetworkError,
} from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

interface ErrorProps {
  error: NetworkError & {
    response: {
      data?: {
        extras?: {
          result_codes?: string;
          result_xdr?: string;
        };
      };
    };
  };
}

export const ErrorResponse = ({ error }: ErrorProps) => {
  let message = "",
    extras = null;
  if (error instanceof AccountRequiresMemoError) {
    message = "This destination requires a memo.";
    extras = (
      <Box gap="xs">
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
      <Box gap="xs">
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
      <Box gap="xs">
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
